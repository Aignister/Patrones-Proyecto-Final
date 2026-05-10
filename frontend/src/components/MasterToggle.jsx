import { ShieldCheck } from "lucide-react";

export function MasterToggle({ masterOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left
        ${
          masterOn
            ? "bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
          ${masterOn ? "bg-emerald-200" : "bg-gray-100"}
        `}
      >
        <ShieldCheck
          size={18}
          className={masterOn ? "text-emerald-700" : "text-gray-400"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            masterOn ? "text-emerald-800" : "text-gray-800"
          }`}
        >
          Modo  de seguridad infantil
        </p>
        <p
          className={`text-xs mt-0.5 ${
            masterOn ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          {masterOn
            ? "Seguridad activa — controles habilitados"
            : "Activa para habilitar los controles"}
        </p>
      </div>
      <div
        className={`
          relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
          ${masterOn ? "bg-emerald-500" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
            ${masterOn ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </div>
    </button>
  );
}