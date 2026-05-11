import { useState, useCallback, useRef } from "react";
import { SafetyConfig } from "../patterns/SafetyOriginator";
import { SafetyCaretaker } from "../patterns/SafetyCaretaker";
import { SafetyFacade } from "../patterns/SafetyFacade";
import { DEFAULT_USERS } from "../data/users";

export function useUsers() {
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

  const [configStates, setConfigStates] = useState(() =>
    Object.fromEntries(
      DEFAULT_USERS.map((u) => [u.id, new SafetyConfig(u.preset).getState()])
    )
  );

  const [snapshotMap, setSnapshotMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, []]))
  );

  const [canUndoMap, setCanUndoMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, false]))
  );

  const [lastActionMap, setLastActionMap] = useState(() =>
    Object.fromEntries(DEFAULT_USERS.map((u) => [u.id, null]))
  );
  const trackAction = useCallback((userId, label) => {
    setLastActionMap((prev) => ({ ...prev, [userId]: label }));
  }, []);

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

  const selectUser = useCallback((userId) => {
    setActiveUserId(userId);
  }, []);

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

  const copyConfigToUser = useCallback(
    (targetUserId) => {
      if (targetUserId === activeUserId) return;
      const stateSnapshot = facadesRef.current[activeUserId].cloneCurrentState();
      facadesRef.current[targetUserId].loadClonedState(stateSnapshot);
      syncConfig(targetUserId);
    },
    [activeUserId, syncConfig]
  );

  const activeUser = DEFAULT_USERS.find((u) => u.id === activeUserId);
  const activeState = configStates[activeUserId];
  const activeSnaps = snapshotMap[activeUserId];
  const activeCanUndo = canUndoMap[activeUserId] ?? false;
  const activeLastAction = lastActionMap[activeUserId] ?? null;

  return {
    users: DEFAULT_USERS,
    activeUser,
    activeUserId,
    selectUser,
    state: activeState,
    toggleMaster,
    toggleControl,
    setSpeedValue,
    canUndo: activeCanUndo,
    undoLastAction,
    undoDescription,
    snapshots: activeSnaps,
    saveSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    clearSnapshots,
    copyConfigToUser,
    lastAction: activeLastAction,
  };
}