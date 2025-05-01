import { BaseEventEmitter } from "../domain/events";
import type { FileMetadata } from "../domain/interfaces";
import type { ReceiverEvents } from "../domain/types";
import type { IReceiver } from "./IReceiver";

export class FileReceiverService extends BaseEventEmitter<ReceiverEvents> implements IReceiver {
    private receivedFiles: Map<number, { meta: FileMetadata, chunks: ArrayBuffer[], receivedBytes: number }> = new Map();
    
    constructor() {
        super();
    }

    receive(peerId: string, event: MessageEvent) {
        const buffer = event.data as ArrayBuffer;
        if (buffer.byteLength < 6) return;

        const view = new DataView(buffer);
        const messageType = view.getUint16(0, true);
        const fileId = view.getUint32(2, true);

        if (messageType === 0x01) {
            this.handleFileInfo(buffer.slice(6), fileId);
        }
        else if (messageType === 0x02) {
            this.handleFileChunk(peerId, buffer.slice(6), fileId)
        }
        else if (messageType === 0x03) {
            const status = new TextDecoder().decode(buffer.slice(6));
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