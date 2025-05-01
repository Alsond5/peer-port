import { BaseEventEmitter } from '../domain/events';
import type { IPeerConnectionManager } from './IPeerConnectionManager';
import type { ISignalingService } from '../signaling/ISignalingService';
import type { WebRTCConfig } from '../domain/interfaces';
import { DataChannelHandlers } from './DataChannelHandlers';
import type { PeerConnectionEvents } from '../domain/types';
import type { ISender } from '../transfer/ISender';
import type { IReceiver } from '../transfer/IReceiver';

export class PeerConnectionManager extends BaseEventEmitter<PeerConnectionEvents> implements IPeerConnectionManager {
    private peerConnections: Map<string, RTCPeerConnection> = new Map();
    private dataChannels: Map<string, RTCDataChannel> = new Map();
    private clientId: string = "";

    constructor(
        private signaling: ISignalingService,
        private config: WebRTCConfig,
        private dataChannelHandlers: DataChannelHandlers
    ) {
        super();

        this.setupSignalingListeners();
    }

    private setupSignalingListeners(): void {
        this.signaling.on('offer', this.handleOffer.bind(this));
        this.signaling.on('answer', this.handleAnswer.bind(this));
        this.signaling.on('candidate', this.handleIceCandidate.bind(this));
        this.signaling.on('disconnected', this.handlePeerDisconnect.bind(this));
    }

    async connect(peerId: string): Promise<void> {
        if (this.peerConnections.has(peerId)) {
            return;
        }

        try {
            const peerConnection = new RTCPeerConnection(this.config);

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.signaling.sendIceCandidate(this.clientId, event.candidate);
                }
            };

            peerConnection.onconnectionstatechange = () => {
                if (peerConnection.connectionState === 'connected') {
                    this.emit('peerconnected', peerId);
                } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
                    this.emit('peerdisconnected', peerId);

                    this.peerConnections.delete(peerId);
                    this.dataChannels.delete(peerId);
                }
            };

            const dataChannel = peerConnection.createDataChannel('file-transfer', { ordered: true, protocol: "raw-binary" });
            this.setupDataChannel(peerId, dataChannel);

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await this.signaling.sendOffer(this.clientId, offer);

            this.peerConnections.set(peerId, peerConnection);
        } catch (error) {
            console.error(`Peer ${peerId} ile bağlantı kurarken hata:`, error);
            throw error;
        }
    }

    setClientId(clientId: string) {
        this.clientId = clientId;
    }

    disconnect(peerId: string): void {
        const peerConnection = this.peerConnections.get(peerId);
        if (!peerConnection) return;

        try {
            peerConnection.close();
            this.peerConnections.delete(peerId);
            this.dataChannels.delete(peerId);

            this.emit('peerdisconnected', peerId);
        } catch (error) {
            console.error(`Peer ${peerId} bağlantısını kapatırken hata:`, error);
        }
    }

    async sendFile(peerId: string, file: File): Promise<void> {
        const dataChannel = this.dataChannels.get(peerId);
        if (!dataChannel || dataChannel.readyState !== 'open') {
            throw new Error(`${peerId} ile açık bir veri kanalı yok`);
        }

        await this.dataChannelHandlers.sendFile(dataChannel, peerId, file);
    }

    getConnectedPeers(): string[] {
        return Array.from(this.peerConnections.keys()).filter(peerId => {
            const connection = this.peerConnections.get(peerId);
            return connection && connection.connectionState === 'connected';
        });
    }

    getSender(): ISender {
        return this.dataChannelHandlers.getSender();
    }

    getReceiver(): IReceiver {
        return this.dataChannelHandlers.getReceiver();
    }

    private async handleOffer(payload: { peer_id: string, offer: RTCSessionDescriptionInit }): Promise<void> {
        try {
            const peerConnection = new RTCPeerConnection(this.config);

            console.log(payload.offer)

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.signaling.sendIceCandidate(this.clientId, event.candidate);
                }
            };

            peerConnection.onconnectionstatechange = () => {
                if (peerConnection.connectionState === 'connected') {
                    this.emit('peerconnected', payload.peer_id);
                } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
                    this.emit('peerdisconnected', payload.peer_id);

                    this.peerConnections.delete(payload.peer_id);
                    this.dataChannels.delete(payload.peer_id);
                }
            };

            peerConnection.ondatachannel = (event) => {
                this.setupDataChannel(payload.peer_id, event.channel);
            };

            await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await this.signaling.sendAnswer(this.clientId, answer);

            this.peerConnections.set(payload.peer_id, peerConnection);
        } catch (error) {
            console.error(`${payload.peer_id} kullanıcısından gelen offer işlenirken hata:`, error);
        }
    }

    private async handleAnswer(payload: { peer_id: string, answer: RTCSessionDescriptionInit }): Promise<void> {
        try {
            const peerConnection = this.peerConnections.get(payload.peer_id);
            if (!peerConnection) return;

            console.log(payload.answer);

            await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.answer));
        } catch (error) {
            console.error(`${payload.peer_id} kullanıcısından gelen answer işlenirken hata:`, error);
        }
    }

    private async handleIceCandidate(payload: { peer_id: string, candidate: RTCIceCandidateInit }): Promise<void> {
        try {
            const peerConnection = this.peerConnections.get(payload.peer_id);
            if (!peerConnection) return;

            console.log(payload.candidate);

            await peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (error) {
            console.error(`${payload.peer_id} kullanıcısından gelen ICE candidate işlenirken hata:`, error);
        }
    }

    private handlePeerDisconnect(payload: { peer_id: string }): void {
        this.disconnect(payload.peer_id);
    }

    private setupDataChannel(peerId: string, dataChannel: RTCDataChannel): void {
        dataChannel.binaryType = "arraybuffer";
        console.log(dataChannel.protocol)

        dataChannel.onopen = () => {
            this.dataChannels.set(peerId, dataChannel);
            this.emit('datachannelopen', peerId);
        };

        dataChannel.onclose = () => {
            this.dataChannels.delete(peerId);
            this.emit('datachannelclose', peerId);
        };

        dataChannel.onmessage = (event) => {
            this.dataChannelHandlers.handleMessage(peerId, event);
        };
    }
}