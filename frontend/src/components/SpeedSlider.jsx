
import { Gauge } from "lucide-react";

export function SpeedSlider({ enabled, disabled, speedValue, onToggle, onSpeedChange }) {
  const marks = [20, 40, 60, 80, 100, 120];

  return (
    <div
      className={`
        bg-white border rounded-xl px-4 py-3 transition-opacity duration-200
        ${disabled ? "opacity-40 pointer-events-none border-gray-100" : "border-gray-200"}
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
            ${enabled ? "bg-emerald-200" : "bg-gray-100"}
          `}
        >
          <Gauge size={18} className={enabled ? "text-emerald-700" : "text-gray-400"} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Velocidad máxima</p>
          <p className="text-xs text-gray-400 mt-0.5">Límite para pasajeros</p>
        </div>

        <div className="text-right">
          <span className="text-xl font-medium text-gray-800">
            {speedValue}
            <span className="text-sm font-normal text-gray-400 ml-1">km/h</span>
          </span>
        </div>

        <button
          onClick={onToggle}
          className="focus:outline-none"
          aria-label="Activar límite de velocidad"
        >
          <div
            className={`
              relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
              ${enabled ? "bg-emerald-500" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                absolute top-1 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
                ${enabled? "translate-x-6" : "translate-x-1"}
              `}
            />
          </div>
        </button>
      </div>

      <div className={`transition-opacity duration-200 ${!enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <input
          type="range"
          min={20}
          max={120}
          step={10}
          value={speedValue}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-emerald-500 h-1.5"
        />
        <div className="flex justify-between mt-1">
          {marks.map((m) => (
            <span key={m} className="text-[10px] text-gray-300">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}