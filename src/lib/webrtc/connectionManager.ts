import { FileReceiver, FileTransfer } from "./fileTransfer";
import { Peer } from "./peer";
import { SignalingClient, type SignalingMessage } from "./signaling";

type Role = "transfer" | "receive";
type ConnParams = {
    url: string;
    selectedFiles?: FileList;
    role?: Role;
    room_id?: string;
}

export class ConnectionManager {
    private signaling: SignalingClient | null = null;
    private fileReceiver: FileReceiver | null = null;
    private peer: Peer | null = null;
    private _selectedFiles?: FileList;
    private _role: Role = "transfer";
    private _room_id: string = "";

    oncreate?: (message: SignalingMessage) => void;
    onjoin?: (message: SignalingMessage) => void;
    onerror?: (message: SignalingMessage) => void;
    onprogressupdate?: (sp: number) => void;
    ontransferstart?: () => void
    onreceivefile?: (file: File) => void;

    constructor(connParams: ConnParams) {        
        if (connParams.role) this._role = connParams.role;
        if (connParams.selectedFiles) this._selectedFiles = connParams.selectedFiles;
        if (connParams.room_id) this._room_id = connParams.room_id;

        const isCaller = (this._role === "transfer") ? true : false;

        this.signaling = new SignalingClient(connParams.url);
        this.peer = new Peer(this.signaling, isCaller);

        this.initSignaling();
        this.initPeer();
    }

    private initSignaling() {
        if (!this.signaling || !this.peer) return;

        this.signaling.onopen = (event) => {
            const message: SignalingMessage = {
                type: "join",
                payload: {
                    room_id: (this._room_id === "") ? null : this._room_id
                }
            }
    
            this.signaling?.send(message);
        }

        this.signaling.onMessage(async (message) => {
            if (!this.signaling) return;

            if (message.type === "create") {
                console.log(message);
    
                this.signaling.clientId = message.payload.client_id as string;
                if (this.oncreate) this.oncreate(message);
            }

            else if (message.type === "join") {
                console.log(message);

                this.signaling.clientId = message.payload.client_id;
                this.signaling.peerId = message.payload.peer_id;

                if (this.onjoin) this.onjoin(message);
            }

            else if (message.type === "error") {
                if (this.onerror) this.onerror(message);
            }
            
            else if (message.type === "ready") {
                console.log(message);

                if (!this.signaling || !this.peer) return;
                
                this.signaling.peerId = message.payload.peer_id;
                await this.peer.start()
            }
        })
    }

    private initPeer() {
        if (!this.peer) return;

        this.peer.on('open', () => {
            if (!this.signaling || !this.peer) return;

            if (this._role === "transfer") this.startFileTransfer();
            else this.fileReceiver = this.createFileReceiver();
        });
    
        if (this._role === "receive") {
            this.peer.on('message', (buffer) => {
                this.fileReceiver?.startReceivingFiles(buffer);
            });
        }
    
        this.peer.on('error', (err) => console.error('Peer error', err));
        this.peer.on('close', () => console.log('Bağlantı kapandı.'));
    }

    private sendByeMessage() {
        const message: SignalingMessage = {
            type: "bye",
            payload: {}
        }

        this.signaling?.send(message);
    }

    private startFileTransfer() {
        if (!this.peer) return;

        this.sendByeMessage();

        if (this._selectedFiles && this._selectedFiles.length > 0) {
            const fileTransfer = new FileTransfer(this._selectedFiles, this.peer, this.onprogressupdate);
            if (this.ontransferstart) this.ontransferstart();
            
            fileTransfer.startFileTransfer();
        }
    }

    private createFileReceiver() {
        const fileReceiver = new FileReceiver();

        fileReceiver.onupdate = this.onprogressupdate;
        fileReceiver.oncomplete = this.onreceivefile;

        return fileReceiver;
    }
    
    connect() {
        if (!this.signaling) return;

        this.signaling.connect();
    }

    readyToFileReceive() {
        if (!this.signaling) return;

        const message: SignalingMessage = {
            type: "ready",
            payload: {
                peer_id: this.signaling.clientId
            }
        };

        this.signaling.send(message);
    }

    close() {
        this.signaling?.close();
        this.peer?.close()
    }
}