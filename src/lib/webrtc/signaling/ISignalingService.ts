import type { EventEmitter } from '../domain/events';
import type { SignalingEvents } from '../domain/types';

export interface ISignalingService extends EventEmitter<SignalingEvents> {
    connect(): void;
    sendBye(): Promise<void>;
    disconnect(): void;
    send(type: string, payload: any): Promise<void>;
    sendOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void>;
    sendAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void>;
    sendIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void>;
}