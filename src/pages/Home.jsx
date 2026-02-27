import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("title", keyword);
    if (location) params.append("location", location);

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[url('https://media.istockphoto.com/id/1129644198/vector/recruitment-modern-line-design-style-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZBHS-k5azwnflpGW5gRmseB4CxUOpUUmGA3I45mJk9E=')] bg-cover bg-center relative">

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative">
        <Navbar />

        <div className="flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
          <div className="w-full max-w-5xl p-6 sm:p-10 md:p-14 text-center bg-white/90 backdrop-blur shadow-2xl rounded-2xl">

            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Find jobs and plan your next future with us!
            </h1>

            <p className="mb-8 sm:mb-10 text-gray-500 text-base sm:text-lg">
              Start your job search and find your dream job today.
            </p>

            {/* 🔽 RESPONSIVE SEARCH BAR */}
            <div className="flex flex-col sm:flex-row overflow-hidden border rounded-xl max-w-4xl mx-auto">

              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 sm:p-5 text-base sm:text-lg outline-none border-b sm:border-b-0 sm:border-r"
              />

              <input
                placeholder="Keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-4 sm:p-5 text-base sm:text-lg outline-none border-b sm:border-b-0 sm:border-r"
              />

              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-6 sm:px-10 py-4 text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Search Jobs
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              {["Remote", "Internships", "Full Time", "Part Time"].map(tag => (
                <span
                  key={tag}
                  className="px-4 sm:px-5 py-2 text-sm text-gray-600 border rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;