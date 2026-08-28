import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  trafficHistory,
  trafficZones,
} from "../data/vigilMockData";

function Charts() {
  const zoneData = trafficZones
    .filter((zone) => zone.dataAvailable)
    .map((zone) => ({
      name: zone.area,
      traffic: zone.traffic,
    }));

  return (
    <section className="space-y-6">

      {/* TODAY */}

      <TrafficBarChart
        title="Today's Traffic"
        description="Hourly traffic density across Nagpur city."
        data={trafficHistory.day}
      />

      {/* MONTH */}

      <TrafficBarChart
        title="Monthly Traffic"
        description="Daily traffic density for the current month."
        data={trafficHistory.month}
      />

      {/* YEAR */}

      <TrafficBarChart
        title="Yearly Traffic"
        description="Monthly traffic density across the year."
        data={trafficHistory.year}
      />

      {/* AREA DISTRIBUTION */}

      <ZonePieChart data={zoneData} />

    </section>
  );
}

function TrafficBarChart({
  title,
  description,
  data,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-5 h-[340px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              label={{
                value: "Traffic %",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="traffic"
              name="Traffic Density"
              fill="#2563eb"
              radius={[
                5,
                5,
                0,
                0,
              ]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

function ZonePieChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>
        <h3 className="font-bold text-slate-900">
          Traffic Distribution by Nagpur Area
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Relative traffic contribution across monitored Nagpur areas.
        </p>
      </div>

      <div className="mt-5 h-[380px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="traffic"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={125}
              label
            >

              {data.map(
                (entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      [
                        "#2563eb",
                        "#dc2626",
                        "#f97316",
                        "#16a34a",
                        "#7c3aed",
                        "#0891b2",
                        "#ca8a04",
                        "#db2777",
                      ][
                        index % 8
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Charts;