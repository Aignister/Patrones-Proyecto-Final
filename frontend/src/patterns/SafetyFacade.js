// ── Patrón Facade ─────────────────────────────────────────────────────────────
//
// SafetyFacade pone una interfaz simple delante de tres subsistemas que el
// dashboard necesita coordinar:
//   • SafetyConfig      (Originator del patrón Memento + Prototype)
//   • SafetyCaretaker   (Caretaker del patrón Memento)
//   • CommandInvoker    (patrón Command)
//
// Sin Facade, SafetyDashboard y useUsers tienen que conocer el orden correcto
// de las llamadas ("primero ejecuta el comando, luego sincroniza, luego
// notifica"). Con Facade esa lógica vive aquí, en un solo lugar.
//
// Lo que Facade NO hace: no oculta los subsistemas. SafetyConfig, Caretaker
// e Invoker siguen siendo accesibles directamente si se necesitan.
// ─────────────────────────────────────────────────────────────────────────────

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
    this.#config    = config;
    this.#caretaker = caretaker;
    this.#invoker   = new CommandInvoker(30);
  }

  // ── Acciones de configuración (via Command) ───────────────────────────────

  // Activa o desactiva el modo de seguridad principal
  toggleMaster() {
    const cmd = new ToggleMasterCommand(this.#config);
    this.#invoker.execute(cmd);
  }

  // Activa o desactiva un control de bloqueo (windows, doors, seatbelt, speed)
  toggleControl(key) {
    const cmd = new ToggleControlCommand(this.#config, key);
    this.#invoker.execute(cmd);
  }

  // Cambia el valor del límite de velocidad
  setSpeedValue(value) {
    const cmd = new SetSpeedCommand(this.#config, value);
    this.#invoker.execute(cmd);
  }

  // ── Undo (Command) ────────────────────────────────────────────────────────

  // Deshace la última acción granular. Devuelve la descripción de lo deshecho
  // o null si no había nada en la pila.
  undoLastAction() {
    return this.#invoker.undo();
  }

  canUndo() {
    return this.#invoker.canUndo();
  }

  // Texto del último comando para mostrar en el botón de undo
  undoDescription() {
    return this.#invoker.peekDescription();
  }

  // ── Snapshots (Memento via Prototype) ─────────────────────────────────────

  // Guarda un snapshot del estado actual en el Caretaker
  saveSnapshot() {
    const memento = this.#config.save();
    this.#caretaker.push(memento);
    return memento;
  }

  // Restaura el estado desde un snapshot del historial
  restoreSnapshot(id) {
    const memento = this.#caretaker.getById(id);
    if (!memento) return false;
    this.#config.restore(memento);
    // Al restaurar un perfil completo, la pila de comandos ya no es coherente
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

  // ── Prototype ─────────────────────────────────────────────────────────────

  // Devuelve una copia del estado actual como objeto plano.
  // Se usa en el origen antes de copiar a otro usuario.
  cloneCurrentState() {
    return this.#config.clone().getState();
  }

  // Carga un estado externo (producto de un clone()) directamente sobre el
  // SafetyConfig existente, sin reemplazar la Facade ni perder el Caretaker
  // ni el Invoker del usuario destino.
  // Esto es lo que hace que el Prototype funcione correctamente en React:
  // la instancia de Facade no cambia, por lo que syncConfig puede leer
  // el estado nuevo desde la misma referencia que React ya conoce.
  loadClonedState(state) {
    this.#config = this.#config.clone();          // nueva instancia limpia
    Object.entries(state).forEach(([key, val]) => {
      if (key === "masterOn")   { this.#config.setMaster(val); return; }
      if (key === "speedValue") { this.#config.setSpeedValue(val); return; }
      // Booleanos: solo toggle si el valor actual difiere del clonado
      if (typeof val === "boolean" && this.#config.get(key) !== val) {
        this.#config.toggle(key);
      }
    });
    // La pila de comandos del destino ya no corresponde al estado nuevo
    this.#invoker.clear();
  }

  // ── Lectura de estado ─────────────────────────────────────────────────────
  getState() {
    return this.#config.getState();
  }
}