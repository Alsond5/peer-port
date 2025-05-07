import { BaseEventEmitter, DataChannelHandlers, FileReceiverService, FileSenderService, PeerConnectionManager, SignalingServiceFactory, type EventEmitter, type IPeerConnectionManager, type ISignalingService, type PeerConnectionEvents, type ReceiverEvents, type SenderEvents, type SignalingEvents, type SignalingMethod, type WebRTCConfig } from "./webrtc";
import type { IReceiver } from "./webrtc/transfer/IReceiver";
import type { ISender } from "./webrtc/transfer/ISender";

export class FileTransferApp {
    private peerManager: IPeerConnectionManager;
    private signalingService: ISignalingService;

    public readonly signalEvents = new BaseEventEmitter() as EventEmitter<SignalingEvents>;
    public readonly peerEvents = new BaseEventEmitter() as EventEmitter<PeerConnectionEvents>;
    public readonly senderEvents = new BaseEventEmitter() as EventEmitter<SenderEvents>;
    public readonly receiverEvents = new BaseEventEmitter() as EventEmitter<ReceiverEvents>;

    constructor(method: SignalingMethod, signalServerUrl?: string) {
        const webRTCConfig: WebRTCConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ]
        };

        if (method === "online" && signalServerUrl) {
            this.signalingService = SignalingServiceFactory.createWebSocketService(signalServerUrl);
        } else if (method === "offline") {
            this.signalingService = SignalingServiceFactory.createOfflineService();
        } else {
            throw new Error("signalServerUrl required for 'online' mode.");
        }

        this.setupSignalEventListeners();

        const fileSender = new FileSenderService();
        this.setupSenderEventListeners(fileSender);

        const fileReceiver = new FileReceiverService();
        this.setupReceiverEventListeners(fileReceiver);

        const dataChannelHandlers = new DataChannelHandlers(fileSender, fileReceiver);

        this.peerManager = new PeerConnectionManager(this.signalingService, webRTCConfig, dataChannelHandlers);

        this.setupPeerEventListeners();
    }

    private setupSignalEventListeners() {
        this.signalingService.on("create", async (payload) => {
            this.peerManager.setClientId(payload.client_id);

            this.signalEvents.emit("create", payload);
        });

        this.signalingService.on("join", async (payload) => {
            this.peerManager.setClientId(payload.client_id);

            this.signalEvents.emit("join", payload);
        });

        this.signalingService.on("joined", async (payload) => {
            this.signalEvents.emit("joined", payload);
        });

        this.signalingService.on("ready", async (payload) => {
            const peerId = payload.peer_id as string;

            await this.peerManager.connect(peerId);
        });

        this.signalingService.on("bye", async (payload) => {
            this.signalingService.disconnect();
        });

        this.signalingService.on("error", (payload) => {
            this.signalEvents.emit("error", payload);
        });
    }

    private setupPeerEventListeners() {
        this.peerManager.on("peerconnected", (peerId: string) => {
            this.peerEvents.emit("peerconnected", peerId);
        });

        this.peerManager.on("peerdisconnected", (peerId: string) => {
            this.peerManager.getSender().stop();
            
            this.peerEvents.emit("peerdisconnected", peerId);
        });

        this.peerManager.on("datachannelopen", (peerId: string) => {
            this.peerEvents.emit("datachannelopen", peerId);
        });

        this.peerManager.on("datachannelclose", (peerId: string) => {
            this.peerManager.getSender().stop();
            
            this.peerEvents.emit("datachannelclose", peerId);
        });
    }

    private setupSenderEventListeners(fileSender: ISender) {
        fileSender.on("onstart", (peerId: string) => {
            this.senderEvents.emit("onstart", peerId);
        });

        fileSender.on("onprogress", (peerId: string, progress: number) => {
            this.senderEvents.emit("onprogress", peerId, progress);
        });

        fileSender.on("onsent", (peerId: string, data: any) => {
            this.senderEvents.emit("onsent", peerId, data);
        });

        fileSender.on("oncomplete", (peerId: string, data: any) => {
            this.senderEvents.emit("oncomplete", peerId, data);
        });

        fileSender.on("onerror", (peerId: string, error: any) => {
            this.senderEvents.emit("onerror", peerId, error);
        });
    }

    private setupReceiverEventListeners(fileReceiver: IReceiver) {
        fileReceiver.on("onstart", (peerId: string) => {
            this.receiverEvents.emit("onstart", peerId);
        });

        fileReceiver.on("onprogress", (peerId: string, progress: number) => {
            this.receiverEvents.emit("onprogress", peerId, progress);
        });

        fileReceiver.on("ondata", (peerId: string, data: MessageEvent) => {
            this.receiverEvents.emit("ondata", peerId, data);
        });

        fileReceiver.on("oncomplete", (peerId: string, data: any) => {
            this.receiverEvents.emit("oncomplete", peerId, data);
        });

        fileReceiver.on("onerror", (peerId: string, error: any) => {
            this.receiverEvents.emit("onerror", peerId, error);
        });
    }

    async connect(shareId?: string) {
        const connectedHandler = async () => {
            const type = "join";
            const payload = {
                share_id: shareId,
            }

            this.signalingService.send(type, payload);
        }

        this.signalingService.on("connected", connectedHandler);
        this.signalingService.connect();
    }

    async ready() {
        const type = "ready";
        const payload = {}

        this.signalingService.send(type, payload);
    }

    async sendFile(peerId: string, file: File): Promise<void> {
        try {
            await this.peerManager.sendFile(peerId, file);
            console.log(`${file.name} dosyası ${peerId}'e gönderiliyor...`);
        } catch (error) {
            console.error(`Dosya gönderirken hata:`, error);
        }
    }

    getConnectedPeers(): string[] {
        return this.peerManager.getConnectedPeers();
    }
    
    pause() {
        this.peerManager.getSender().pause();
    }

    resume() {
        this.peerManager.getSender().resume();
    }
    
    async closeSignalServerConnection() {
        await this.signalingService.sendBye();
    }

    async disconnect() {
        this.signalEvents.removeAllListeners();
        this.peerEvents.removeAllListeners();
        this.senderEvents.removeAllListeners();
        this.receiverEvents.removeAllListeners();

        if (this.peerManager) {
            this.peerManager.removeAllListeners();

            const connectedPeers = this.peerManager.getConnectedPeers();
            for (const peerId of connectedPeers) {
                this.peerManager.disconnect(peerId);
            }
        }

        if (this.signalingService) {
            this.signalingService.removeAllListeners();
            this.signalingService.disconnect();
        }

        // @ts-ignore
        this.peerManager = null;
        // @ts-ignore
        this.signalingService = null;

        console.log('FileTransferApp successfully disconnected');
    }
}