export type WebRTCEventType = 
  | 'connected'
  | 'disconnected'
  | 'peer-connected'
  | 'peer-disconnected'
  | 'data-channel-open'
  | 'data-channel-close'
  | 'file-transfer-started'
  | 'file-transfer-progress'
  | 'file-received'
  | 'file-sent';

export type SignalingEvents = {
    join: (payload: any) => void;
    joined: (payload: any) => void;
    create: (payload: any) => void;
    offer: (payload: any) => void;
    answer: (payload: any) => void;
    candidate: (payload: any) => void;
    ready: (payload: any) => void;
    connected: () => void;
    disconnected: (payload: any) => void;
    bye: (payload: any) => void;
    error: (payload: any) => void;
}

export type SignalingMessage = {
    type: keyof SignalingEvents,
    payload: any
}

export type SignalingMethod = "online" | "offline";

export type TransferEvents = {
    onstart: (peerId: string) => void;
    onprogress: (peerId: string, progress: number) => void;
    oncomplete: (peerId: string, data: any) => void;
    onerror: (peerId: string, error: any) => void;
}

export type SenderEvents = TransferEvents & {
    onsent: (peerId: string, data: any) => void;
}

export type ReceiverEvents = TransferEvents & {
    ondata: (peerId: string, data: MessageEvent) => void;
}

export type PeerConnectionEvents = {
    peerconnected: (peerId: string) => void;
    peerdisconnected: (peerId: string) => void;
    datachannelopen: (peerId: string) => void;
    datachannelclose: (peerId: string) => void;
}