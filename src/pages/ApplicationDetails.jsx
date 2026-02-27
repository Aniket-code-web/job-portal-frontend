import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ⭐ Notes state
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data);

        // If notes exist
        setNotes(res.data.notes || "");
      } catch (err) {
        console.error("Error fetching application", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const updateStatus = async (action) => {
    try {
      setUpdating(true);
      await api.put(`/applications/${id}/${action}`);
      setApplication(prev => ({
        ...prev,
        status: action.toUpperCase(),
      }));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };
const saveNotes = async () => {
  console.log("SAVE CLICKED", notes);

  try {
    setSavingNotes(true);

    await api.put(`/applications/${id}/notes`, { notes });

    setApplication(prev => ({
      ...prev,
      notes: notes
    }));

    toast.success("Notes saved");

  } catch (err) {
    console.error(err);
    toast.error("Failed to save notes");
  } finally {
    setSavingNotes(false);
  }
};

  if (loading) return <p className="p-6">Loading applicant...</p>;
  if (!application) return <p className="p-6">Applicant not found</p>;

  const skills = application.skills?.split(",") || [];

  return (
    <>
      <Navbar />

      <div className="max-w-4xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Applicant Profile</h1>

        <div className="p-6 bg-white rounded-xl shadow">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 text-xl font-bold text-white bg-indigo-600 rounded-full">
              {application.applicantName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {application.applicantName}
              </h2>
              <p className="text-sm text-gray-500">
                {application.applicantEmail}
              </p>
            </div>
          </div>

          {/* JOB INFO */}
          <div className="mb-6 space-y-1">
            <p className="text-gray-600">
              Applied for:{" "}
              <span className="font-medium">{application.jobTitle}</span>
            </p>
            <p className="text-gray-600">
              Company:{" "}
              <span className="font-medium">{application.company}</span>
            </p>
            <p className="text-sm text-gray-400">
              Applied on{" "}
              {new Date(application.appliedAt).toLocaleString()}
            </p>
          </div>

          <Section title="About">
            {application.bio || "Candidate has not added bio yet."}
          </Section>

          <Section title="Skills">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              "No skills added"
            )}
          </Section>

          <Section title="Experience">
            {application.experience ||
              "No experience details provided."}
          </Section>

          {/* ⭐ RECRUITER NOTES */}
          <Section title="Recruiter Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write private notes about this candidate..."
              className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />

            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="px-4 py-2 mt-3 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {savingNotes ? "Saving..." : "Save Notes"}
            </button>
          </Section>

          {application.resumeUrl && (
            <div className="mt-6">
              <a
                href={`http://localhost:8080${application.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Download Resume
              </a>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-8">
            <button
              disabled={updating}
              onClick={() => updateStatus("shortlist")}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Shortlist
            </button>

            <button
              disabled={updating}
              onClick={() => updateStatus("reject")}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Reject
            </button>

            <button
              disabled={updating}
              onClick={() => updateStatus("hire")}
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Hire
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Current Status:{" "}
            <span className="font-semibold">
              {application.status}
            </span>
          </p>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase">
        {title}
      </h3>
      <div className="p-4 text-sm text-gray-600 bg-gray-50 rounded">
        {children}
      </div>
    </div>
  );
}

export default ApplicationDetails;