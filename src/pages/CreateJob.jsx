import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function CreateJob() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        expiryDate: data.expiryDate + "T00:00:00",
      };

      await api.post("/jobs", payload);

      toast.success("Job created successfully 🚀");
      reset();
      navigate("/recruiter/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Create New Job</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
          <input {...register("title")} className="w-full p-2 border rounded" placeholder="Job Title" />
          <input {...register("company")} className="w-full p-2 border rounded" placeholder="Company" />
          <input {...register("location")} className="w-full p-2 border rounded" placeholder="Location" />
          <input type="number" {...register("salary")} className="w-full p-2 border rounded" placeholder="Salary" />
          <input type="date" {...register("expiryDate")} className="w-full p-2 border rounded" />
          <textarea {...register("description")} rows="4" className="w-full p-2 border rounded" placeholder="Description" />

          <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded">
            Create Job
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateJob;