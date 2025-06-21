import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroPage from "./Components/HeroPage";
import AboutPage from "./Components/AboutPage";
import ContactPage from "./Components/ContactPage";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import RequireAuth from "./Components/RequireAuth";
import Events from "./Pages/Events";
import Students from "./Pages/Students";
import Report from "./Pages/Report";
import Setting from "./Pages/Setting";
import EventDetail from "./Components/EventDetail";
import CheckIn from "./Pages/CheckIn";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HeroPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />

        {/* Private route */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </RequireAuth>
          }
        />
         <Route
          path="/events"
          element={
            <RequireAuth>
              <PrivateLayout>
                <Events />
              </PrivateLayout>
            </RequireAuth>
          }
        />
         <Route
          path="/settings"
          element={
            <RequireAuth>
              <PrivateLayout>
                <Setting />
              </PrivateLayout>
            </RequireAuth>
          }
        />
         <Route
          path="/report"
          element={
            <RequireAuth>
              <PrivateLayout>
                <Report />
              </PrivateLayout>
            </RequireAuth>
          }
        />
         <Route
          path="/students"
          element={
            <RequireAuth>
              <PrivateLayout>
                <Students />
              </PrivateLayout>
            </RequireAuth>
          }
        /> <Route
          path="/checkin"
          element={
            <RequireAuth>
              <PrivateLayout>
                <CheckIn />
              </PrivateLayout>
            </RequireAuth>
          }
        />
         <Route
          path="/event/:id"
          element={
            <RequireAuth>
              <PrivateLayout>
                <EventDetail />
              </PrivateLayout>
            </RequireAuth>
          }
        />  
      </Routes>
    </Router>
  );
}

export default App;
