// ── Patrón Command ────────────────────────────────────────────────────────────
//
// Cada acción del usuario se encapsula en un objeto con execute() y undo().
// El CommandInvoker mantiene una pila de comandos ejecutados y permite
// deshacer la última acción sin restaurar un snapshot completo (Memento).
//
// Relación con Memento:
//   • Memento  → historial de perfiles completos, guardado intencionalmente.
//   • Command  → historial de acciones granulares dentro de la sesión activa.
//   Los dos coexisten sin conflicto: son dos niveles distintos de deshacer.
// ─────────────────────────────────────────────────────────────────────────────

// ── Interfaz base (convención JS) ────────────────────────────────────────────
export class SafetyCommand {
  execute() { throw new Error("execute() no implementado"); }
  undo()    { throw new Error("undo() no implementado"); }
  // Descripción legible para mostrar en la UI (historial de acciones)
  describe() { return "Acción desconocida"; }
}

// ── ToggleMasterCommand ───────────────────────────────────────────────────────
// Enciende o apaga el modo de seguridad principal.
// undo() restaura el valor previo exactamente, sin side-effects.
export class ToggleMasterCommand extends SafetyCommand {
  #config;
  #prevValue;

  constructor(config) {
    super();
    this.#config = config;
  }

  execute() {
    this.#prevValue = this.#config.get("masterOn");
    this.#config.setMaster(!this.#prevValue);
  }

  undo() {
    this.#config.setMaster(this.#prevValue);
  }

  describe() {
    return this.#prevValue ? "Desactivó modo seguridad" : "Activó modo seguridad";
  }
}

// ── ToggleControlCommand ─────────────────────────────────────────────────────
// Activa o desactiva uno de los controles de bloqueo (windows, doors, seatbelt, speed).
export class ToggleControlCommand extends SafetyCommand {
  #config;
  #key;
  #prevValue;

  constructor(config, key) {
    super();
    this.#config = config;
    this.#key    = key;
  }

  execute() {
    this.#prevValue = this.#config.get(this.#key);
    this.#config.toggle(this.#key);
  }

  undo() {
    // Vuelve al valor exacto anterior (no hace un segundo toggle,
    // evita bugs si el estado cambió externamente entre medio)
    if (this.#config.get(this.#key) !== this.#prevValue) {
      this.#config.toggle(this.#key);
    }
  }

  describe() {
    const labels = {
      windows:  "Ventanas",
      doors:    "Puertas",
      seatbelt: "Cinturón",
      speed:    "Velocidad",
    };
    const label = labels[this.#key] ?? this.#key;
    return this.#prevValue ? `Desactivó ${label}` : `Activó ${label}`;
  }
}

// ── SetSpeedCommand ───────────────────────────────────────────────────────────
// Cambia el valor del límite de velocidad.
export class SetSpeedCommand extends SafetyCommand {
  #config;
  #newValue;
  #prevValue;

  constructor(config, newValue) {
    super();
    this.#config   = config;
    this.#newValue = Number(newValue);
  }

  execute() {
    this.#prevValue = this.#config.get("speedValue");
    this.#config.setSpeedValue(this.#newValue);
  }

  undo() {
    this.#config.setSpeedValue(this.#prevValue);
  }

  describe() {
    return `Velocidad: ${this.#prevValue} → ${this.#newValue} km/h`;
  }
}

// ── CommandInvoker ────────────────────────────────────────────────────────────
// Ejecuta comandos y mantiene una pila para undo().
// La pila tiene un tamaño máximo configurable para evitar crecimiento ilimitado.
export class CommandInvoker {
  #stack   = [];
  #maxSize;

  constructor(maxSize = 30) {
    this.#maxSize = maxSize;
  }

  // Ejecuta el comando y lo apila
  execute(command) {
    command.execute();
    this.#stack.push(command);
    if (this.#stack.length > this.#maxSize) {
      this.#stack.shift(); // descarta el más antiguo
    }
  }

  // Deshace el último comando ejecutado
  undo() {
    const command = this.#stack.pop();
    if (!command) return null;
    command.undo();
    return command;
  }

  // Indica si hay algo que deshacer
  canUndo() {
    return this.#stack.length > 0;
  }

  // Descripción del último comando (para mostrar en el botón undo)
  peekDescription() {
    if (!this.canUndo()) return null;
    return this.#stack[this.#stack.length - 1].describe();
  }

  // Limpia la pila (al cambiar de usuario, el historial de acciones no aplica)
  clear() {
    this.#stack = [];
  }

  get size() {
    return this.#stack.length;
  }
}