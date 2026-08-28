import {
  NavLink,
} from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Ranking",
    path: "/ranking",
    icon: "🏆",
  },
  {
    name: "Control Room",
    path: "/control-room",
    icon: "🎛️",
  },
  {
    name: "Police Allocation",
    path: "/police-allocation",
    icon: "👮",
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: "🚨",
  },
  {
    name: "Risk Analysis",
    path: "/risk-analysis",
    icon: "📊",
  },
 
  {
    name: "AI Recommendations",
    path: "/recommendations",
    icon: "🤖",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "⚙️",
  },
];

function Sidebar({
  collapsed,
  onLogout,
  officer,
}) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-[60] bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed
          ? "w-20"
          : "w-64"
      }`}
    >
      <div className="h-20 flex items-center px-4 border-b border-slate-200">

       <img
  src="/vigil-logo.png"
  alt="VIGIL"
  className="w-20 h-20 object-contain flex-shrink-0"
/>

        {!collapsed && (
          <div className="ml-3">
            <h1 className="font-bold text-xl">
              VIGIL
            </h1>

          </div>
        )}
      </div>

      <nav className="p-3 overflow-y-auto h-[calc(100vh-155px)]">

        {navigation.map(
          (item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({
                isActive,
              }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <span className="w-7 text-center">
                {item.icon}
              </span>

              {!collapsed && (
                <span className="text-sm">
                  {item.name}
                </span>
              )}
            </NavLink>
          )
        )}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-3">

        {!collapsed && (
          <div className="flex items-center mb-3">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              👮
            </div>

            <div className="ml-3 min-w-0">
              <p className="text-sm font-semibold truncate">
                {officer?.name ||
                  "Traffic Officer"}
              </p>

              <p className="text-xs text-green-600">
                ● Online
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-sm"
        >
          {collapsed
            ? "↪"
            : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;