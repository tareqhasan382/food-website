import { formatCompactNumber, shortDate } from "./chart-utils";

interface BarChartPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartPoint[];
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

const VIEW_W = 640;
const VIEW_H = 240;
const PAD_TOP = 18;
const PAD_BOTTOM = 30;
const PAD_LEFT = 48;
const PAD_RIGHT = 14;
const PLOT_H = VIEW_H - PAD_TOP - PAD_BOTTOM;
const PLOT_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const BOTTOM = PAD_TOP + PLOT_H;

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 260,
  color = "#CC470A",
  formatValue = (v) => formatCompactNumber(v),
  emptyMessage = "No data available",
}) => {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const n = data.length;
  const slot = PLOT_W / n;
  const barWidth = Math.min(22, Math.max(3, slot * 0.62));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: max * f,
    y: PAD_TOP + PLOT_H - (f * PLOT_H),
  }));

  const labelCount = Math.min(n, 6);
  const labelIndexes = Array.from(
    new Set(
      Array.from({ length: labelCount }, (_, i) =>
        Math.round((i / Math.max(1, labelCount - 1)) * (n - 1))
      )
    )
  );

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Bar chart"
      className="w-full"
      style={{ height: "auto" }}
    >
      {yTicks.map((tick) => (
        <g key={tick.y}>
          <line
            x1={PAD_LEFT}
            x2={VIEW_W - PAD_RIGHT}
            y1={tick.y}
            y2={tick.y}
            className="stroke-gray-100"
            strokeWidth={1}
            strokeDasharray={tick.value === 0 ? undefined : "4 4"}
          />
          <text
            x={PAD_LEFT - 8}
            y={tick.y + 3}
            textAnchor="end"
            className="fill-gray-400 text-[11px] font-medium"
          >
            {formatValue(tick.value)}
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const h = (d.value / max) * PLOT_H;
        const x = PAD_LEFT + i * slot + (slot - barWidth) / 2;
        const y = BOTTOM - h;
        return (
          <g key={i}>
            <title>{`${d.label} · ${formatValue(d.value)}`}</title>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, d.value > 0 ? 2 : 0)}
              rx={3}
              fill={color}
              className="opacity-80 transition-opacity hover:opacity-100"
            />
          </g>
        );
      })}

      {labelIndexes.map((i) => (
        <text
          key={i}
          x={PAD_LEFT + i * slot + slot / 2}
          y={VIEW_H - 8}
          textAnchor="middle"
          className="fill-gray-400 text-[11px] font-medium"
        >
          {shortDate(data[i].label)}
        </text>
      ))}
    </svg>
  );
};

export default BarChart;
