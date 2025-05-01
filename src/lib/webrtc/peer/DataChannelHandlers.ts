import type { IReceiver } from '../transfer/IReceiver';
import type { ISender } from '../transfer/ISender';

export class DataChannelHandlers {
    constructor(
        private sender: ISender,
        private receiver: IReceiver
    ) {

    }

    handleMessage(peerId: string, event: MessageEvent): void {
        try {
            this.receiver.receive(peerId, event);
        } catch (error) {
            console.error(`Veri kanalından gelen mesajı işlerken hata:`, error);
        }
    }

    async sendFile(dataChannel: RTCDataChannel, peerId: string, data: any): Promise<void> {
        try {
            await this.sender.send(dataChannel, peerId, data);
        } catch (error) {
            throw error;
        }
    }
    
    getSender() {
        return this.sender;
    }

    getReceiver() {
        return this.receiver;
    }
}