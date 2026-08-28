import React, { useMemo, useState } from "react";

const initialDeployments = [
  {
    id: "DEP-001",
    zone: "Sitabuldi",
    station: "Sitabuldi Traffic Police Station",
    required: 8,
    allocated: 5,
    available: 6,
    status: "Shortage",
    priority: "Critical",
    updated: "5 min ago",
  },
  {
    id: "DEP-002",
    zone: "Wardha Road",
    station: "Sadar Traffic Police Station",
    required: 7,
    allocated: 5,
    available: 6,
    status: "Shortage",
    priority: "Critical",
    updated: "8 min ago",
  },
  {
    id: "DEP-003",
    zone: "Central Avenue",
    station: "Gandhibagh Traffic Police Station",
    required: 6,
    allocated: 4,
    available: 5,
    status: "Shortage",
    priority: "High",
    updated: "11 min ago",
  },
  {
    id: "DEP-004",
    zone: "Manewada",
    station: "Ajni Traffic Police Station",
    required: 5,
    allocated: 4,
    available: 5,
    status: "Balanced",
    priority: "High",
    updated: "15 min ago",
  },
  {
    id: "DEP-005",
    zone: "Kamptee Road",
    station: "Indora Traffic Police Station",
    required: 5,
    allocated: 3,
    available: 4,
    status: "Shortage",
    priority: "High",
    updated: "19 min ago",
  },
  {
    id: "DEP-006",
    zone: "Dharampeth",
    station: "Dharampeth Traffic Police Station",
    required: 4,
    allocated: 3,
    available: 4,
    status: "Balanced",
    priority: "Medium",
    updated: "23 min ago",
  },
];

function getPriorityClass(priority) {
  if (priority === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "High") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getStatusClass(status) {
  if (status === "Shortage") {
    return "bg-red-50 text-red-600";
  }

  if (status === "Balanced") {
    return "bg-green-50 text-green-600";
  }

  return "bg-gray-100 text-gray-600";
}

function Deployments() {
  const [deployments, setDeployments] =
    useState(initialDeployments);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filteredDeployments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deployments.filter((deployment) => {
      const matchesSearch =
        !query ||
        deployment.id.toLowerCase().includes(query) ||
        deployment.zone.toLowerCase().includes(query) ||
        deployment.station.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        deployment.status === filter ||
        deployment.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [deployments, search, filter]);

  const totalRequired = deployments.reduce(
    (sum, item) => sum + item.required,
    0
  );

  const totalAllocated = deployments.reduce(
    (sum, item) => sum + item.allocated,
    0
  );

  const shortageZones = deployments.filter(
    (item) => item.status === "Shortage"
  ).length;

  const criticalZones = deployments.filter(
    (item) => item.priority === "Critical"
  ).length;

  const updateDeployment = (id, newAllocated) => {
    setDeployments((previous) =>
      previous.map((deployment) => {
        if (deployment.id !== id) {
          return deployment;
        }

        const allocated = Math.max(
          0,
          Math.min(newAllocated, deployment.available)
        );

        return {
          ...deployment,
          allocated,
          status:
            allocated >= deployment.required
              ? "Balanced"
              : "Shortage",
          updated: "Just now",
        };
      })
    );

    setSelected((previous) => {
      if (!previous || previous.id !== id) {
        return previous;
      }

      const allocated = Math.max(
        0,
        Math.min(newAllocated, previous.available)
      );

      return {
        ...previous,
        allocated,
        status:
          allocated >= previous.required
            ? "Balanced"
            : "Shortage",
        updated: "Just now",
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            VIGIL Police Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Police Deployments
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Monitor and manage police deployment across
            Nagpur's traffic-risk zones.
          </p>
        </div>

        <button className="w-fit rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white hover:bg-blue-700">
          + Create Deployment
        </button>

      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          title="Required Officers"
          value={totalRequired}
          icon="👮"
        />

        <SummaryCard
          title="Allocated Officers"
          value={totalAllocated}
          icon="📍"
          color="text-blue-600"
        />

        <SummaryCard
          title="Shortage Zones"
          value={shortageZones}
          icon="⚠️"
          color="text-red-600"
        />

        <SummaryCard
          title="Critical Zones"
          value={criticalZones}
          icon="🔴"
          color="text-red-600"
        />

      </div>

      {/* Search and filters */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search zone or police station..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />

          </div>

          <div className="flex gap-2 overflow-x-auto">

            {[
              "All",
              "Critical",
              "High",
              "Shortage",
              "Balanced",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-semibold ${
                  filter === item
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* Deployment list */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 p-5">

          <h2 className="font-bold">
            Deployment Records
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {filteredDeployments.length} deployment records
          </p>

        </div>

        <div className="divide-y divide-gray-100">

          {filteredDeployments.map((deployment) => {

            const percentage =
              deployment.required === 0
                ? 0
                : Math.round(
                    (deployment.allocated /
                      deployment.required) *
                      100
                  );

            return (
              <div
                key={deployment.id}
                className="p-5 hover:bg-gray-50"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                  {/* Zone */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-[10px] font-bold text-gray-400">
                        {deployment.id}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${getPriorityClass(
                          deployment.priority
                        )}`}
                      >
                        {deployment.priority}
                      </span>

                    </div>

                    <h3 className="mt-2 font-bold">
                      {deployment.zone}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {deployment.station}
                    </p>

                  </div>

                  {/* Officers */}
                  <div className="grid grid-cols-3 gap-3 xl:w-72">

                    <NumberBox
                      label="Required"
                      value={deployment.required}
                    />

                    <NumberBox
                      label="Allocated"
                      value={deployment.allocated}
                      color="text-blue-600"
                    />

                    <NumberBox
                      label="Available"
                      value={deployment.available}
                      color="text-green-600"
                    />

                  </div>

                  {/* Progress */}
                  <div className="xl:w-52">

                    <div className="flex justify-between text-[10px]">

                      <span className="text-gray-400">
                        Coverage
                      </span>

                      <span className="font-bold">
                        {percentage}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className={`h-full rounded-full ${
                          percentage >= 100
                            ? "bg-green-600"
                            : percentage >= 70
                            ? "bg-orange-500"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-bold ${getStatusClass(
                      deployment.status
                    )}`}
                  >
                    {deployment.status}
                  </span>

                  <button
                    onClick={() => setSelected(deployment)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-100"
                  >
                    Manage
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Management modal */}
      {selected && (
        <DeploymentModal
          deployment={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateDeployment}
        />
      )}

    </div>
  );
}

function DeploymentModal({
  deployment,
  onClose,
  onUpdate,
}) {
  const [count, setCount] = useState(
    deployment.allocated
  );

  const shortage = Math.max(
    deployment.required - count,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-gray-200 p-5">

          <div>
            <p className="text-xs font-semibold text-blue-600">
              MANAGE DEPLOYMENT
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {deployment.zone}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {deployment.station}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        <div className="space-y-5 p-5">

          {/* Current status */}
          <div className="grid grid-cols-3 gap-3">

            <NumberBox
              label="Required"
              value={deployment.required}
            />

            <NumberBox
              label="Available"
              value={deployment.available}
              color="text-green-600"
            />

            <NumberBox
              label="Current"
              value={deployment.allocated}
              color="text-blue-600"
            />

          </div>

          {/* Slider */}
          <div>

            <div className="flex justify-between">

              <label className="text-xs font-semibold">
                Officers to Allocate
              </label>

              <span className="text-sm font-bold text-blue-600">
                {count}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max={deployment.available}
              value={count}
              onChange={(event) =>
                setCount(Number(event.target.value))
              }
              className="mt-4 w-full"
            />

            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0</span>
              <span>{deployment.available}</span>
            </div>

          </div>

          {/* Shortage */}
          <div
            className={`rounded-xl p-4 ${
              shortage > 0
                ? "bg-red-50"
                : "bg-green-50"
            }`}
          >

            <p
              className={`text-xs font-bold ${
                shortage > 0
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {shortage > 0
                ? `${shortage} officer${
                    shortage > 1 ? "s" : ""
                  } still required`
                : "Required deployment satisfied"}
            </p>

          </div>

          {/* Action */}
          <button
            onClick={() => {
              onUpdate(deployment.id, count);
              onClose();
            }}
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Confirm Deployment
          </button>

        </div>

      </div>

    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color = "text-gray-900",
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-bold ${color}`}>
            {value}
          </p>
        </div>

        <span className="text-xl">
          {icon}
        </span>

      </div>

    </div>
  );
}

function NumberBox({
  label,
  value,
  color = "text-gray-900",
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center">

      <p className="text-[9px] text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-lg font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}

export default Deployments;