import { BaseEventEmitter } from "../domain/events";
import type { FileMetadata } from "../domain/interfaces";
import type { SenderEvents } from "../domain/types";
import type { ISender } from "./ISender";

class ChunkProducer {
    private offset = 0;

    onload?: (buffer: ArrayBuffer | null) => void;

    constructor(
        private file: File,
        private chunkSize: number
    ) {}

    async read() {
        if (!this.onload) return;

        if (this.offset >= this.file.size) {
            this.onload(new ArrayBuffer());

            return;
        }

        const slice = this.file.slice(this.offset, this.offset + this.chunkSize);
        const buffer = await slice.arrayBuffer();

        this.offset += this.chunkSize;

        this.onload(buffer);
    }

    abort() {
        if (!this.onload) return;

        this.onload(null);
    }

    getProgress(): number {
        return Math.round((this.offset / this.file.size) * 100);
    }
    
    reset() {
        this.offset = 0;
    }
}

export class FileSenderService extends BaseEventEmitter<SenderEvents> implements ISender {
    private HEADER_SIZE = 5;
    private CHUNK_SIZE = 64 * 1024;

    private producer: ChunkProducer | null = null;

    private currentFileIndex = 0;
    private isPaused = false;

    constructor() {
        super();
    }

    async send(dataChannel: RTCDataChannel, peerId: string, file: File) {
        if (this.producer) return;

        this.isPaused = false;

        this.sendMetadata(dataChannel, file);
        this.initFlowController(dataChannel);

        this.emit("onstart", peerId);

        const a = await this.estimateRTCSendSpeed(dataChannel);
        console.log(a)

        return new Promise<void>(async (resolve, reject) => {
            this.producer = new ChunkProducer(file, this.CHUNK_SIZE);
            this.producer!.onload = (buffer) => {
                if (!buffer) {
                    this.emit("onerror", peerId, "File transfer cancelled.");
                    reject();

                    this.producer!.onload = undefined;
                    this.producer = null;

                    return;
                }

                if (buffer.byteLength === 0) {
                    this.sendFinalStatus(dataChannel, peerId, this.currentFileIndex, "DONE");
                    this.emit("oncomplete", peerId, file.name);

                    this.currentFileIndex++;

                    this.producer!.onload = undefined;
                    this.producer = null;

                    resolve();
                    return;
                }

                const fullChunk = this.wrapWithHeader(buffer, this.currentFileIndex);
                dataChannel.send(fullChunk);

                const progress = this.producer!.getProgress();
                this.emit("onprogress", peerId, progress);

                !this.isPaused && dataChannel.bufferedAmount <= dataChannel.bufferedAmountLowThreshold && this.producer?.read();
            }

            this.producer.read();
        });
    }

    pause() {
        if (this.isPaused) return;

        this.isPaused = true;
    }

    resume() {
        if (!this.isPaused || !this.producer) return;

        this.isPaused = false;
        this.producer.read();
    }

    stop() {
        if (!this.producer) return;
        this.producer.abort();

        this.isPaused = true;
    }

    private async estimateRTCSendSpeed(dataChannel: RTCDataChannel): Promise<number> {
        return new Promise((resolve) => {
            const size = 128 * 1024; // 128KB
            const buffer = new Uint8Array(size).fill(1).buffer;
            const start = performance.now();
    
            const interval = setInterval(() => {
                if (dataChannel.bufferedAmount < 16384) {
                    clearInterval(interval);
                    const elapsed = performance.now() - start;
                    const kbps = (size / 1024) / (elapsed / 1000); // KB/s
                    resolve(kbps);
                }
            }, 10);
    
            dataChannel.send(buffer);
        });
    }    

    private initFlowController(dataChannel: RTCDataChannel) {
        dataChannel.bufferedAmountLowThreshold = 512 * 1024;

        dataChannel.onbufferedamountlow = (ev) => {
            if (!this.isPaused) {
                this.producer?.read();
            }
        }
    }

    private wrapWithHeader(chunk: ArrayBuffer, fileId: number): ArrayBuffer {
        const fullBuffer = new ArrayBuffer(this.HEADER_SIZE + chunk.byteLength);
        const view = new DataView(fullBuffer);
        const uint8view = new Uint8Array(fullBuffer);

        view.setUint8(0, 0x02);
        view.setUint32(1, fileId, true);

        uint8view.set(new Uint8Array(chunk), this.HEADER_SIZE);

        return fullBuffer;
    }

    private sendMetadata(dataChannel: RTCDataChannel, file: File) {
        const metadata: FileMetadata = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
        };

        const json = JSON.stringify({ metadata });
        const encoded = new TextEncoder().encode(json);
        const buffer = new ArrayBuffer(this.HEADER_SIZE + encoded.byteLength);

        const view = new DataView(buffer);
        const uint8view = new Uint8Array(buffer);

        view.setUint8(0, 0x01);
        view.setUint32(1, this.currentFileIndex, true);

        uint8view.set(encoded, this.HEADER_SIZE);

        dataChannel.send(buffer);
    }

    private sendFinalStatus(dataChannel: RTCDataChannel, peerId: string, fileId: number, status: "DONE" | "FAILED") {
        const statusEncoded = new TextEncoder().encode(status);
        const buffer = new ArrayBuffer(this.HEADER_SIZE + statusEncoded.byteLength);
        const view = new DataView(buffer);
        const uint8view = new Uint8Array(buffer);

        view.setUint8(0, 0x03);
        view.setUint32(1, fileId, true);

        uint8view.set(statusEncoded, this.HEADER_SIZE);

        dataChannel.send(buffer);
    }
}