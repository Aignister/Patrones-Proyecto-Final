// Contador global de perfiles
let _profileCounter = 0;

export class SafetyMemento {
  #state;
  #timestamp;
  #id;
  #profileNumber;

  constructor(state) {
    this.#state = Object.freeze({ ...state });
    this.#timestamp = new Date();
    this.#id = `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    _profileCounter += 1;
    this.#profileNumber = _profileCounter;
  }

  getState() {
    return { ...this.#state };
  }

  getTimestamp() {
    return this.#timestamp;
  }

  getId() {
    return this.#id;
  }

  getProfileNumber() {
    return this.#profileNumber;
  }

  // Regresa los perfiles en los labels
  getLabel() {
    return `Perfil ${this.#profileNumber}`;
  }

  describe() {
    const s = this.#state;
    if (!s.masterOn) return "Modo desactivado";
    const parts = [];
    if (s.windows)  parts.push("Ventanas");
    if (s.doors)    parts.push("Puertas");
    if (s.seatbelt) parts.push("Cinturón");
    if (s.speed)    parts.push(`Vel. ${s.speedValue} km/h`);
    return parts.length ? parts.join(" · ") : "Sin restricciones activas";
  }
}