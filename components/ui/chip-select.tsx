import { cn } from "@/lib/utils";

type ChipSelectProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel?: (option: T) => string;
  className?: string;
};

export default function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
  className,
}: ChipSelectProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "px-4 py-2.5 text-sm uppercase tracking-wider font-semibold rounded-xl border transition-all duration-200 cursor-pointer",
            option === value
              ? "bg-[#FF5500] text-white border-transparent shadow-md shadow-[#FF5500]/20"
              : "bg-amber-50/50 text-stone-500 border-amber-200 hover:bg-[#FF5500]/5 hover:text-[#FF5500] hover:border-[#FF5500]/30"
          )}
        >
          {renderLabel ? renderLabel(option) : option}
        </button>
      ))}
    </div>
  );
}
