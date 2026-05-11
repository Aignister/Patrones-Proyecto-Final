import { useState } from "react";
import { Layers, ChevronDown, ChevronUp, Zap, Database, RotateCcw, Circle, CheckCircle2 } from "lucide-react";

const CONTROL_LABELS = {
  masterOn: "Modo seguridad",
  windows: "Ventanas",
  doors: "Puertas",
  seatbelt: "Cinturón",
  speed: "Velocidad",
  speedValue: null,
};

function SubsystemCard({ color, icon, label, badge, children }) {
  const Icon = icon;
  const colors = {
    amber: { border: "border-amber-200",  bg: "bg-amber-50", label: "text-amber-600",  badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
    emerald: { border: "border-emerald-200",bg: "bg-emerald-50", label: "text-emerald-600",badge: "bg-emerald-100 text-emerald-700",dot: "bg-emerald-400" },
    violet: { border: "border-violet-200", bg: "bg-violet-50", label: "text-violet-600", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-400" },
  }[color];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3`}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${colors.badge}`}>
          <Icon size={11} />
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${colors.label}`}>
          {label}
        </span>
        {badge != null && (
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors.badge}`}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function StateRow({ label, value, active }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px] text-gray-500">{label}</span>
      <span className={`text-[11px] font-medium ${active ? "text-emerald-600" : "text-gray-400"}`}>
        {value}
      </span>
    </div>
  );
}

export function FacadeDebugPanel({ state, snapshots, canUndo, undoDescription, lastAction }) {
  const [open, setOpen] = useState(true);

  const activeControls = ["windows", "doors", "seatbelt", "speed"]
    .filter((k) => state?.[k]).length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50
                   transition-colors duration-150 text-left"
      >
        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <Layers size={13} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-gray-700 leading-tight">
            Patrón Facade
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            Coordina los patrones · Command · Memento ·
          </p>
        </div>
        {lastAction && (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full
                           font-mono truncate max-w-30 shrink-0">
            {lastAction}
          </span>
        )}
        {open
          ? <ChevronUp size={13} className="text-gray-300 shrink-0" />
          : <ChevronDown size={13} className="text-gray-300 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2.5 border-t border-gray-50">

          <div className="flex items-center gap-2 pt-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-300 font-medium px-2">
              Interfaz → Facade → patrones internos
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <SubsystemCard
            color="amber"
            icon={Zap}
            label="Patron Command"
            badge={`${canUndo ? "≥1" : "0"} acción${canUndo ? "es" : ""} en pila`}
          >
            {canUndo && undoDescription ? (
              <div className="flex items-center gap-1.5 mt-1">
                <RotateCcw size={10} className="text-amber-500 shrink-0" />
                <span className="text-[11px] text-amber-700 truncate">
                  Deshacer disponible: {undoDescription}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">Sin acciones para deshacer</p>
            )}
          </SubsystemCard>

          <SubsystemCard
            color="emerald"
            icon={Database}
            label="Originator · Configuración activa"
            badge={state?.masterOn ? "seguridad activa" : "seguridad inactiva"}
          >
            <div className="mt-1 divide-y divide-emerald-100">
              <StateRow
                label="Modo seguridad"
                value={state?.masterOn ? "activado" : "desactivado"}
                active={state?.masterOn}
              />
              <StateRow
                label="Ventanas"
                value={state?.windows ? "bloqueadas" : "sin bloqueo"}
                active={state?.windows}
              />
              <StateRow
                label="Puertas"
                value={state?.doors ? "bloqueadas" : "sin bloqueo"}
                active={state?.doors}
              />
              <StateRow
                label="Cinturón"
                value={state?.seatbelt ? "obligatorio" : "sin restricción"}
                active={state?.seatbelt}
              />
              <StateRow
                label="Velocidad"
                value={state?.speed ? `limitada · ${state?.speedValue} km/h` : "sin límite"}
                active={state?.speed}
              />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {["windows","doors","seatbelt","speed"].map((k) => (
                <div
                  key={k}
                  title={k}
                  className={`w-2 h-2 rounded-full transition-colors duration-200
                    ${state?.[k] ? "bg-emerald-400" : "bg-gray-200"}`}
                />
              ))}
              <span className="text-[10px] text-gray-400 ml-1">
                {activeControls} / 4 controles activos
              </span>
            </div>
          </SubsystemCard>

          <SubsystemCard
            color="violet"
            icon={Database}
            label="Caretaker · Historial de Memento"
            badge={`${snapshots.length} perfil${snapshots.length !== 1 ? "es" : ""} guardado${snapshots.length !== 1 ? "s" : ""}`}
          >
            {snapshots.length === 0 ? (
              <p className="text-[11px] text-gray-400 mt-1">Sin perfiles guardados aun</p>
            ) : (
              <div className="mt-1 flex flex-col gap-0.5">
                {snapshots.slice(0, 4).map((m, i) => (
                  <div key={m.getId()} className="flex items-center gap-1.5">
                    {i === 0
                      ? <CheckCircle2 size={10} className="text-violet-500 shrink-0" />
                      : <Circle size={10} className="text-violet-200 shrink-0" />
                    }
                    <span className="text-[11px] text-violet-700 truncate">
                      {m.getLabel()} · {m.describe()}
                    </span>
                  </div>
                ))}
                {snapshots.length > 4 && (
                  <p className="text-[10px] text-gray-400 pl-3.5">
                    +{snapshots.length - 4} mas…
                  </p>
                )}
              </div>
            )}
          </SubsystemCard>

        </div>
      )}
    </div>
  );
}