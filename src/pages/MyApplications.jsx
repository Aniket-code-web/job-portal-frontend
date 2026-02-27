import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");
       setApplications(res.data.content);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-3xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">My Applications</h1>

        {applications.length === 0 ? (
          <p className="text-gray-500">
            You haven’t applied to any jobs yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white rounded shadow"
              >
                {/* Job Title */}
                <h2 className="text-lg font-semibold">
                  {app.jobTitle || app.job?.title}
                </h2>

                {/* Company */}
                <p className="text-gray-600">
                  {app.company || app.job?.company}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    Applied on{" "}
                    {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString()
                      : "N/A"}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded ${
                      app.status === "APPLIED"
                        ? "bg-blue-100 text-blue-600"
                        : app.status === "SHORTLISTED"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyApplications;
