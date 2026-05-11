import { SafetyMemento } from "./SafetyMemento";

export class SafetyCaretaker {
  constructor(maxSnapshots = 20) {
    this._history = [];
    this._maxSnapshots = maxSnapshots;
  }

  push(memento) {
    if (!(memento instanceof SafetyMemento)) {
      throw new Error("Solo se pueden guardar instancias de SafetyMemento");
    }
    this._history.unshift(memento);
    if (this._history.length > this._maxSnapshots) {
      this._history.pop();
    }
  }

  getById(id) {
    return this._history.find((m) => m.getId() === id) ?? null;
  }

  peek() {
    return this._history[0] ?? null;
  }

  remove(id) {
    const idx = this._history.findIndex((m) => m.getId() === id);
    if (idx === -1) return false;
    this._history.splice(idx, 1);
    return true;
  }

  clear() {
    this._history = [];
  }

  getAll() {
    return [...this._history];
  }

  get size() {
    return this._history.length;
  }
}