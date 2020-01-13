export interface GateItem {
}

export interface OutGate<T extends GateItem> {
  send(item: T | null): Promise<void>
}

export interface InGate<T extends GateItem> {
  receive(): Promise<T | null>
}
