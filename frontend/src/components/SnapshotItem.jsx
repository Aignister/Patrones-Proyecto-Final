import { RotateCcw, Trash2 } from "lucide-react";

export function SnapshotItem({ memento, isLatest, onRestore, onDelete }) {
  const state = memento.getState();

  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors duration-150
        ${isLatest ? "border-emerald-300 bg-emerald-50/50" : "border-gray-100 bg-white hover:bg-gray-50"}
      `}
    >

      <div
        className={`w-2 h-2 rounded-full shrink-0 ${
          state.masterOn ? "bg-emerald-400" : "bg-gray-300"
        }`}
      />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-700 leading-tight">
          {memento.getLabel()}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
          {state.masterOn ? "Activo — " : "○ Inactivo — "}
          {memento.describe()}
        </p>
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onRestore(memento.getId())}
          title="Restaurar configuración"
          className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center
                     hover:bg-emerald-50 hover:border-emerald-300 transition-colors duration-150"
        >
          <RotateCcw size={12} className="text-emerald-600" />
        </button>
        <button
          onClick={() => onDelete(memento.getId())}
          title="Eliminar snapshot"
          className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center
                     hover:bg-red-50 hover:border-red-200 transition-colors duration-150"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}