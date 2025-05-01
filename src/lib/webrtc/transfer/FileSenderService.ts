import { BaseEventEmitter } from "../domain/events";
import type { FileMetadata } from "../domain/interfaces";
import type { SenderEvents } from "../domain/types";
import type { ISender } from "./ISender";

export class FileSenderService extends BaseEventEmitter<SenderEvents> implements ISender {
    private HEADER_SIZE = 6;
    private CHUNK_SIZE = 16384;

    private currentFileIndex: number = 0;
    private offset: number = 0;
    private reader: FileReader | null = null;
    private file: File | null = null;
    private isPaused: boolean = false;

    constructor() {
        super();
    }

    async send(dataChannel: RTCDataChannel, peerId: string, file: File) {
        this.file = file;
        this.offset = 0;
        this.isPaused = false;

        this.emit("onstart", (peerId));

        return new Promise<void>((resolve, reject) => {
            const fileId = this.currentFileIndex;
            this.reader = new FileReader();

            this.sendMetadata(dataChannel, file);
            const { fullBuffer, uint8view } = this.prepareChunkHeader(fileId);

            const onloadHandler = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const chunk = new Uint8Array(e.target.result as ArrayBuffer);
                    uint8view.set(chunk, this.HEADER_SIZE);

                    const sendSize = this.HEADER_SIZE + chunk.byteLength;

                    dataChannel.send(fullBuffer.slice(0, sendSize));
                    this.offset += chunk.byteLength;

                    const progress = Math.round((this.offset / file.size) * 100);
                    this.emit("onprogress", peerId, progress);

                    if (this.offset < file.size) {
                        !this.isPaused && this.sendNextChunk(file);
                    } else {
                        this.sendFinalStatus(dataChannel, peerId, fileId, "DONE")
                        this.emit("oncomplete", peerId, file.name);

                        this.offset = 0;

                        this.reader!.abort();
                        this.reader!.onload = null;

                        this.reader = null;
                        
                        resolve();
                    }
                } else {
                    this.sendFinalStatus(dataChannel, peerId, fileId, "FAILED");
                    this.emit("onerror", peerId, "An error occurred while sending the file.")
                    reject();
                }
            };

            this.reader.onload = onloadHandler;
            !this.isPaused && this.sendNextChunk(file);
        })
    }
    
    pause() {
        if (this.isPaused) return;

        console.log("Paused")
        
        this.isPaused = true;
        this.reader?.abort();
    }

    resume() {
        if (!this.file || !this.isPaused) return;

        this.isPaused = false;
        this.sendNextChunk(this.file);
    }

    private sendNextChunk(file: File) {
        const slice = file.slice(this.offset, this.offset + this.CHUNK_SIZE);
        this.reader!.readAsArrayBuffer(slice);
    }

    private sendMetadata(dataChannel: RTCDataChannel, file: File) {
        const metadata = this.createMetadata(file);

        dataChannel.send(metadata);
    }

    private prepareChunkHeader(fileId: number) {
        const fullBuffer = new ArrayBuffer(this.HEADER_SIZE + this.CHUNK_SIZE);

        const view = new DataView(fullBuffer);
        const uint8view = new Uint8Array(fullBuffer);

        view.setUint16(0, 0x02, true);
        view.setUint32(2, fileId, true);

        return { fullBuffer, uint8view }
    }

    private createMetadata(file: File) {
        const metadata: FileMetadata = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        };

        const fileInfoJson = JSON.stringify({ metadata });
        const fileInfoEncoded = new TextEncoder().encode(fileInfoJson);

        const totalLength = 6 + fileInfoEncoded.byteLength;
        const fullBuffer = new ArrayBuffer(totalLength);
        const view = new DataView(fullBuffer);
        const uint8View = new Uint8Array(fullBuffer);

        view.setUint16(0, 0x01, true);
        view.setUint32(2, this.currentFileIndex, true);

        uint8View.set(fileInfoEncoded, 6);

        return fullBuffer;
    }

    private sendFinalStatus(dataChannel: RTCDataChannel, peerId: string, fileId: number, status: "DONE" | "FAILED") {
        const statusText = new TextEncoder().encode(status);
        const buffer = new ArrayBuffer(this.HEADER_SIZE + statusText.byteLength);
        const view = new DataView(buffer);
        const uint8view = new Uint8Array(buffer);

        view.setUint16(0, 0x03, true);
        view.setUint32(2, fileId, true);
        uint8view.set(statusText, this.HEADER_SIZE);

        dataChannel.send(buffer);
    }
}