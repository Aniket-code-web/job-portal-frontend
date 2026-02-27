import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthContext";
import toast from "react-hot-toast";

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const [resume, setResume] = useState(null);
  const [resumeURL, setResumeURL] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF resumes allowed");
      return;
    }

    setResume(file);
    setResumeURL(URL.createObjectURL(file));
  };

  const handleApply = async () => {
    if (!resume) {
      toast.error("Please attach resume");
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append("resume", resume);

      await api.post(`/applications/apply/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplied(true);
      toast.success("Application submitted 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="p-6">Loading job...</p>;
  if (!job) return <p className="p-6">Job not found</p>;

  const isOwner =
    user?.role === "RECRUITER" &&
    Number(user?.id) === Number(job?.createdById);

  return (
    <>
      <Navbar />

      <div className="max-w-3xl p-6 mx-auto">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <span className="text-sm text-gray-500">
            Posted by: {job.createdByName}
          </span>
        </div>

        <p className="mt-2 text-gray-600">{job.company}</p>
        <p className="mb-4 text-gray-500">{job.location}</p>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">Job Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Salary: ₹ {job.salary}</p>
          <p className="text-sm text-gray-500">Status: {job.jobStatus}</p>
        </div>

        {user?.role === "JOB_SEEKER" && (
          <div className="mt-6 space-y-4">
            <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                <div className="flex items-center justify-center w-12 h-12 text-indigo-600 bg-indigo-100 rounded-full">
                  📄
                </div>

                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    Upload your resume
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF only • Max 5MB
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>
            </div>

            {resume && (
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <span className="text-sm font-medium text-gray-700">
                    {resume.name}
                  </span>
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => window.open(resumeURL)}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Preview
                  </button>

                  <a
                    href={resumeURL}
                    download={resume.name}
                    className="font-medium text-green-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={applying || applied}
              className={`px-6 py-2 rounded text-white ${
                applied
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {applied ? "Applied ✅" : applying ? "Applying..." : "Apply Now"}
            </button>
          </div>
        )}

        {isOwner && (
          <div className="mt-6">
            <Link
              to={`/jobs/${job.id}/applicants`}
              className="px-6 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              View Applicants
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default JobDetails;