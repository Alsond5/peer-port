// lib/webrtc/signaling.ts

export type SignalingMessage = {
    type: "join" | 'offer' | 'answer' | 'candidate' | 'ready' | 'bye';
    payload: any;
};

type Listener = (message: SignalingMessage) => void;

export class SignalingClient {
    private socket: WebSocket | null = null;
    private url: string;
    private reconnectInterval = 3000; // ms
    private listeners: Set<Listener> = new Set();
    private manuallyClosed = false;

    onopen: ((event: Event) => void) | null = null;

    constructor(url: string) {
        this.url = url;
    }

    private handleOpen = (event: Event) => {
        if (this.onopen !== null) {
            this.onopen(event);
        }
        console.log('[Signaling] Connected');
    };
    
    private handleMessage = (event: MessageEvent) => {
        console.log(event.data);
    
        try {
            const message: SignalingMessage = JSON.parse(event.data);
            this.listeners.forEach((listener) => listener(message));
        } catch (error) {
            console.error('[Signaling] Failed to parse message', error);
        }
    };
    
    private handleClose = (event: CloseEvent) => {
        console.warn('[Signaling] Connection closed', event.reason);
        if (!this.manuallyClosed) {
            setTimeout(() => this.connect(), this.reconnectInterval);
        }
    };
    
    private handleError = (event: Event) => {
        console.error('[Signaling] Error occurred', event);
        this.socket?.close();
    };

    connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return; // Already connecting or connected
        }

        this.manuallyClosed = false;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = this.handleOpen;
        this.socket.onmessage = this.handleMessage;
        this.socket.onclose = this.handleClose;
        this.socket.onerror = this.handleError;
    }

    send(message: SignalingMessage) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('[Signaling] Cannot send message, socket not open');
        }
    }

    onMessage(listener: Listener) {
        this.listeners.add(listener);
    }

    offMessage(listener: Listener) {
        this.listeners.delete(listener);
    }

    close() {
        this.manuallyClosed = true;

        if (this.socket) {
            this.socket.removeEventListener('open', this.handleOpen);
            this.socket.removeEventListener('message', this.handleMessage);
            this.socket.removeEventListener('close', this.handleClose);
            this.socket.removeEventListener('error', this.handleError);
        }
        
        this.socket?.close();
    }
}
