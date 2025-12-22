import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useReports } from "../../hooks/useReports";

interface ReportDurationChartProps {
  reports?: any[];   // ⬅️ Can pass in filteredReports
  title: string;
}

const ReportDurationChart: React.FC<ReportDurationChartProps> = ({ reports: externalReports, title }) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;  // ⬅️ Prioritize external data

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  // Step 1: Accumulate duration for each bt_driver (convert seconds to hours)
  const durationMap: Record<string, number> = {};
  reports.forEach((r) => {
    const driver = (r["bt_driver"] || "(Empty)").toString();
    const durationInSeconds = Number(r["duration"]);
    const durationInHours = isNaN(durationInSeconds) ? 0 : durationInSeconds / 3600; // Convert seconds to hours
    durationMap[driver] = (durationMap[driver] || 0) + durationInHours;
  });

  // Step 2: Convert to Recharts format
  const data = Object.entries(durationMap).map(([driver, totalDuration]) => ({
    name: driver,
    totalDuration,
  }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: "(hr)", position: "insideBottomRight", offset: -5 }} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} hrs`, 'Duration']} />
          <Bar dataKey="totalDuration" fill="#82ca9d">
            <LabelList
              dataKey="totalDuration"
              position="right"
              style={{ fontSize: 14, fontWeight: "bold" }}
              content={({ x, y, width, height, value }) => {
                if (!value || value === 0) return null;
                return (
                  <text
                    x={Number(x) + Number(width) + 5}
                    y={Number(y) + Number(height) / 2}
                    fill="#000"
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {Number(value).toFixed(2)}h
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportDurationChart;
