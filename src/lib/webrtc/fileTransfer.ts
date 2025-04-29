import type { Peer } from "./peer";

export class FileTransfer {
    private currentFileIndex = 0;
    private sendProgress = 0;
    private chunkSize = 16384;

    private selectedFiles: FileList | null = null;
    private peer: Peer | null = null;

    private totalSize: number = 0;
    private transferedBytes: number = 0;
    private currentOffset = 0;
    private currentReader: FileReader | null = null;

    isPaused = false;
    
    callback?: (sendProgress: number) => void

    constructor(selectedFiles: FileList, peer: Peer, callback?: (sendProgress: number) => void) {
        this.selectedFiles = selectedFiles;
        this.peer = peer;

        this.callback = callback;
    }

    // Dosya gönderme işlemini başlat
    startFileTransfer() {
        if (!this.selectedFiles || this.selectedFiles.length === 0) return;

        let currentTotalSize = 0;

        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];

            if (file) {
                currentTotalSize += file.size;
            }
        }

        this.totalSize = currentTotalSize;
        
        this.currentFileIndex = 0;
        this.sendProgress = 0;
        this.sendNextFile();
    }

    // Sıradaki dosyayı gönder
    async sendNextFile() {
        if (!this.selectedFiles || this.currentFileIndex >= this.selectedFiles.length) {
            return;
        }
        
        const sendingFile = this.selectedFiles[this.currentFileIndex];
        
        // Önce dosya meta verilerini gönder
        const fileInfo: FileMeta = {
            fileId: this.currentFileIndex,
            name: sendingFile.name,
            type: sendingFile.type,
            size: sendingFile.size,
            lastModified: sendingFile.lastModified,
            total: this.selectedFiles.length,
            totalSize: this.totalSize
        };

        const fileInfoJson = JSON.stringify({
            type: 'file-info',
            data: fileInfo
        });

        // Başlık (2 byte): Bu verinin file-info olduğunu belirtir
        const header = new ArrayBuffer(2); // 2 byte'lık başlık
        const headerView = new DataView(header);
        headerView.setUint16(0, 0x01, true); // 0x01, "file-info" tipini belirtir

        const fileInfoBuffer = new Blob([header, new TextEncoder().encode(fileInfoJson)]);

        if (this.isPaused) {
            return;
        }
        
        // Meta verileri JSON olarak gönder
        fileInfoBuffer.arrayBuffer().then((buff) => {
            this.peer?.send(buff);
        });
        
        // Ardından dosya içeriğini gönder
        await this.sendFileContent(sendingFile);
        
        // Sonraki dosyaya geç
        this.currentFileIndex++;
        this.sendNextFile();
    }

    // Dosya içeriğini chunk'lar halinde gönder
    async sendFileContent(file: File) {
        return new Promise<void>((resolve) => {
            this.currentReader = new FileReader();

            // Bir chunk oku ve gönder
            const readSlice = (offset: number) => {
                const slice = file.slice(offset, offset + this.chunkSize);
                this.currentReader!.readAsArrayBuffer(slice);
            };

            // Başlık (2 byte): Bu verinin file-info olduğunu belirtir
            const header = new ArrayBuffer(6); // 2 byte'lık başlık
            const headerView = new DataView(header);

            headerView.setUint16(0, 0x02, true); // 0x01, "file-info" tipini belirtir
            headerView.setUint32(2, this.currentFileIndex, true); // 2. byte'tan başlatıyoruz
            
            // Chunk okunduğunda
            this.currentReader.onload = (e) => {
                if (!e.target?.result) return;

                // Header'ı ve chunk'ı birleştir
                const fullBuffer = new Uint8Array(header.byteLength + (e.target.result as ArrayBuffer).byteLength);
                fullBuffer.set(new Uint8Array(header), 0);
                fullBuffer.set(new Uint8Array(e.target.result as ArrayBuffer), header.byteLength);
                
                if (this.isPaused) {
                    return;
                }

                // Chunk'ı gönder
                this.peer?.send(fullBuffer.buffer);
                
                // İlerlemeyi hesapla
                this.currentOffset += (e.target.result as ArrayBuffer).byteLength;
                this.sendProgress = Math.min(100, Math.floor(((this.transferedBytes + this.currentOffset) / this.totalSize) * 100));
                if (this.callback) this.callback(this.sendProgress);
                
                // Daha gönderilecek veri varsa devam et
                if (this.currentOffset < file.size) {
                    readSlice(this.currentOffset);
                } else {
                    // Bu dosyanın transferi tamamlandı
                    this.transferedBytes += this.currentOffset;
                    this.currentOffset = 0;
                    this.currentReader?.abort();

                    resolve();
                }
            };
            
            // İlk chunk'ı oku
            readSlice(this.currentOffset);
        });
    }

    pause() {
        this.isPaused = true;
        if (this.currentReader) {
            this.currentReader.abort();
        }
    }

    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;

        if (this.selectedFiles && this.currentFileIndex < this.selectedFiles.length) {
            const currentFile = this.selectedFiles[this.currentFileIndex];
            this.sendFileContent(currentFile);
        }
    }
}

export class FileReceiver {
    private receivedFiles: Map<number, { meta: FileMeta, chunks: Uint8Array[], totalBytes: number, receivedBytes: number }> = new Map();
    private totalReceivedBytes: number = 0;

    onupdate?: (receiveProgress: number) => void;
    oncomplete?: (file: File) => void;

    constructor() {
        this.onupdate = (progress) => {
            console.log(`Progress: ${progress}%`);
        };
    
        this.oncomplete = (file) => {
            console.log(`Dosya Tamamlandı: ${file.name}`);
        };
    }    

    // Dosya alımını başlat
    startReceivingFiles(buffer: ArrayBuffer) {
        const headerView = new DataView(buffer, 0, 2); // Başlık kısmı 2 byte
        const messageType = headerView.getUint16(0, true);

        // 0x01: file-info, 0x02: file-chunk
        if (messageType === 0x01) {
            // Dosya meta bilgisi
            this.handleFileInfo(buffer.slice(2)); // Header'dan sonra dosya bilgisi başlar
        } else if (messageType === 0x02) {
            // Dosya içeriği (chunk)
            this.handleFileChunk(buffer.slice(2));
        }
    }

    // Dosya meta bilgisi alındı
    private handleFileInfo(fileInfoBuffer: ArrayBuffer) {
        const json = new TextDecoder().decode(fileInfoBuffer);
        const { data }: { data: FileMeta } = JSON.parse(json);

        console.log(`Alınan dosya bilgisi: ${data.name}, Boyut: ${data.size} bytes`);
        this.receivedFiles.set(data.fileId, { meta: data, chunks: [], totalBytes: data.size, receivedBytes: 0 });
    }

    // Dosya içeriği chunk'ı alındı
    private handleFileChunk(fileChunkBuffer: ArrayBuffer) {
        const chunkView = new DataView(fileChunkBuffer);
        
        const fileId = chunkView.getUint32(0, true);
        const chunkData = new Uint8Array(fileChunkBuffer, 4);

        const fileRecord = this.receivedFiles.get(fileId);
        
        if (!fileRecord) {
            console.error(`Beklenmeyen dosya chunk'ı alındı: ${fileId}`);
            return;
        }

        fileRecord.chunks.push(chunkData);
        fileRecord.receivedBytes += chunkData.length;

        const progress = Math.min(100, Math.floor(((this.totalReceivedBytes + fileRecord.receivedBytes) / fileRecord.meta.totalSize) * 100));
        if (this.onupdate) this.onupdate(progress);
        
        if (fileRecord.totalBytes === fileRecord.receivedBytes) {
            this.totalReceivedBytes += fileRecord.receivedBytes;
            this.reconstructFile(fileId);
        }
    }

    // Tüm chunk'lar alındığında dosyayı birleştir
    private reconstructFile(fileId: number) {
        const fileRecord = this.receivedFiles.get(fileId);
        if (!fileRecord) return;

        const { meta, chunks } = fileRecord;
        const blob = new Blob(chunks);
        const file = new File([blob], meta.name, { type: meta.type, lastModified: meta.lastModified });

        console.log(`Dosya alındı: ${file.name}, Boyut: ${file.size} bytes`);

        if (this.oncomplete) this.oncomplete(file);

        this.receivedFiles.delete(fileId);
    }
}