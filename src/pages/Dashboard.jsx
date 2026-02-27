import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthContext";
import { Link } from "react-router-dom"; // ✅ added

function Dashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    hired: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");

        const list = res.data.content || [];
        setApplications(list);

        const total = list.length;
        const applied = list.filter(a => a.status === "APPLIED").length;
        const hired = list.filter(a => a.status === "HIRED").length;
        const rejected = list.filter(a => a.status === "REJECTED").length;

        setStats({ total, applied, hired, rejected });

      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <>
      <Navbar />

      <div className="p-6 mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.sub} 👋
          </p>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
          <Stat title="Applications" value={stats.total} />
          <Stat title="Applied" value={stats.applied} />
          <Stat title="Hired" value={stats.hired} />
          <Stat title="Rejected" value={stats.rejected} />
        </div>

        {/* 📋 Applications List */}
        <h2 className="mb-4 text-xl font-semibold">My Applications</h2>

        <div className="grid gap-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 bg-white rounded shadow"
            >
              <div>
                <h3 className="font-semibold">{app.jobTitle}</h3>
                <p className="text-sm text-gray-500">{app.company}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={getStatusStyle(app.status)}>
                  {app.status}
                </span>

                {/* ✅ THIS IS THE LINK YOU ASKED ABOUT */}
                <Link
                  to={`/my-applications/${app.id}`}
                  className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  View
                </Link>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <p className="p-4 text-gray-500 bg-white rounded shadow">
              You haven’t applied to any jobs yet.
            </p>
          )}
        </div>

      </div>
    </>
  );
}

function Stat({ title, value }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "APPLIED")
    return "px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700";

  if (status === "HIRED")
    return "px-3 py-1 text-xs rounded bg-green-100 text-green-700";

  if (status === "REJECTED")
    return "px-3 py-1 text-xs rounded bg-red-100 text-red-700";

  return "px-3 py-1 text-xs rounded bg-gray-200 text-gray-600";
}

export default Dashboard;