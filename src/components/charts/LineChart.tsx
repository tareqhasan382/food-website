import { useId } from "react";
import { formatCompactNumber, shortDate } from "./chart-utils";

interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartPoint[];
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

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 260,
  color = "#CC470A",
  formatValue = (v) => formatCompactNumber(v),
  emptyMessage = "No data available",
}) => {
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, "");

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

  const xAt = (i: number): number =>
    n === 1 ? PAD_LEFT + PLOT_W / 2 : PAD_LEFT + (i / (n - 1)) * PLOT_W;
  const yAt = (v: number): number => PAD_TOP + PLOT_H - (v / max) * PLOT_H;

  const linePoints = data.map((d, i) => ({
    x: xAt(i),
    y: yAt(d.value),
    point: d,
  }));
  const path = `M ${linePoints
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" L ")}`;
  const areaPath = `${path} L ${linePoints[n - 1].x.toFixed(2)},${BOTTOM} L ${
    linePoints[0].x
  },${BOTTOM} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: max * f,
    y: yAt(max * f),
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
      aria-label="Line chart"
      className="w-full"
      style={{ height: "auto" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

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

      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {n <= 90 &&
        linePoints.map((p, i) => (
          <g key={i}>
            <title>{`${p.point.label} · ${formatValue(p.point.value)}`}</title>
            <circle cx={p.x} cy={p.y} r={3} fill={color} className="cursor-pointer" />
          </g>
        ))}

      {labelIndexes.map((i) => (
        <text
          key={i}
          x={linePoints[i].x}
          y={VIEW_H - 8}
          textAnchor="middle"
          className="fill-gray-400 text-[11px] font-medium"
        >
          {shortDate(linePoints[i].point.label)}
        </text>
      ))}
    </svg>
  );
};

export default LineChart;
