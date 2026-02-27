import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/my");
        const jobList = res.data.content || res.data;

        setJobs(jobList);

        setStats({
          totalJobs: jobList.length,
          openJobs: jobList.filter(j => j.jobStatus === "OPEN").length,
          closedJobs: jobList.filter(j => j.jobStatus === "CLOSED").length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading dashboard...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl px-6 py-8 mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <Link
            to="/jobs/create"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            + Create Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-5 mb-10 md:grid-cols-3">
          <StatCard label="Total Jobs" value={stats.totalJobs} />
          <StatCard label="Open Jobs" value={stats.openJobs} />
          <StatCard label="Closed Jobs" value={stats.closedJobs} />
        </div>

        <h2 className="mb-4 text-xl font-semibold">My Jobs</h2>

        <div className="grid gap-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="flex items-center justify-between p-5 bg-white border border-gray-100 shadow-sm rounded-2xl"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs rounded-full
                  ${job.jobStatus === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"}`}>
                  {job.jobStatus}
                </span>

                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-lg"
                >
                  Edit
                </Link>

                <Link
                  to={`/jobs/${job.id}/applicants`}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg"
                >
                  View Applicants
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="mt-1 text-2xl font-bold">{value}</h2>
    </div>
  );
}

export default RecruiterDashboard;