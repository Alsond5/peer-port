import type { EventEmitter } from '../domain/events';
import type { PeerConnectionEvents } from '../domain/types';
import type { IReceiver } from '../transfer/IReceiver';
import type { ISender } from '../transfer/ISender';

export interface IPeerConnectionManager extends EventEmitter<PeerConnectionEvents> {
	connect(peerId: string): Promise<void>;
	setClientId(clientId: string): void;
	sendFile(peerId: string, file: File): Promise<void>;
	getConnectedPeers(): string[];
	getSender(): ISender;
	getReceiver(): IReceiver;
	disconnect(peerId: string): void;
}