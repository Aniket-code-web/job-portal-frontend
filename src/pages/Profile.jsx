import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    experience: "",
    skills: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put("/users/me", form);
      setMessage("Profile updated successfully ✅");
    } catch {
      setMessage("Update failed ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {message && (
          <p className="mb-4 text-sm text-center text-blue-600">
            {message}
          </p>
        )}

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={form.email || ""}
              disabled
              className="w-full p-2 border rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Experience</label>
            <input
              name="experience"
              value={form.experience || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Skills</label>
            <input
              name="skills"
              value={form.skills || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile;