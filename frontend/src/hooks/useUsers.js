import { useState, useCallback, useRef } from "react";
import { SafetyConfig }    from "../patterns/SafetyOriginator";
import { SafetyCaretaker } from "../patterns/SafetyCaretaker";
import { SafetyFacade }    from "../patterns/SafetyFacade";
import { DEFAULT_USERS }   from "../data/users";

// ── useUsers ──────────────────────────────────────────────────────────────────
// Hook principal. Toda la lógica de configuración, historial y acciones
// ahora pasa por SafetyFacade (Facade), que a su vez orquesta internamente:
//   • SafetyConfig      → estado mutable (Originator + Prototype)
//   • SafetyCaretaker   → historial de snapshots (Caretaker de Memento)
//   • CommandInvoker    → pila de acciones desacopladas (Command)
// ─────────────────────────────────────────────────────────────────────────────

export function useUsers() {
  // Inicializa una Facade por cada usuario (contiene su propio Config,
  // Caretaker e Invoker). Se usa useRef para que las instancias persistan
  // entre re-renders sin ser recreadas.
  const facadesRef = useRef(null);

  if (facadesRef.current === null) {
    facadesRef.current = Object.fromEntries(
      DEFAULT_USERS.map((u) => [
        u.id,
        new SafetyFacade(
          new SafetyConfig(u.preset),
          new SafetyCaretaker(20)
        ),
      ])
    );
  }

  const [activeUserId, setActiveUserId] = useState(DEFAULT_USERS[0].id);

  // Estado de configuración por usuario (para re-render de React)
  const [configStates, setConfigStates] = useState(() =>
    Object.fromEntries(
      DEFAULT_USERS.map((u) => [u.id, new SafetyConfig(u.preset).getState()])
    )
  );

  // Snapshots del historial por usuario
  const [snapshotMap, setSnapshotMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, []]))
  );

  // Flag de undo disponible por usuario (para habilitar/deshabilitar el botón)
  const [canUndoMap, setCanUndoMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, false]))
  );

  // Última llamada recibida por la Facade — se muestra en FacadeDebugPanel
  const [lastActionMap, setLastActionMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, null]))
  );
  const trackAction = useCallback((userId, label) => {
    setLastActionMap((prev) => ({ ...prev, [userId]: label }));
  }, []);

  // ── Helpers de sincronización React ───────────────────────────────────────
  const syncConfig = useCallback((userId) => {
    setConfigStates((prev) => ({
      ...prev,
      [userId]: facadesRef.current[userId].getState(),
    }));
    setCanUndoMap((prev) => ({
      ...prev,
      [userId]: facadesRef.current[userId].canUndo(),
    }));
  }, []);

  const syncSnapshots = useCallback((userId) => {
    setSnapshotMap((prev) => ({
      ...prev,
      [userId]: facadesRef.current[userId].getSnapshots(),
    }));
  }, []);

  // ── Selección de usuario ───────────────────────────────────────────────────
  // Al cambiar de usuario la pila de Commands del anterior queda intacta;
  // cada usuario tiene su propio Invoker dentro de su Facade.
  const selectUser = useCallback((userId) => {
    setActiveUserId(userId);
  }, []);

  // ── Acciones de configuración (Facade → Command) ──────────────────────────

  const toggleMaster = useCallback(() => {
    facadesRef.current[activeUserId].toggleMaster();
    trackAction(activeUserId, "toggleMaster()");
    syncConfig(activeUserId);
  }, [activeUserId, syncConfig, trackAction]);

  const toggleControl = useCallback(
    (key) => {
      facadesRef.current[activeUserId].toggleControl(key);
      trackAction(activeUserId, `toggleControl("${key}")`);
      syncConfig(activeUserId);
    },
    [activeUserId, syncConfig, trackAction]
  );

  const setSpeedValue = useCallback(
    (value) => {
      facadesRef.current[activeUserId].setSpeedValue(value);
      trackAction(activeUserId, `setSpeedValue(${value})`);
      syncConfig(activeUserId);
    },
    [activeUserId, syncConfig, trackAction]
  );

  // ── Undo (Command via Facade) ─────────────────────────────────────────────
  const undoLastAction = useCallback(() => {
    const cmd = facadesRef.current[activeUserId].undoLastAction();
    if (!cmd) return null;
    trackAction(activeUserId, "undoLastAction()");
    syncConfig(activeUserId);
    return cmd;
  }, [activeUserId, syncConfig, trackAction]);

  const undoDescription = useCallback(() => {
    return facadesRef.current[activeUserId].undoDescription();
  }, [activeUserId]);

  // ── Acciones de Memento (Facade → Caretaker) ──────────────────────────────

  const saveSnapshot = useCallback(() => {
    const memento = facadesRef.current[activeUserId].saveSnapshot();
    trackAction(activeUserId, "saveSnapshot()");
    syncSnapshots(activeUserId);
    return memento;
  }, [activeUserId, syncSnapshots, trackAction]);

  const restoreSnapshot = useCallback(
    (id) => {
      const ok = facadesRef.current[activeUserId].restoreSnapshot(id);
      if (ok) {
        trackAction(activeUserId, "restoreSnapshot()");
        syncConfig(activeUserId);
        syncSnapshots(activeUserId);
      }
      return ok;
    },
    [activeUserId, syncConfig, syncSnapshots, trackAction]
  );

  const deleteSnapshot = useCallback(
    (id) => {
      facadesRef.current[activeUserId].deleteSnapshot(id);
      syncSnapshots(activeUserId);
    },
    [activeUserId, syncSnapshots]
  );

  const clearSnapshots = useCallback(() => {
    facadesRef.current[activeUserId].clearSnapshots();
    syncSnapshots(activeUserId);
  }, [activeUserId, syncSnapshots]);

  // ── Prototype: copiar config activa a otro usuario ────────────────────────
  // Clona el estado actual del usuario activo y lo carga en la Facade del
  // destino usando loadClonedState(). La Facade destino conserva su propio
  // Caretaker (historial de snapshots) e Invoker (pila de comandos);
  // solo su configuración activa cambia al estado clonado.
  // Después syncConfig(targetUserId) actualiza el estado React del destino,
  // por lo que el cambio es visible inmediatamente al cambiar de usuario.
  const copyConfigToUser = useCallback(
    (targetUserId) => {
      if (targetUserId === activeUserId) return;
      // 1. Obtener el estado actual del origen como objeto plano
      const stateSnapshot = facadesRef.current[activeUserId].cloneCurrentState();
      // 2. Cargarlo en la Facade del destino sin reemplazarla
      facadesRef.current[targetUserId].loadClonedState(stateSnapshot);
      // 3. Sincronizar React para el usuario destino
      syncConfig(targetUserId);
    },
    [activeUserId, syncConfig]
  );

  const activeUser    = DEFAULT_USERS.find((u) => u.id === activeUserId);
  const activeState   = configStates[activeUserId];
  const activeSnaps   = snapshotMap[activeUserId];
  const activeCanUndo = canUndoMap[activeUserId] ?? false;
  const activeLastAction = lastActionMap[activeUserId] ?? null;

  return {
    users: DEFAULT_USERS,
    activeUser,
    activeUserId,
    selectUser,
    // Configuración
    state: activeState,
    toggleMaster,
    toggleControl,
    setSpeedValue,
    // Undo granular (Command)
    canUndo: activeCanUndo,
    undoLastAction,
    undoDescription,
    // Historial de snapshots (Memento)
    snapshots: activeSnaps,
    saveSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    clearSnapshots,
    // Copia de config entre usuarios (Prototype)
    copyConfigToUser,
    // Última llamada a la Facade (para FacadeDebugPanel)
    lastAction: activeLastAction,
  };
}