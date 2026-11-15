const Assignment = require("../models/Assignment");
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id })
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Get assignments error:", error.message);
    res.status(500).json({ message: "Server error while retrieving assignments." });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("Get assignment error:", error.message);
    res.status(500).json({ message: "Server error while retrieving assignment." });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, courseName, dueDate, priority, status } = req.body;
    if (!title || !courseName || !dueDate) {
      return res.status(400).json({
        message: "Title, course name, and due date are required.",
      });
    }
    const assignment = await Assignment.create({
      user: req.user._id,
      title,
      description,
      courseName,
      dueDate,
      priority,
      status,
    });
    res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error while creating assignment." });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "courseName",
      "dueDate",
      "priority",
      "status",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }
    res.status(200).json({
      success: true,
      message: "Assignment updated successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error while updating assignment." });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }
    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete assignment error:", error.message);
    res.status(500).json({ message: "Server error while deleting assignment." });
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};