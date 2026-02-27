import { useState } from "react";
import api from "../api/axios";

export default function SaveButton({ jobId }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();   // stop Link navigation
    e.stopPropagation();  // stop parent click

    try {
      setLoading(true);

      await api.post(`/saved-jobs/${jobId}`);

      setSaved(prev => !prev);

    } catch (err) {
      console.error("Error saving job", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 rounded-lg border text-sm transition
        ${saved
          ? "bg-indigo-100 border-indigo-400 text-indigo-700"
          : "hover:bg-gray-100"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Saving..." : saved ? "✅ Saved" : "Save"}
    </button>
  );
}