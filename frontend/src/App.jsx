import {
  useState,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  LocationProvider,
} from "./context/LocationContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import ControlRoom from "./pages/ControlRoom";
import PoliceAllocation from "./pages/PoliceAllocation";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";


function App() {

  /* ==========================================================
     AUTHENTICATED USER
     ========================================================== */

  const [user, setUser] = useState(() => {

    const savedSession =
      sessionStorage.getItem("vigil_session");

    if (!savedSession) {
      return null;
    }

    try {
      return JSON.parse(savedSession);

    } catch {

      sessionStorage.removeItem(
        "vigil_session"
      );

      return null;
    }
  });


  /* ==========================================================
     SIDEBAR
     ========================================================== */

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);


  /* ==========================================================
     LOGIN
     ========================================================== */

  const handleLogin = (account) => {

    setUser(account);
  };


  /* ==========================================================
     LOGOUT
     ========================================================== */

  const handleLogout = () => {

    sessionStorage.removeItem(
      "vigil_session"
    );

    setUser(null);
  };


  /* ==========================================================
     SHOW LOGIN IF NOT AUTHENTICATED
     ========================================================== */

  if (!user) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }


  /* ==========================================================
     VIGIL APPLICATION
     ========================================================== */

  return (

    <BrowserRouter>

      <LocationProvider>

        <div className="min-h-screen bg-slate-50">

          {/* ==================================================
              SIDEBAR
              ================================================== */}

          <Sidebar
            collapsed={sidebarCollapsed}
            officer={user}
            onLogout={handleLogout}
          />


          {/* ==================================================
              NAVBAR
              ================================================== */}

          <Navbar
            officer={user}
            onMenuClick={() =>
              setSidebarCollapsed(
                (value) => !value
              )
            }
          />


          {/* ==================================================
              MAIN CONTENT
              ================================================== */}

          <main
            className={`min-h-screen pt-20 transition-all duration-300 ${
              sidebarCollapsed
                ? "lg:ml-20"
                : "lg:ml-64"
            }`}
          >

            <Routes>


              {/* ==================================================
                  DASHBOARD
                  ================================================== */}

              <Route
                path="/dashboard"
                element={
                  <Dashboard />
                }
              />


              {/* ==================================================
                  RANKING
                  ================================================== */}

              <Route
                path="/ranking"
                element={
                  <Ranking />
                }
              />


              {/* ==================================================
                  CONTROL ROOM
                  ================================================== */}

              <Route
                path="/control-room"
                element={
                  <ControlRoom />
                }
              />


              {/* ==================================================
                  POLICE ALLOCATION
                  ================================================== */}

              <Route
                path="/police-allocation"
                element={
                  <PoliceAllocation />
                }
              />


              {/* ==================================================
                  INCIDENTS
                  ================================================== */}

              <Route
                path="/incidents"
                element={
                  <Incidents />
                }
              />


              {/* ==================================================
                  RISK ANALYSIS
                  ================================================== */}

              <Route
                path="/risk-analysis"
                element={
                  <Analytics />
                }
              />


              {/* ==================================================
                  ANALYTICS
                  ================================================== */}

              <Route
                path="/analytics"
                element={
                  <Analytics />
                }
              />


              {/* ==================================================
                  AI RECOMMENDATIONS
                  ================================================== */}

              <Route
                path="/recommendations"
                element={
                  <Dashboard />
                }
              />


              {/* ==================================================
                  SETTINGS
                  ================================================== */}

              <Route
                path="/settings"
                element={
                  <Settings
                    officer={user}
                    onLogout={handleLogout}
                  />
                }
              />


              {/* ==================================================
                  DEFAULT ROUTE
                  ================================================== */}

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />


              {/* ==================================================
                  UNKNOWN ROUTES
                  ================================================== */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

            </Routes>

          </main>

        </div>

      </LocationProvider>

    </BrowserRouter>
  );
}


export default App;