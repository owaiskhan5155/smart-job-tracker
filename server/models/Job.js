const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer"],
      default: "Applied",
    },

    location: {
      type: String,
      default: "Remote",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: {
      type: String,
      default: "",
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);