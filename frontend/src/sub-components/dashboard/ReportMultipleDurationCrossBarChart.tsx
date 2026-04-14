import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  // LabelList,
} from "recharts";
import { useReports } from "../../hooks/useReports";
import { ReportMultipleDurationCrossBarChartProps } from "types";

// interface ReportMultipleDurationCrossBarChartProps {
//   reports?: any[];       // Load filteredReports
//   title: string;
//   fieldX?: string;       // X-axis field, default is bt_driver
//   fieldY?: string;       // Cumulative field, default is duration
//   groupBy?: string;      // Grouping field, default is scenario
// }

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff7f50", // Coral orange
  "#a4de6c", // Light green
  "#d0ed57", // Light yellow-green
  "#8dd1e1", // Light blue
  "#83a6ed", // Blue-purple
  "#8e4585", // Lilac
  "#ffb6b9", // Light pink
  "#ffd700", // Golden
  "#7fc8a9", // Blue-green
];

const ReportMultipleDurationCrossBarChart: React.FC<ReportMultipleDurationCrossBarChartProps> = ({
  reports: externalReports,
  title,
  fieldX = "bt_driver",
  fieldY = "duration",
  groupBy = "scenario",
}) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  const getDisplayXKey = (r: any): string => {
    if (fieldX === "short_platform") {
      const brand = (r.short_platform_brand || r.platform_brand || "").toString().trim();
      const platform = (r.short_platform || r.platform || "").toString().trim();
      const combined = `${brand} ${platform}`.trim();
      return combined || "(Empty)";
    }

    return (r[fieldX] || "(Empty)").toString();
  };

  // Step 1: Create a two-dimensional cumulative map (convert seconds to hours)
  const dataMap: Record<string, Record<string, number>> = {};
  const groupSet = new Set<string>();

  reports.forEach((r) => {
    const xKey = getDisplayXKey(r);
    const groupKey = (r[groupBy] || "(Empty)").toString();
    const valueInSeconds = Number(r[fieldY]) || 0;
    const valueInHours = valueInSeconds / 3600; // Convert seconds to hours

    if (!dataMap[xKey]) dataMap[xKey] = {};
    dataMap[xKey][groupKey] = (dataMap[xKey][groupKey] || 0) + valueInHours;
    groupSet.add(groupKey);
  });

  const groups = Array.from(groupSet);

  // Step 2: Convert to Recharts format and calculate total
  const data = Object.entries(dataMap).map(([xKey, groupValues]) => {
    const row: Record<string, any> = { name: xKey };
    let total = 0;
    groups.forEach((g) => {
      const val = groupValues[g] || 0;
      row[g] = val;
      total += val;
    });
    row.total = total;
    return row;
  });

  const chartHeight = Math.max(400, data.length * 36);

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} label={{ value: "(hr)", position: "insideBottomRight", offset: -5 }} />
          <YAxis type="category" dataKey="name" width={220} interval={0} />
          <Tooltip wrapperStyle={{ zIndex: 1000 }} formatter={(value, name) => [`${Number(value).toFixed(2)} hrs`, name]} />
          {/* If the current legend is too long, consider adding legendType="none" in <Legend /> */}
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 8 }} />
          {groups.map((g, idx) => (
            <Bar key={g} dataKey={g} stackId="a" fill={COLORS[idx % COLORS.length]}>
              {/* Single bar value */}
              {/* <LabelList
                dataKey={g}
                content={({ x, y, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) + Number(height) / 2}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      {Number(value).toFixed(1)}h
                    </text>
                  );
                }}
              /> */}

              {/* The column total */}
              {/* <LabelList
                dataKey="total"
                position="right"
                content={({ x, y, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) + 10}
                      y={Number(y) + Number(height) / 2}
                      fill="#000"
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              /> */}
              
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportMultipleDurationCrossBarChart;
