import type { ReactNode } from "react";
import katex from "katex";
export const formatNumber = (n: number, decimals = 2) =>
  n.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export function Formula({
  children,
  className = "",
  display = false,
}: {
  children: string;
  className?: string;
  display?: boolean;
}) {
  return (
    <span
      className={`formula ${className}`}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(
          (display ? "\\displaystyle " : "") + children,
          { throwOnError: false, output: "htmlAndMathml", strict: "ignore" },
        ),
      }}
    />
  );
}
export function Build({
  at,
  step,
  children,
  className = "",
}: {
  at: number;
  step: number;
  children: ReactNode;
  className?: string;
}) {
  const visible = step >= at;
  return (
    <div
      className={`build ${className}`}
      data-build={at}
      data-visible={visible}
      aria-hidden={!visible}
      inert={!visible}
    >
      {children}
    </div>
  );
}
export function NumberValue({
  value,
  decimals = 2,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  // Financial figures share React's atomic commit with labels and equations.
  // Interpolating each result independently produces an impossible intermediate state.
  return (
    <span data-value={value} className="tabular">
      {formatNumber(value, decimals)}
      {suffix}
    </span>
  );
}
export function RangeControl({
  label,
  value,
  onChange,
  min = 0,
  max = 0.1,
  step = 0.005,
  sub,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sub?: string;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <output>{formatNumber(value * 100, 1)}%</output>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
      {sub && <small>{sub}</small>}
    </label>
  );
}
