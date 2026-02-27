import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast"; // ✅ added

function UserApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false); // ✅ state

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data);
      } catch (err) {
        console.error("Error fetching application", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ✅ Withdraw function
  const withdrawApplication = async () => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      setWithdrawing(true);
      await api.delete(`/applications/${id}`);
      toast.success("Application withdrawn successfully");
      navigate("/dashboard"); // go back to dashboard
    } catch (err) {
      console.error("Withdraw failed", err);
      toast.error("Failed to withdraw application");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!application) return <p className="p-6">Application not found</p>;

  return (
    <>
      <Navbar />

      <div className="p-6 mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <div className="p-6 bg-white rounded shadow">

          <h1 className="mb-4 text-2xl font-bold">
            {application.jobTitle}
          </h1>

          <p className="mb-2 text-gray-600">
            Company: {application.company}
          </p>

          <p className="mb-2 text-gray-600">
            Applied On: {new Date(application.appliedAt).toLocaleDateString()}
          </p>

          <div className="mb-4">
            <span className={getStatusStyle(application.status)}>
              {application.status}
            </span>
          </div>

          {application.resumeUrl && (
            <a
              href={`http://localhost:8080${application.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 mr-3 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Download Resume
            </a>
          )}

          {/* ✅ Withdraw Button */}
          <button
            onClick={withdrawApplication}
            disabled={withdrawing}
            className="px-4 py-2 mt-3 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {withdrawing ? "Withdrawing..." : "Withdraw Application"}
          </button>

        </div>
      </div>
    </>
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

export default UserApplicationDetails;