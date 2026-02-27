import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...job,
        expiryDate: job.expiryDate.split("T")[0] + "T00:00:00",
      };

      await api.put(`/jobs/${id}`, payload);
      toast.success("Job updated successfully ✅");
      navigate("/recruiter/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job");
    }
  };

  const handleCloseJob = async () => {
    try {
      await api.put(`/jobs/${id}`, { ...job, jobStatus: "CLOSED" });
      setJob({ ...job, jobStatus: "CLOSED" });
      toast.success("Job closed successfully 🚫");
    } catch {
      toast.error("Failed to close job");
    }
  };

  const handleReopen = async () => {
    try {
      await api.put(`/jobs/${id}`, { ...job, jobStatus: "OPEN" });
      setJob({ ...job, jobStatus: "OPEN" });
      toast.success("Job reopened successfully ✅");
    } catch {
      toast.error("Failed to reopen job");
    }
  };

  if (loading) return <p className="p-6">Loading job...</p>;
  if (!job) return <p className="p-6">Job not found</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-2xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Edit Job</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <input name="title" value={job.title} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="company" value={job.company} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="location" value={job.location} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="salary" value={job.salary} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="date" name="expiryDate" value={job.expiryDate?.split("T")[0]} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="description" value={job.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded" />

          <div className="flex gap-3">
            <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded">Update Job</button>

            {job.jobStatus === "OPEN" && (
              <button type="button" onClick={handleCloseJob} className="w-full py-2 text-white bg-red-600 rounded">
                Close Job
              </button>
            )}

            {job.jobStatus === "CLOSED" && (
              <button type="button" onClick={handleReopen} className="w-full py-2 text-white bg-green-600 rounded">
                Re-Open Job
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default EditJob;