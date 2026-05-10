import { SafetyMemento } from "./SafetyMemento";

export class SafetyCaretaker {
  constructor(maxSnapshots = 20) {
    this._history = [];
    this._maxSnapshots = maxSnapshots;
  }

  // Guarda un nuevo Memento al inicio del historial
  push(memento) {
    if (!(memento instanceof SafetyMemento)) {
      throw new Error("Solo se pueden guardar instancias de SafetyMemento");
    }
    this._history.unshift(memento);
    if (this._history.length > this._maxSnapshots) {
      this._history.pop();
    }
  }

  // Devuelve el Memento por su Id
  getById(id) {
    return this._history.find((m) => m.getId() === id) ?? null;
  }

  // Devuelve el Memento mas reciente sin eliminarlo
  peek() {
    return this._history[0] ?? null;
  }

  // Elimina un Memento del historial por su Id
  remove(id) {
    const idx = this._history.findIndex((m) => m.getId() === id);
    if (idx === -1) return false;
    this._history.splice(idx, 1);
    return true;
  }

  // Elimina el historial completo
  clear() {
    this._history = [];
  }

  // Devuelve una copia del arreglo de los Mementos, los mas recientes primeros
  getAll() {
    return [...this._history];
  }

  get size() {
    return this._history.length;
  }
}