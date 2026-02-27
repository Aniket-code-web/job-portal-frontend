import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import Home from "../pages/home";
import MyApplications from "../pages/MyApplications";
import Applicants from "../pages/Applicants"; // ⭐ NEW
import RecruiterDashboard from "../pages/RecruiterDashboard";
import ApplicationDetails from "../pages/ApplicationDetails";
import CreateJob from "../pages/CreateJob";
import EditJob from "../pages/EditJob";
import UserApplicationDetails from "../pages/UserApplicationDetails";
import Profile from "../pages/Profile";
import SavedJobs from "../pages/SavedJobs";


export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  { path: "/jobs", element: <Jobs /> },

  { path: "/jobs/:id", element: <JobDetails /> },

  // ⭐ NEW ROUTE
  { path: "/jobs/:id/applicants", element: <Applicants /> },

  { path: "/my-applications", element: <MyApplications /> },

  {
  path: "/recruiter/dashboard",
  element: <RecruiterDashboard />,
},

{
  path: "/applications/:id",
  element: <ApplicationDetails />,
},
{
  path: "/jobs/create",
  element: <CreateJob />,
},
{
  path: "/jobs/:id/edit",
  element: <EditJob />,
},

{
  path: "/my-applications/:id",
  element: <UserApplicationDetails/>
},
{
  path: "/profile",
  element: <Profile />
},
{
  path: "/saved-jobs",
  element: <SavedJobs />,
},

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
