import { BaseEventEmitter } from '../domain/events';
import type { SignalingEvents, SignalingMessage } from '../domain/types';
import type { ISignalingService } from './ISignalingService';

export class SignalingService extends BaseEventEmitter<SignalingEvents> implements ISignalingService {
    private isConnected: boolean = false;
    private socket: WebSocket | null = null;

    constructor(private serverUrl: string) {
        super();
    }

    connect(): void {
        if (this.isConnected) return;

        this.socket = new WebSocket(this.serverUrl);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data) as SignalingMessage;
            const type = data.type as keyof SignalingEvents;

            this.emit(type, data.payload);
        };

        this.socket.onopen = () => {
            this.isConnected = true;
            this.emit('connected');
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            this.emit('disconnected', "Connection closed");
        };

        this.socket.onerror = () => {
            this.disconnect();
            
            this.emit('error', "Connection error");
        };
    }

    disconnect(): void {
        if (!this.socket) return;

        try {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        } catch (error) {
            console.error('Sinyal sunucusundan ayrılırken hata:', error);
            this.emit("error", error);
        }
    }
    
    async sendBye() {
        await this.send("bye", {});
        
        this.disconnect();
    }

    async send(type: string, payload: any): Promise<void> {
        if (!this.isConnected || !this.socket) {
            this.emit("error", 'Sinyal sunucusuna bağlı değil');
            return;
        }

        try {
            const message = JSON.stringify({
                type: type,
                payload: payload
            });

            this.socket.send(message);
        } catch (error) {
            this.emit("error", error);
            return;
        }
    }

    async sendOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.isConnected || !this.socket) {
            this.emit("error", 'Sinyal sunucusuna bağlı değil');
            return;
        }

        try {
            const message = JSON.stringify({
                type: 'offer',
                payload: {
                    peer_id: peerId,
                    offer: offer
                }
            });

            this.socket.send(message);
        } catch (error) {
            this.emit("error", error);
            return;
        }
    }

    async sendAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.isConnected || !this.socket) {
            this.emit("error", 'Sinyal sunucusuna bağlı değil');
            return;
        }

        try {
            const message = JSON.stringify({
                type: 'answer',
                payload: {
                    peer_id: peerId,
                    answer: answer
                }
            });

            this.socket.send(message);
        } catch (error) {
            console.error('Answer gönderirken hata:', error);
            this.emit("error", error);

            return;
        }
    }

    async sendIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
        if (!this.isConnected || !this.socket) {
            this.emit("error", 'Sinyal sunucusuna bağlı değil');
            return;
        }

        try {
            const message = JSON.stringify({
                type: 'candidate',
                payload: {
                    peer_id: peerId,
                    candidate: candidate
                }
            });

            this.socket.send(message);
        } catch (error) {
            console.error('ICE candidate gönderirken hata:', error);
            this.emit("error", error);

            return;
        }
    }
}