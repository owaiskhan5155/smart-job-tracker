const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const { company, position, status, location } =
      req.body;

    const job = await Job.create({
      company,
      position,
      status,
      location,
      createdBy: req.user,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const jobs = await Job.find({
      createdBy: req.user,
      company: {
        $regex: search,
        $options: "i",
      },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};