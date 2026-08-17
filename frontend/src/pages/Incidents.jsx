import { useMemo, useState } from "react";

import { useLocation } from "../context/LocationContext";

const initialIncidents = [
  {
    id: "INC-001",
    type: "Accident",
    area: "Ajni",
    street: "Wardha Road",
    severity: "Critical",
    status: "Active",
    reportedAt: "12 min ago",
    description:
      "Major road accident causing heavy traffic congestion near Ajni.",
    officers: 5,
    source: "CCTV",
    cameraId: "CCTV-AJNI-01",
  },

  {
    id: "INC-002",
    type: "Traffic Congestion",
    area: "Sitabuldi",
    street: "Sitabuldi Main Road",
    severity: "High",
    status: "Active",
    reportedAt: "27 min ago",
    description:
      "Heavy congestion reported during peak traffic movement.",
    officers: 4,
    source: "CCTV",
    cameraId: "CCTV-SITABULDI-01",
  },

  {
    id: "INC-003",
    type: "Accident",
    area: "Gandhibagh",
    street: "Central Avenue",
    severity: "High",
    status: "Investigating",
    reportedAt: "38 min ago",
    description:
      "Collision involving two vehicles. Traffic movement partially affected.",
    officers: 3,
    source: "CCTV",
    cameraId: "CCTV-GANDHIBAGH-01",
  },

  {
    id: "INC-004",
    type: "Traffic Congestion",
    area: "Manewada",
    street: "Manewada Road",
    severity: "Medium",
    status: "Monitoring",
    reportedAt: "41 min ago",
    description:
      "Moderate congestion detected around the Manewada junction.",
    officers: 2,
    source: "CCTV",
    cameraId: "CCTV-MANEWADA-01",
  },

  {
    id: "INC-005",
    type: "Road Obstruction",
    area: "Indora",
    street: "Kamptee Road",
    severity: "Medium",
    status: "Resolved",
    reportedAt: "1 hr ago",
    description:
      "Temporary obstruction affected one lane of the road.",
    officers: 2,
    source: "CCTV",
    cameraId: "CCTV-INDORA-01",
  },
];

function getSeverityStyle(severity) {
  if (severity === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (severity === "High") {
    return "bg-orange-100 text-orange-700";
  }

  if (severity === "Medium") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}

function getStatusStyle(status) {
  if (status === "Active") {
    return "bg-red-50 text-red-600";
  }

  if (status === "Investigating") {
    return "bg-blue-50 text-blue-600";
  }

  if (status === "Monitoring") {
    return "bg-yellow-50 text-yellow-700";
  }

  return "bg-green-50 text-green-600";
}

function Incidents() {
  const { location } = useLocation();

  const [incidents, setIncidents] =
    useState(initialIncidents);

  const [selectedIncident, setSelectedIncident] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showReportForm, setShowReportForm] =
    useState(false);

  const [reportForm, setReportForm] =
    useState({
      type: "Accident",
      area: "",
      street: "",
      severity: "Medium",
      description: "",
      officers: "0",
    });

  const [message, setMessage] =
    useState("");

  /*
   * Show incidents according to the location
   * selected earlier through the dashboard.
   *
   * If Nagpur is selected, show all Nagpur
   * incident records.
   *
   * If an area is selected, show incidents
   * belonging to that area.
   *
   * If a street is selected, show incidents
   * belonging to that street.
   */
  const locationIncidents = useMemo(() => {
    if (location.scope === "nagpur") {
      return incidents;
    }

    if (location.street) {
      return incidents.filter(
        (incident) =>
          incident.area === location.area &&
          incident.street === location.street
      );
    }

    if (location.area) {
      return incidents.filter(
        (incident) =>
          incident.area === location.area
      );
    }

    return incidents;
  }, [
    incidents,
    location.scope,
    location.area,
    location.street,
  ]);

  const filteredIncidents = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return locationIncidents.filter(
      (incident) => {
        const matchesSearch =
          !query ||
          incident.id
            .toLowerCase()
            .includes(query) ||
          incident.type
            .toLowerCase()
            .includes(query) ||
          incident.area
            .toLowerCase()
            .includes(query) ||
          incident.street
            .toLowerCase()
            .includes(query);

        const matchesSeverity =
          severityFilter === "All" ||
          incident.severity ===
            severityFilter;

        const matchesStatus =
          statusFilter === "All" ||
          incident.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesSeverity &&
          matchesStatus
        );
      }
    );
  }, [
    locationIncidents,
    search,
    severityFilter,
    statusFilter,
  ]);

  const activeCount =
    locationIncidents.filter(
      (incident) =>
        incident.status === "Active"
    ).length;

  const criticalCount =
    locationIncidents.filter(
      (incident) =>
        incident.severity === "Critical"
    ).length;

  const investigatingCount =
    locationIncidents.filter(
      (incident) =>
        incident.status ===
        "Investigating"
    ).length;

  const resolvedCount =
    locationIncidents.filter(
      (incident) =>
        incident.status === "Resolved"
    ).length;

  const updateStatus = (
    id,
    newStatus
  ) => {
    setIncidents((previous) =>
      previous.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: newStatus,
            }
          : incident
      )
    );

    setSelectedIncident((previous) =>
      previous &&
      previous.id === id
        ? {
            ...previous,
            status: newStatus,
          }
        : previous
    );
  };

  const handleReportChange = (
    field,
    value
  ) => {
    setReportForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleReportSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      !reportForm.area.trim() ||
      !reportForm.street.trim() ||
      !reportForm.description.trim()
    ) {
      setMessage(
        "Please complete the area, street and description."
      );

      return;
    }

    const newIncident = {
      id: `INC-${String(
        incidents.length + 1
      ).padStart(3, "0")}`,

      type: reportForm.type,

      area: reportForm.area.trim(),

      street:
        reportForm.street.trim(),

      severity:
        reportForm.severity,

      status: "Active",

      reportedAt: "Just now",

      description:
        reportForm.description.trim(),

      officers:
        Number(reportForm.officers) || 0,

      source: "Manual Report",

      cameraId: null,
    };

    setIncidents((previous) => [
      newIncident,
      ...previous,
    ]);

    setSelectedIncident(
      newIncident
    );

    setReportForm({
      type: "Accident",
      area: "",
      street: "",
      severity: "Medium",
      description: "",
      officers: "0",
    });

    setShowReportForm(false);

    setMessage(
      "Incident reported successfully."
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            VIGIL Incident Management
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Traffic Incidents
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Monitor, investigate and manage
            traffic incidents across Nagpur.
          </p>
        </div>

        <button
          onClick={() => {
            setMessage("");
            setShowReportForm(true);
          }}
          className="w-fit rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + Report Incident
        </button>

      </div>

      {/* Selected Location */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

        <p className="text-[10px] font-semibold uppercase text-gray-400">
          Monitoring Location
        </p>

        <p className="mt-1 font-bold text-gray-900">
          {location.displayName}
        </p>

      </div>

      {/* Message */}
      {message && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          title="Total Incidents"
          value={locationIncidents.length}
          icon="📋"
        />

        <StatCard
          title="Active"
          value={activeCount}
          icon="🚨"
          valueClass="text-red-600"
        />

        <StatCard
          title="Critical"
          value={criticalCount}
          icon="🔴"
          valueClass="text-red-600"
        />

        <StatCard
          title="Resolved"
          value={resolvedCount}
          icon="✓"
          valueClass="text-green-600"
        />

      </div>

      {/* Search / Filters */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search incident, area, street..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <select
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">
              All Severities
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Investigating">
              Investigating
            </option>

            <option value="Monitoring">
              Monitoring
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>

        </div>

      </div>

      {/* Incident List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-200 p-5">

          <div>
            <h2 className="font-bold">
              Incident Records
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredIncidents.length} incident
              {filteredIncidents.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <span className="hidden text-xs text-gray-400 sm:block">
            {investigatingCount} under investigation
          </span>

        </div>

        {filteredIncidents.length ===
        0 ? (
          <div className="p-10 text-center">

            <div className="text-3xl">
              🔎
            </div>

            <p className="mt-3 font-semibold">
              No incidents found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              No incident data is available
              for the selected location.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {filteredIncidents.map(
              (incident) => (
                <div
                  key={incident.id}
                  className="p-5 transition hover:bg-gray-50"
                >

                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                    {/* Main information */}
                    <div className="flex min-w-0 flex-1 gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg">
                        🚨
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="font-bold text-gray-900">
                            {incident.id}
                          </p>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                            {incident.type}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${getSeverityStyle(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-semibold text-gray-800">
                          {incident.street}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {incident.area} ·{" "}
                          {incident.reportedAt}
                        </p>

                      </div>

                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${getStatusStyle(
                          incident.status
                        )}`}
                      >
                        {incident.status}
                      </span>

                      <span className="text-xs text-gray-500">
                        👮 {incident.officers}
                      </span>

                    </div>

                    {/* Action */}
                    <button
                      onClick={() =>
                        setSelectedIncident(
                          incident
                        )
                      }
                      className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* Report Incident Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-gray-200 p-5">

              <div>
                <p className="text-xs font-semibold text-blue-600">
                  MANUAL INCIDENT REPORT
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Report Incident
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowReportForm(false)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleReportSubmit}
              className="space-y-4 p-5"
            >

              <SelectField
                label="Incident Type"
                value={reportForm.type}
                onChange={(value) =>
                  handleReportChange(
                    "type",
                    value
                  )
                }
                options={[
                  "Accident",
                  "Traffic Congestion",
                  "Road Obstruction",
                  "Vehicle Breakdown",
                  "Other",
                ]}
              />

              <InputField
                label="Area"
                value={reportForm.area}
                onChange={(value) =>
                  handleReportChange(
                    "area",
                    value
                  )
                }
                placeholder="e.g. Sadar"
              />

              <InputField
                label="Street / Road"
                value={reportForm.street}
                onChange={(value) =>
                  handleReportChange(
                    "street",
                    value
                  )
                }
                placeholder="e.g. Sadar Main Road"
              />

              <SelectField
                label="Severity"
                value={reportForm.severity}
                onChange={(value) =>
                  handleReportChange(
                    "severity",
                    value
                  )
                }
                options={[
                  "Critical",
                  "High",
                  "Medium",
                ]}
              />

              <InputField
                label="Police Officers Assigned"
                type="number"
                min="0"
                value={reportForm.officers}
                onChange={(value) =>
                  handleReportChange(
                    "officers",
                    value
                  )
                }
                placeholder="0"
              />

              <div>
                <label className="text-sm font-semibold">
                  Incident Description
                </label>

                <textarea
                  value={
                    reportForm.description
                  }
                  onChange={(event) =>
                    handleReportChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Enter incident details..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowReportForm(false)
                  }
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Report Incident
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-gray-200 p-5">

              <div>
                <p className="text-xs font-semibold text-blue-600">
                  INCIDENT DETAILS
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedIncident.id}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedIncident(null)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-5">

              <div className="grid grid-cols-2 gap-3">

                <DetailItem
                  label="Type"
                  value={
                    selectedIncident.type
                  }
                />

                <DetailItem
                  label="Severity"
                  value={
                    selectedIncident.severity
                  }
                />

                <DetailItem
                  label="Area"
                  value={
                    selectedIncident.area
                  }
                />

                <DetailItem
                  label="Street"
                  value={
                    selectedIncident.street
                  }
                />

                <DetailItem
                  label="Reported"
                  value={
                    selectedIncident.reportedAt
                  }
                />

                <DetailItem
                  label="Officers"
                  value={
                    selectedIncident.officers
                  }
                />

                <DetailItem
                  label="Source"
                  value={
                    selectedIncident.source
                  }
                />

                <DetailItem
                  label="Camera"
                  value={
                    selectedIncident.cameraId ||
                    "—"
                  }
                />

              </div>

              <div>
                <p className="text-xs font-bold text-gray-700">
                  Description
                </p>

                <p className="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  {
                    selectedIncident.description
                  }
                </p>
              </div>

              {/* Status */}
              <div>

                <p className="text-xs font-bold text-gray-700">
                  Update Incident Status
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">

                  {[
                    "Active",
                    "Investigating",
                    "Monitoring",
                    "Resolved",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatus(
                          selectedIncident.id,
                          status
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                        selectedIncident.status ===
                        status
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  valueClass = "text-gray-900",
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${valueClass}`}
          >
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

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">

      <p className="text-[10px] font-semibold uppercase text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Incidents;