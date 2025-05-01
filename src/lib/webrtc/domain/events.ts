export interface EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
    on<K extends keyof Events>(event: K, handler: Events[K]): void;
    off<K extends keyof Events>(event: K, handler: Events[K]): void;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
    removeAllListeners<K extends keyof Events>(event?: K): void;
}

export class BaseEventEmitter<Events extends Record<string, (...args: any[]) => void>> implements EventEmitter<Events> {
    private events: Map<keyof Events, Set<Events[keyof Events]>> = new Map();

    on<K extends keyof Events>(event: K, handler: Events[K]): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(handler);
    }

    off<K extends keyof Events>(event: K, handler: Events[K]): void {
        if (!this.events.has(event)) return;

        const callback = this.events.get(event)!;
        callback.delete(handler)
    }

    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void {
        if (!this.events.has(event)) return;

        this.events.get(event)!.forEach((handler) => {
            handler(...args);
        });
    }

    removeAllListeners<K extends keyof Events>(event?: K): void {
        if (event !== undefined) {
            if (this.events.has(event)) {
                this.events.get(event)!.clear();
                this.events.delete(event);
            }
        } else {
            this.events.clear();
        }
    }
}