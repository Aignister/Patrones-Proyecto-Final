export function LockControlCard({ icon, title, enabled, disabled, onToggle }) {
  const Icon = icon;
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left
        transition-all duration-150 select-none
        ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-white border-gray-100"
            : enabled
            ? "bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
            : "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer"
        }
      `}
    >
      <div
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
          ${enabled && !disabled ? "bg-emerald-200" : "bg-gray-100"}
        `}
      >
        <Icon
          size={18}
          className={
            enabled && !disabled ? "text-emerald-700" : "text-gray-400"
          }
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            enabled && !disabled ? "text-emerald-800" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs mt-0.5 ${
            enabled && !disabled ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          {enabled ? "Activado" : "Desactivado"}
        </p>
      </div>
      <div
        className={`
          relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
          ${enabled && !disabled ? "bg-emerald-500" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
            ${enabled ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </div>
    </button>
  );
}