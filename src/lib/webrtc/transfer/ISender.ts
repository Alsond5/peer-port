import type { EventEmitter } from "../domain/events";
import type { SenderEvents } from "../domain/types";

export interface ISender extends EventEmitter<SenderEvents> {
    send(dataChannel: RTCDataChannel, peerId: string, data: any): Promise<void>;
    pause(): void;
    resume(): void;
}