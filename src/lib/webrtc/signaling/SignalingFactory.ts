import type { ISignalingService } from './ISignalingService';
import { SignalingService } from './SignalingService';

export class SignalingServiceFactory {
    static createWebSocketService(url: string): ISignalingService {
        return new SignalingService(url);
    }

    static createOfflineService(): ISignalingService {
        throw new Error("Not implemented");
    }
}