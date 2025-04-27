import { SignalingClient } from './signaling';

type PeerEvents = {
    open: () => void;
    connected: () => void;
    message: (data: ArrayBuffer) => void;
    close: () => void;
    error: (error: Error) => void;
};

type EventHandler<K extends keyof PeerEvents> = (payload: Parameters<PeerEvents[K]>[0]) => void;

export class Peer {
    private connection: RTCPeerConnection;
    private channel: RTCDataChannel | null = null;
    private signaling: SignalingClient;
    private eventListeners: Partial<{ [K in keyof PeerEvents]: Set<EventHandler<K>> }> = {};
    private isCaller: boolean;

    constructor(signaling: SignalingClient, isCaller: boolean) {
        this.signaling = signaling;
        this.isCaller = isCaller;
        this.connection = this.createPeerConnection();

        this.signaling.onMessage(this.handleSignalingMessage.bind(this));

        if (this.isCaller) {
            this.setupDataChannel(this.connection.createDataChannel('file-transfer'));
        }
    }

    private createPeerConnection(): RTCPeerConnection {
        const configuration = {
            'iceServers': [
                {'urls': 'stun:stun.l.google.com:19302'},
                {'urls': 'stun:stun1.l.google.com:19302'},
                {'urls': 'stun:stun2.l.google.com:19302'}
            ]
        }
        const conn = new RTCPeerConnection(configuration);

        conn.onicecandidate = (event) => {
            if (event.candidate) {
                this.signaling.send({ type: 'candidate', payload: event.candidate });
            }
        };

        conn.ondatachannel = (event) => {
            this.setupDataChannel(event.channel);
        };

        conn.onconnectionstatechange = () => {
            switch (conn.connectionState) {
                case 'connected':
                    this.emit('connected');
                    break;
                case 'disconnected':
                case 'failed':
                case 'closed':
                    this.emit('close');
                    break;
            }
        };

        return conn;
    }

    private setupDataChannel(channel: RTCDataChannel) {
        this.channel = channel;

        channel.binaryType = 'arraybuffer';

        channel.onopen = () => {
            console.log('[Peer] DataChannel open');
            this.emit('open');
        };

        channel.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                this.emit('message', event.data);
            } else {
                console.warn('[Peer] Unknown message type', event.data);
            }
        };

        channel.onclose = () => {
            console.log('[Peer] DataChannel closed');
            this.emit('close');
        };

        channel.onerror = (error) => {
            this.emit('error', new Error(`DataChannel error: ${error}`));
        };
    }

    private async handleSignalingMessage(message: { type: string; payload: any }) {
        try {
            switch (message.type) {
                case 'offer':
                    await this.connection.setRemoteDescription(new RTCSessionDescription(message.payload));
                    const answer = await this.connection.createAnswer();
                    await this.connection.setLocalDescription(answer);
                    this.signaling.send({ type: 'answer', payload: this.connection.localDescription });
                    break;

                case 'answer':
                    await this.connection.setRemoteDescription(new RTCSessionDescription(message.payload));
                    break;

                case 'candidate':
                    await this.connection.addIceCandidate(new RTCIceCandidate(message.payload));
                    break;

                case 'bye':
                    this.close();
                    break;
            }
        } catch (err) {
            this.emit('error', err as Error);
            console.error('[Peer] Signaling message error:', err);
        }
    }

    async start() {
        const offer = await this.connection.createOffer();
        await this.connection.setLocalDescription(offer);
        this.signaling.send({ type: 'offer', payload: this.connection.localDescription });
    }

    send(data: ArrayBuffer) {
        if (this.channel && this.channel.readyState === 'open') {
            this.channel.send(data);
        } else {
            console.error('[Peer] Cannot send data, channel is not open.');
        }
    }

    on<K extends keyof PeerEvents>(event: K, handler: EventHandler<K>) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = new Set();
        }
        this.eventListeners[event]!.add(handler);
    }

    off<K extends keyof PeerEvents>(event: K, handler: EventHandler<K>) {
        this.eventListeners[event]?.delete(handler);
    }

    private emit<K extends keyof PeerEvents>(event: K, payload?: Parameters<PeerEvents[K]>[0]) {
        this.eventListeners[event]?.forEach((handler) => {
            handler(payload as any);
        });
    }

    close() {
        if (this.channel) {
            this.channel.close();
        }
        this.connection.close();
        this.signaling.send({ type: 'bye', payload: null });
    }
}
