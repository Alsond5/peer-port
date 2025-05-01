export interface WebRTCConfig {
    iceServers: RTCIceServer[];
}

export interface FileMetadata {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface FileTransferStatus {
    peerId: string;
    fileName: string;
    progress: number;
    status: 'sending' | 'receiving' | 'completed' | 'failed';
}