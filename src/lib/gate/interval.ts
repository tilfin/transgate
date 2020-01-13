import { GateItem } from "./type"

/**
 * Interval Gate for Input providing items at regular intervals
 */
export class IntervalGate {

  private _intervalMS: number
  private _fire: Function | null
  private _isFirst: boolean
  private _timer: NodeJS.Timeout | null

  /**
   * @param {number} seconds - receiving to be resolved every specified seconds
   */
  constructor(seconds: number) {
    this._intervalMS = seconds * 1000;
    this._fire = null;
    this._isFirst = true;
    this._timer = null;
  }

  /**
   * Item is `{ time: <Date> }`.
   * @return {Promise} - A promise that resolves an item when the item is written
   */
  receive(): Promise<IntervalGateItem> {
    if (this._fire) {
      return Promise.reject(new Error('Do not double receive'));
    }

    if (this._isFirst) {
      this._isFirst = false;
      const now = new Date();
      this._kickTimer(now);
      return Promise.resolve({ time: now });
    }

    return new Promise(resolve => {
      this._fire = resolve;
    });
  }

  /**
   * Stop
   */
  clear() {
    const tmr = this._timer;
    if (tmr) clearTimeout(tmr);
    this._timer = null;

    const fire = this._fire;
    if (fire) fire(null); // mark terminator
    this._fire = null;

    this._isFirst = true; // revert initial
  }

  _kickTimer(origin: Date) {
    const nowTime = new Date().getTime();
    let nextTime = origin.getTime() + this._intervalMS;
    while (nextTime <= nowTime) {
      nextTime += this._intervalMS;
    }

    const waitFor = nextTime - nowTime;

    this._timer = setTimeout(() => {
      this._timer = null;
      const now = new Date();

      if (this._fire) {
        const fire = this._fire;
        this._fire = null;
        fire({ time: now });
      } // skip if _fire is null, because it means that receive not called

      this._kickTimer(now);
    }, waitFor);
  }
}

export interface IntervalGateItem extends GateItem {
  time: Date
}
