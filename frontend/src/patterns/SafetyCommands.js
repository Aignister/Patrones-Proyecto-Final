export class SafetyCommand {
  execute() { throw new Error("execute() no implementado"); }
  undo() { throw new Error("undo() no implementado"); }
  describe() { return "Acción desconocida"; }
}

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

export class ToggleControlCommand extends SafetyCommand {
  #config;
  #key;
  #prevValue;

  constructor(config, key) {
    super();
    this.#config = config;
    this.#key = key;
  }

  execute() {
    this.#prevValue = this.#config.get(this.#key);
    this.#config.toggle(this.#key);
  }

  undo() {
    if (this.#config.get(this.#key) !== this.#prevValue) {
      this.#config.toggle(this.#key);
    }
  }

  describe() {
    const labels = {
      windows: "Ventanas",
      doors: "Puertas",
      seatbelt: "Cinturón",
      speed: "Velocidad",
    };
    const label = labels[this.#key] ?? this.#key;
    return this.#prevValue ? `Desactivó ${label}` : `Activó ${label}`;
  }
}

export class SetSpeedCommand extends SafetyCommand {
  #config;
  #newValue;
  #prevValue;

  constructor(config, newValue) {
    super();
    this.#config = config;
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

export class CommandInvoker {
  #stack   = [];
  #maxSize;

  constructor(maxSize = 30) {
    this.#maxSize = maxSize;
  }

  execute(command) {
    command.execute();
    this.#stack.push(command);
    if (this.#stack.length > this.#maxSize) {
      this.#stack.shift();
    }
  }

  undo() {
    const command = this.#stack.pop();
    if (!command) return null;
    command.undo();
    return command;
  }

  canUndo() {
    return this.#stack.length > 0;
  }

  peekDescription() {
    if (!this.canUndo()) return null;
    return this.#stack[this.#stack.length - 1].describe();
  }

  clear() {
    this.#stack = [];
  }

  get size() {
    return this.#stack.length;
  }
}