import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");

      await api.post("/users", data);

      setSuccess("Account created successfully 🎉");

      // redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded shadow"
      >
        <h2 className="mb-4 text-2xl font-bold">Register</h2>

        {error && (
          <p className="p-2 mb-3 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </p>
        )}

        {success && (
          <p className="p-2 mb-3 text-sm text-green-700 bg-green-100 rounded">
            {success}
          </p>
        )}

        <input
          {...register("name", { required: true })}
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          {...register("email", { required: true })}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
        />

        {/* role optional — remove if backend sets default */}
        <select {...register("role")}>
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="RECRUITER">Recruiter</option>
        </select>

        <button className="w-full py-2 text-white bg-blue-600 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;