"use client";

type CheckboxDSCProps = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export default function CheckboxDSC({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxDSCProps) {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <div
        className="
          h-7 w-7
          border-2 border-white
          bg-transparent
          transition-all
          duration-200
          peer-checked:bg-white
          peer-checked:scale-95
        "
      />

      <span className="font-agdasima text-3xl md:text-4xl">
        {label}
      </span>
    </label>
  );
}