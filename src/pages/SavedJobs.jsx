import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/saved-jobs/my");
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6 mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold">Saved Jobs</h1>

        {/* 🔄 Loading */}
        {loading && <Spinner />}

        {/* 📭 Empty State */}
        {!loading && savedJobs.length === 0 && (
          <EmptyState message="No saved jobs yet" />
        )}

        {/* ✅ Saved Jobs */}
        {!loading && savedJobs.length > 0 && (
          <div className="grid gap-4">
            {savedJobs.map(item => (
              <Link
                key={item.id}
                to={`/jobs/${item.job.id}`}
                className="p-4 bg-white rounded shadow hover:bg-gray-50"
              >
                <h3 className="font-semibold">{item.job.title}</h3>
                <p className="text-sm text-gray-600">{item.job.company}</p>
                <p className="text-xs text-gray-500">{item.job.location}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SavedJobs;