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
import { ReportMultipleCrossBarChartProps } from "types";

// interface ReportMultipleCrossBarChartProps {
//   reports?: any[];   // Load filteredReports
//   fieldX: string;
//   fieldY: string;
//   title: string;
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

const ReportMultipleCrossBarChart: React.FC<ReportMultipleCrossBarChartProps> = ({
  reports: externalReports,
  fieldX,
  fieldY,
  title,
}) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;  // Prioritize external transmission

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  // Step 1: Create two-dimensional statistics
  const dataMap: Record<string, Record<string, number>> = {};
  reports.forEach((r) => {
    const xKey = (r[fieldX] || "(Empty)").toString();
    const yKey = (r[fieldY] || "(Empty)").toString();

    if (!dataMap[xKey]) dataMap[xKey] = {};
    dataMap[xKey][yKey] = (dataMap[xKey][yKey] || 0) + 1;
  });

  // Step 2: Collect all Y categories
  const yCategories = Array.from(
    new Set(reports.map((r) => (r[fieldY] || "(Empty)").toString()))
  );

  // Step 3: Convert to Recharts format
  const data = Object.entries(dataMap).map(([xKey, yCounts]) => {
    const row: Record<string, any> = { name: xKey };
    let total = 0;
    yCategories.forEach((y) => {
      const count = yCounts[y] || 0;
      row[y] = count;
      total += count;
    });
    row.total = total;
    return row;
  });

  return (
    <div style={{ width: "100%", height: 400 }}>
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
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip wrapperStyle={{ zIndex: 1000 }} />
          {/* If the current legend is too long, consider adding legendType="none" in <Legend /> */}
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 8 }} />
          {yCategories.map((y, idx) => (
            <Bar key={y} dataKey={y} stackId="a" fill={COLORS[idx % COLORS.length]} >
              {/* <LabelList
                dataKey={y}
                content={({ x, y: yCoord, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(yCoord) + Number(height) / 2}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={16}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              /> */}
            </Bar>
          ))}
          
          {/* A separate transparent Bar to place the total label at the true right edge */}
          {/* <Bar dataKey="total" fill="transparent" stroke="transparent" isAnimationActive={false} legendType="none">
            <LabelList
              dataKey="total"
              position="right"
              content={({ x, y: yCoord, width, height, value }) => {
                if (!value || value === 0) return null;
                return (
                  <text
                    x={Number(x) + Number(width) + 10}
                    y={Number(yCoord) + Number(height) / 2}
                    fill="#000"
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize={16}
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                );
              }}
            />
          </Bar> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportMultipleCrossBarChart;
