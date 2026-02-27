import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link, useSearchParams } from "react-router-dom";
import SaveButton from "../components/SaveButton";
import EmptyState from "../components/ui/EmptyState";
import JobCardSkeleton from "../components/ui/JobCardSkeleton";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || "";
  const location = searchParams.get("location") || "";

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sort, setSort] = useState("salary,desc");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await api.get("/jobs/search", {
          params: { title, location, jobType, page, size: 5, sort },
        });

        const data = res.data;
        setJobs(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [title, location, page, sort, jobType]);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl px-6 py-8 mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Available Jobs
          </h1>

          <div className="flex flex-wrap items-center gap-3">

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="salary,desc">Salary High → Low</option>
              <option value="salary,asc">Salary Low → High</option>
              <option value="createdAt,desc">Latest</option>
            </select>

            {/* Chips */}
            {["REMOTE", "FULL_TIME", "PART_TIME", "INTERNSHIP"].map(type => {
              const active = jobType === type;
              return (
                <button
                  key={type}
                  onClick={() => setJobType(active ? "" : type)}
                  className={`px-4 py-1.5 text-sm rounded-full transition
                  ${active
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {type.replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid gap-5">

          {/* 🔄 Loading Skeleton */}
          {loading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </>
          )}

          {/* 📭 Empty State */}
          {!loading && jobs.length === 0 && (
            <EmptyState message="No jobs found" />
          )}

          {/* ✅ Jobs */}
          {!loading && jobs.length > 0 &&
            jobs.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="p-5 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <SaveButton jobId={job.id} />
                </div>

                <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                <p className="text-xs text-gray-500">{job.location}</p>
              </Link>
            ))
          }
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm bg-white border rounded-lg shadow-sm disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm bg-white border rounded-lg shadow-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Jobs;