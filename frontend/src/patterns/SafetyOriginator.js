import { SafetyMemento } from "./SafetyMemento";

export class SafetyConfig {
  constructor(initialState = {}) {
    this._state = {
      masterOn:   false,
      windows:    false,
      doors:      false,
      seatbelt:   false,
      speed:      false,
      speedValue: 60,
      ...initialState,
    };
  }

  getState() {
    return { ...this._state };
  }

  get(key) {
    return this._state[key];
  }

  setMaster(value) {
    this._state = { ...this._state, masterOn: value };
  }

  toggle(key) {
    if (!(key in this._state)) throw new Error(`Clave desconocida: ${key}`);
    this._state = { ...this._state, [key]: !this._state[key] };
  }

  setSpeedValue(value) {
    this._state = { ...this._state, speedValue: Number(value) };
  }

  // ── Patrón Prototype ──────────────────────────────────────────────────────
  // Devuelve una nueva instancia de SafetyConfig con una copia del estado
  // actual. A diferencia de save(), el clon es un objeto vivo y mutable;
  // no congela el estado ni lo registra en el historial.
  // Uso principal: copiar la configuración activa de un usuario a otro sin
  // pasar por el preset estático ni construir el estado a mano.
  clone() {
    return new SafetyConfig({ ...this._state });
  }

  // ── Patrón Memento ────────────────────────────────────────────────────────

  // Crea y devuelve un Memento con el estado actual (snapshot inmutable)
  save() {
    return new SafetyMemento(this._state);
  }

  // Restaura el estado desde un Memento
  restore(memento) {
    if (!(memento instanceof SafetyMemento)) {
      throw new Error("El argumento debe ser una instancia de SafetyMemento");
    }
    this._state = { ...memento.getState() };
  }
}