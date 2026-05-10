import React, { useCallback, useState } from "react";
import { SquareStack, DoorOpen, ShieldAlert } from "lucide-react";

import Carro from "../images/Carro.png";
import { useUsers }          from "../hooks/useUsers";
import { useToggleSound }    from "../hooks/useToggleSound";
import { USER_COLORS }       from "../data/users";
import { MasterToggle }      from "../components/MasterToggle";
import { LockControlCard }   from "../components/LockControlCard";
import { SpeedSlider }       from "../components/SpeedSlider";
import { HistoryPanel }      from "../components/HistoryPanel";
import { UserSelector }      from "../components/UserSelector";
import { FacadeDebugPanel }  from "../components/FacadeDebugPanel";

const LOCK_CONTROLS = [
  { key: "windows",  title: "Ventanas bloqueadas",   icon: SquareStack },
  { key: "doors",    title: "Puertas bloqueadas",     icon: DoorOpen    },
  { key: "seatbelt", title: "Cinturón obligatorio",   icon: ShieldAlert },
];

function useToast() {
  const [message, setMessage] = useState(null);
  const show = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2200);
  }, []);
  return { message, show };
}

export function SafetyDashboard() {
  const {
    users, activeUser, activeUserId, selectUser,
    state,
    toggleMaster, toggleControl, setSpeedValue,
    // Command: undo granular
    canUndo, undoLastAction, undoDescription,
    // Memento: snapshots
    snapshots, saveSnapshot, restoreSnapshot, deleteSnapshot, clearSnapshots,
    // Prototype: copia de config entre usuarios
    copyConfigToUser,
    // Facade: última llamada para el panel visual
    lastAction,
  } = useUsers();

  const { message: toast, show: showToast } = useToast();
  const { playMaster, playControl } = useToggleSound();

  const colors = USER_COLORS[activeUser.color];

  // ── Wrappers con audio ──────────────────────────────────────────────────
  // Las llamadas van a Facade → Command → SafetyConfig.
  // El dashboard no sabe nada de SafetyConfig ni de CommandInvoker.
  const handleToggleMaster = useCallback(() => {
    playMaster(!state.masterOn);
    toggleMaster();
  }, [state.masterOn, toggleMaster, playMaster]);

  const handleToggleControl = useCallback(
    (key) => {
      playControl(key, !state[key]);
      toggleControl(key);
    },
    [state, toggleControl, playControl]
  );

  // ── Undo (Command) ──────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    const cmd = undoLastAction();
    if (cmd) showToast(`Deshecho: ${cmd.describe()}`);
  }, [undoLastAction, showToast]);

  // ── Memento ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    saveSnapshot();
    showToast(`Configuración de ${activeUser.name} guardada`);
  }, [saveSnapshot, showToast, activeUser.name]);

  const handleRestore = useCallback(
    (id) => {
      const ok = restoreSnapshot(id);
      if (ok) showToast("Configuración restaurada");
    },
    [restoreSnapshot, showToast]
  );

  const handleDelete = useCallback(
    (id) => { deleteSnapshot(id); showToast("Snapshot eliminado"); },
    [deleteSnapshot, showToast]
  );

  const handleClear = useCallback(() => {
    clearSnapshots(); showToast("Historial eliminado");
  }, [clearSnapshots, showToast]);

  // ── Prototype ───────────────────────────────────────────────────────────
  const handleCopyConfig = useCallback(
    (targetUserId) => {
      const target = users.find((u) => u.id === targetUserId);
      copyConfigToUser(targetUserId);
      showToast(`Configuración copiada a ${target?.name}`);
    },
    [copyConfigToUser, users, showToast]
  );

  // ── Selección de usuario ────────────────────────────────────────────────
  const handleSelectUser = useCallback(
    (id) => {
      selectUser(id);
      const u = users.find((u) => u.id === id);
      showToast(`Perfil de ${u?.name} cargado`);
    },
    [selectUser, users, showToast]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-350 mx-auto px-6 h-14 flex items-center justify-center">
          <span className="text-[15px] font-medium text-gray-700 tracking-wide">
            Memento · Command · Facade · Prototype
          </span>
        </div>
      </header>

      <main className="max-w-350 mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_340px] gap-6 items-start">

          {/* ── Columna izquierda: vehículo + usuarios ──────────────── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-18">
            <section className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-3">
                Vehículo
              </p>
              <div
                className="w-full flex items-center justify-center rounded-xl overflow-hidden
                            bg-gray-50 border border-dashed border-gray-200"
                style={{ minHeight: 120 }}
              >
                <img src={Carro} alt="Vehículo" className="w-full object-contain" />
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-3">
                Usuarios
              </p>
              {/* UserSelector recibe onCopyConfig para exponer el Prototype */}
              <UserSelector
                users={users}
                activeUserId={activeUserId}
                onSelect={handleSelectUser}
                onCopyConfig={handleCopyConfig}
              />
              <p className="text-[10px] text-gray-300 mt-2 text-center">
                Icono <span className="font-medium">⎘</span> copia la config activa
              </p>
            </section>
          </aside>

          {/* ── Columna central: controles ──────────────────────────── */}
          <div className="flex flex-col gap-5">
            <section className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-3">
                Control principal · {activeUser.name}
              </p>
              <MasterToggle masterOn={state.masterOn} onToggle={handleToggleMaster} />
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-3">
                Controles de bloqueo
              </p>
              <div className="flex flex-col gap-2">
                {LOCK_CONTROLS.map(({ key, title, icon }) => (
                  <LockControlCard
                    key={key}
                    icon={icon}
                    title={title}
                    enabled={state[key]}
                    disabled={!state.masterOn}
                    onToggle={() => handleToggleControl(key)}
                  />
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-3">
                Límite de velocidad
              </p>
              <SpeedSlider
                enabled={state.speed}
                disabled={!state.masterOn}
                speedValue={state.speedValue}
                onToggle={() => handleToggleControl("speed")}
                onSpeedChange={setSpeedValue}
              />
            </section>

            {/* ── Panel visual Facade ─────────────────────────────────── */}
            <FacadeDebugPanel
              state={state}
              snapshots={snapshots}
              canUndo={canUndo}
              undoDescription={undoDescription()}
              lastAction={lastAction}
            />
          </div>

          {/* ── Columna derecha: historial ──────────────────────────── */}
          <aside className="bg-white border border-gray-100 rounded-2xl p-5 lg:sticky lg:top-18">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px]
                               font-medium shrink-0 ${colors.bg} ${colors.text}`}>
                {activeUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-700 leading-tight">{activeUser.name}</p>
                <p className="text-[11px] text-gray-400">{activeUser.description}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                                ${colors.badge} border ${colors.border}`}>
                activo
              </span>
            </div>

            {/* HistoryPanel recibe canUndo + handlers de Command y Memento */}
            <HistoryPanel
              snapshots={snapshots}
              canUndo={canUndo}
              undoDescription={undoDescription()}
              onUndo={handleUndo}
              onSave={handleSave}
              onRestore={handleRestore}
              onDelete={handleDelete}
              onClear={handleClear}
            />
          </aside>

        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-350 mx-auto px-6 h-11 flex items-center justify-between">
          <p className="text-xs text-gray-300">SafeKids · Memento · Command · Facade · Prototype</p>
          <p className="text-xs text-gray-300">React + Tailwind CSS</p>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm
                        px-4 py-2 rounded-lg pointer-events-none animate-fade-in whitespace-nowrap z-50">
          {toast}
        </div>
      )}
    </div>
  );
}