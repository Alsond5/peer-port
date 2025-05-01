import type { EventEmitter } from "../domain/events";
import type { ReceiverEvents } from "../domain/types";

export interface IReceiver extends EventEmitter<ReceiverEvents> {
    receive(peerId: string, data: MessageEvent): void;
}