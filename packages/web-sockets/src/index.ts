export type WebSocketEventHandler = (data: unknown) => void;

export interface WebSocketConfig {
    url: string;
    protocols?: string | string[];
    reconnectAttempts?: number;
    reconnectInterval?: number;
}

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private config: Required<WebSocketConfig>;
    private handlers: Map<string, Set<WebSocketEventHandler>> = new Map();
    private reconnectCount = 0;

    constructor(config: WebSocketConfig) {
        this.config = {
            protocols: [],
            reconnectAttempts: 5,
            reconnectInterval: 3000,
            ...config,
        };
    }

    connect(): void {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
            this.reconnectCount = 0;
            this.emit('open', null);
        };

        this.ws.onclose = () => {
            this.emit('close', null);
            this.tryReconnect();
        };

        this.ws.onerror = (error) => {
            this.emit('error', error);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data as string);
                this.emit('message', data);
            } catch {
                this.emit('message', event.data);
            }
        };
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(data: unknown): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    on(event: string, handler: WebSocketEventHandler): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    off(event: string, handler: WebSocketEventHandler): void {
        this.handlers.get(event)?.delete(handler);
    }

    private emit(event: string, data: unknown): void {
        this.handlers.get(event)?.forEach((handler) => handler(data));
    }

    private tryReconnect(): void {
        if (this.reconnectCount < this.config.reconnectAttempts) {
            this.reconnectCount++;
            setTimeout(() => this.connect(), this.config.reconnectInterval);
        }
    }
}
