import { BaseEventEmitter } from "../domain/events";
import type { FileMetadata } from "../domain/interfaces";
import type { ReceiverEvents } from "../domain/types";
import type { IReceiver } from "./IReceiver";

export class FileReceiverService extends BaseEventEmitter<ReceiverEvents> implements IReceiver {
    private HEADER_SIZE = 5;

    private receivedFiles: Map<number, { meta: FileMetadata, chunks: ArrayBuffer[], receivedBytes: number }> = new Map();
    
    constructor() {
        super();
    }

    receive(peerId: string, event: MessageEvent) {
        const buffer = event.data as ArrayBuffer;
        if (buffer.byteLength < this.HEADER_SIZE) return;

        const view = new DataView(buffer);
        const messageType = view.getUint8(0);
        const fileId = view.getUint32(1, true);
        
        const chunk = buffer.slice(this.HEADER_SIZE);

        if (messageType === 0x01) {
            this.handleFileInfo(chunk, fileId);
        }
        else if (messageType === 0x02) {
            this.handleFileChunk(peerId, chunk, fileId)
        }
        else if (messageType === 0x03) {
            const status = new TextDecoder().decode(chunk);
            
            if (status === "DONE") {
                this.reconstructFile(peerId, fileId);
                return;
            }

            this.emit("onerror", peerId, "Error");
        }

        return;
    }

    private handleFileInfo(data: ArrayBuffer, fileId: number) {
        const json = new TextDecoder().decode(data);
        const { metadata }: { metadata: FileMetadata } = JSON.parse(json);

        this.receivedFiles.set(fileId, {
            meta: metadata,
            chunks: [],
            receivedBytes: 0
        });
    }
    
    private handleFileChunk(peerId: string, chunk: ArrayBuffer, fileId: number) {
        const fileRecord = this.receivedFiles.get(fileId);
        
        if (!fileRecord) {
            console.error(`Beklenmeyen dosya chunk'ı alındı: ${fileId}`);
            return;
        }

        fileRecord.chunks.push(chunk);
        fileRecord.receivedBytes += chunk.byteLength;

        const progress = Math.min(100, Math.floor(((fileRecord.receivedBytes) / fileRecord.meta.size) * 100));
        this.emit("onprogress", peerId, progress);
    }

    private reconstructFile(peerId: string, fileId: number) {
        const fileRecord = this.receivedFiles.get(fileId);
        if (!fileRecord) return;

        const { meta, chunks } = fileRecord;
        const blob = new Blob(chunks, { type: fileRecord.meta.type });
        const file = new File([blob], meta.name, { type: meta.type, lastModified: meta.lastModified });

        this.emit("oncomplete", peerId, file);

        this.receivedFiles.delete(fileId);
    }
}