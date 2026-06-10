import axios from "axios";

import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";



function Dashboard() {

  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    priority: "Medium",
    status: "Applied",
    location: "",
    notes: "",
  });

    const fetchJobs = async () => {
    try {
        const response = await axios.get(
        "http://localhost:3000/api/jobs",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        setJobs(response.data);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
    };
  const deleteJob = async (id) => {

  try {

    await axios.delete(
      `http://localhost:3000/api/jobs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchJobs();

  } catch (error) {

    console.log(error);

  }
};
const updateStatus = async (id, status) => {

  try {

    await axios.put(
      `http://localhost:3000/api/jobs/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchJobs();

  } catch (error) {

    console.log(error);

  }
};

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:3000/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        company: "",
        position: "",
        status: "Applied",
        location: "",
      });

      fetchJobs();

    } catch (error) {

      console.log(error);

    }
  };
  const stats = {
  total: jobs.length,
  applied: jobs.filter(job => job.status === "Applied").length,
  interview: jobs.filter(job => job.status === "Interview").length,
  offer: jobs.filter(job => job.status === "Offer").length,
};
const getStatusColor = (status) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-700";

    case "Interview":
      return "bg-yellow-100 text-yellow-700";

    case "Offer":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">
        Loading jobs...
      </h1>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-3xl font-bold text-blue-600">
            Smart Job Tracker
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">


            <StatCard
                title="Total Jobs"
                count={stats.total}
            />

            <StatCard
                title="Applied"
                count={stats.applied}
            />

            <StatCard
                title="Interview"
                count={stats.interview}
            />

            <StatCard
                title="Offers"
                count={stats.offer}
            />

        </div>
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Add New Job
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
                >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Offer</option>
            </select>

            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes..."
                className="border border-gray-300 rounded-lg px-4 py-2"
                />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition md:col-span-2"
            >
              Add Job
            </button>

          </form>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.length === 0 ? (
  <div className="col-span-full bg-white p-8 rounded-2xl shadow text-center">
    <h2 className="text-xl font-semibold">
      No jobs added yet 🚀
    </h2>

    <p className="text-gray-500 mt-2">
      Add your first job application above.
    </p>
  </div>
) : (
  jobs
    .filter((job) =>
      job.company
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((job) => (

                <div
                    key={job._id}
                    className="bg-white p-5 rounded-2xl shadow"
                >

                    <h2 className="text-2xl font-bold text-blue-600">
                    {job.company}
                    </h2>

                    <p className="mt-2">
                    <span className="font-semibold">
                        Position:
                    </span>{" "}
                    {job.position}
                    </p>

                    <p>
                    <span className="font-semibold">
                        Priority:
                    </span>
                    {" "}
                    {job.priority}
                    </p>

                    <p className="mt-1">
                    <span className="font-semibold">
                        Location:
                    </span>{" "}
                    {job.location}
                    </p>


                    <p className="text-sm text-gray-500 mt-2">
                    Applied on: {new Date(job.createdAt).toLocaleDateString()}
                    </p>

                    <p className="mt-2 text-gray-600">
                        {job.notes}
                    </p>

                    <div className="mt-3">

                    <label className="font-semibold">
                        <span className="font-semibold">Status: </span>

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}
                            >
                                {job.status}
                            </span>
                    </label>

                    <select
                        value={job.status}
                        onChange={(e) =>
                        updateStatus(job._id, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    >
                        <option>Applied</option>
                        <option>Interview</option>
                        <option>Rejected</option>
                        <option>Offer</option>
                    </select>

                    </div>
                    

                    <button
                    onClick={() => deleteJob(job._id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                    Delete Job
                    </button>

                </div>
            ))
        )}

        </div>

      </div>

    </div>
    );
}

export default Dashboard;