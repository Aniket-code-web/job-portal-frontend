import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      setError("");

      const res = await api.post("/users/login", data);
      const token = res.data;

      login(token);
      navigate("/");

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded shadow"
      >
        <h2 className="mb-4 text-2xl font-bold">Login</h2>

        {error && (
          <p className="p-2 mb-3 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </p>
        )}

        <input
          {...register("email", { required: true })}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />

        <button className="w-full py-2 text-white bg-blue-600 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
