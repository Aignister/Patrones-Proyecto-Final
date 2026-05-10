import { Save, Trash2, Clock, Undo2 } from "lucide-react";
import { SnapshotItem } from "./SnapshotItem";

// HistoryPanel ahora expone dos niveles de historial:
//   1. Undo granular  → deshace la última acción (patrón Command)
//   2. Snapshots      → restaura perfiles completos (patrón Memento)
export function HistoryPanel({
  snapshots,
  canUndo,
  undoDescription,
  onUndo,
  onSave,
  onRestore,
  onDelete,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Encabezado ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-gray-300" />
          <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300">
            Historial
          </p>
        </div>
        {snapshots.length > 0 && (
          <span className="text-[11px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">
            {snapshots.length}
          </span>
        )}
      </div>

      {/* ── Botón Undo (Command) ──────────────────────────────────────── */}
      {/* Solo visible cuando hay acciones en la pila del Invoker */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title={undoDescription ?? "Sin acciones para deshacer"}
        className={`
          w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium
          rounded-xl border transition-all duration-150 active:scale-[0.98]
          ${
            canUndo
              ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
              : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
          }
        `}
      >
        <Undo2 size={14} />
        {canUndo && undoDescription
          ? `Deshacer: ${undoDescription}`
          : "Sin acciones para deshacer"}
      </button>

      {/* ── Botón Guardar snapshot (Memento) ─────────────────────────── */}
      <button
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium
                   bg-emerald-500 text-white rounded-xl hover:bg-emerald-600
                   active:scale-[0.98] transition-all duration-150"
      >
        <Save size={14} />
        Guardar configuración actual
      </button>

      {/* ── Lista de snapshots ────────────────────────────────────────── */}
      {snapshots.length === 0 ? (
        <div className="border border-dashed border-gray-100 rounded-xl py-10 text-center flex flex-col items-center gap-2">
          <Clock size={20} className="text-gray-200" />
          <p className="text-sm text-gray-300">Sin configuraciones guardadas</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5 max-h-150 overflow-y-auto pr-0.5">
            {snapshots.map((memento, idx) => (
              <SnapshotItem
                key={memento.getId()}
                memento={memento}
                isLatest={idx === 0}
                onRestore={onRestore}
                onDelete={onDelete}
              />
            ))}
          </div>
          <button
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium
                       border border-gray-100 text-gray-400 rounded-xl hover:bg-red-50 hover:border-red-100
                       hover:text-red-400 active:scale-[0.98] transition-all duration-150"
          >
            <Trash2 size={12} />
            Limpiar historial
          </button>
        </>
      )}
    </div>
  );
}