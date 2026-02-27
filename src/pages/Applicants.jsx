import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Applicants() {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${id}`);
        const list = res.data.content || res.data;
        setApplications(list);
      } catch (err) {
        console.error("Error fetching applicants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  const filteredApps =
    filter === "ALL"
      ? applications
      : applications.filter(app => app.status === filter);

  if (loading) return <p className="p-6">Loading applicants...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-5xl p-6 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Applicants</h1>

        {/* 🔹 FILTER TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["ALL", "APPLIED", "SHORTLISTED", "REJECTED", "HIRED"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded transition ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🔹 APPLICANTS LIST */}
        <div className="grid gap-4">
          {filteredApps.length === 0 && (
            <p className="text-gray-500">No applicants found.</p>
          )}

          {filteredApps.map(app => (
            <div
              key={app.id}
              className="p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                {/* 👤 Applicant Info */}
                <Link to={`/applications/${app.id}`} className="flex-1">
                  <h3 className="font-semibold">{app.applicantName}</h3>
                  <p className="text-sm text-gray-500">
                    {app.applicantEmail}
                  </p>
                </Link>

                {/* 📊 Status Badge */}
                <span
                  className={`px-3 py-1 text-xs rounded ${
                    app.status === "APPLIED"
                      ? "bg-blue-100 text-blue-700"
                      : app.status === "SHORTLISTED"
                      ? "bg-green-100 text-green-700"
                      : app.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* 📄 RESUME ACTIONS */}
              {app.resumeUrl && (
                <div className="flex gap-4 mt-3 text-sm">
                  <a
                    href={`http://localhost:8080${app.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    👁 Preview Resume
                  </a>

                  <a
                    href={`http://localhost:8080${app.resumeUrl}`}
                    download
                    className="text-green-600 font-medium hover:underline"
                  >
                    ⬇ Download
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Applicants;
