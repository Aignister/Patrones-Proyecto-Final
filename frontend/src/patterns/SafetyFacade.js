import {
  ToggleMasterCommand,
  ToggleControlCommand,
  SetSpeedCommand,
  CommandInvoker,
} from "./SafetyCommands";

export class SafetyFacade {
  #config;
  #caretaker;
  #invoker;

  constructor(config, caretaker) {
    this.#config = config;
    this.#caretaker = caretaker;
    this.#invoker = new CommandInvoker(30);
  }

  toggleMaster() {
    const cmd = new ToggleMasterCommand(this.#config);
    this.#invoker.execute(cmd);
  }

  toggleControl(key) {
    const cmd = new ToggleControlCommand(this.#config, key);
    this.#invoker.execute(cmd);
  }

  setSpeedValue(value) {
    const cmd = new SetSpeedCommand(this.#config, value);
    this.#invoker.execute(cmd);
  }

  undoLastAction() {
    return this.#invoker.undo();
  }

  canUndo() {
    return this.#invoker.canUndo();
  }

  undoDescription() {
    return this.#invoker.peekDescription();
  }

  saveSnapshot() {
    const memento = this.#config.save();
    this.#caretaker.push(memento);
    return memento;
  }

  restoreSnapshot(id) {
    const memento = this.#caretaker.getById(id);
    if (!memento) return false;
    this.#config.restore(memento);
    this.#invoker.clear();
    return true;
  }

  deleteSnapshot(id) {
    return this.#caretaker.remove(id);
  }

  clearSnapshots() {
    this.#caretaker.clear();
  }

  getSnapshots() {
    return this.#caretaker.getAll();
  }

  cloneCurrentState() {
    return this.#config.clone().getState();
  }

  loadClonedState(state) {
    this.#config = this.#config.clone(); 
    Object.entries(state).forEach(([key, val]) => {
      if (key === "masterOn") { this.#config.setMaster(val); return; }
      if (key === "speedValue") { this.#config.setSpeedValue(val); return; }
      if (typeof val === "boolean" && this.#config.get(key) !== val) {
        this.#config.toggle(key);
      }
    });
    this.#invoker.clear();
  }

  getState() {
    return this.#config.getState();
  }
}