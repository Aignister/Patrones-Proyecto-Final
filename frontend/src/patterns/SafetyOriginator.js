import { SafetyMemento } from "./SafetyMemento";

export class SafetyConfig {
  constructor(initialState = {}) {
    this._state = {
      masterOn: false,
      windows: false,
      doors: false,
      seatbelt: false,
      speed: false,
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

  clone() {
    return new SafetyConfig({ ...this._state });
  }

  save() {
    return new SafetyMemento(this._state);
  }

  restore(memento) {
    if (!(memento instanceof SafetyMemento)) {
      throw new Error("El argumento debe ser una instancia de SafetyMemento");
    }
    this._state = { ...memento.getState() };
  }
}