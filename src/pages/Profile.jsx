import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put("/users/me", form);
      setUser(res.data);
      alert("Profile updated ✅");
    } catch {
      alert("Update failed ❌");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold">My Profile</h2>

      <input name="name" value={form.name || ""} onChange={handleChange} className="input"/>
      <input name="email" value={form.email || ""} disabled className="input"/>
      <input name="bio" value={form.bio || ""} onChange={handleChange} className="input"/>
      <input name="experience" value={form.experience || ""} onChange={handleChange} className="input"/>
      <input name="skills" value={form.skills || ""} onChange={handleChange} className="input"/>

      <button onClick={handleUpdate} className="btn-primary mt-3">
        Update Profile
      </button>
    </div>
  );
}

export default Profile;