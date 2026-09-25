const Event = require("../models/Event");

// ─── GET /api/events ─────────────────────────────────────────────────────────
// Public — Get all events sorted by date (FR9)
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve events." });
  }
};

// ─── GET /api/events/all ─────────────────────────────────────────────────────
// Admin only — Get all events including past ones (FR7)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ eventDate: -1 })
      .populate("createdBy", "username");
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve events." });
  }
};

// ─── GET /api/events/:id ─────────────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve event." });
  }
};

// ─── POST /api/events ────────────────────────────────────────────────────────
// Admin only — Create a new event (FR7)
const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location } = req.body;
    const event = await Event.create({
      title,
      description,
      eventDate,
      location: location || null,
      createdBy: req.admin.id,
    });
    return res
      .status(201)
      .json({ message: "Event created successfully.", event });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create event." });
  }
};

// ─── PUT /api/events/:id ─────────────────────────────────────────────────────
// Admin only — Update an event (FR7)
const updateEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, eventDate, location },
      { new: true, runValidators: true },
    );
    if (!event) return res.status(404).json({ error: "Event not found." });
    return res.json({ message: "Event updated successfully.", event });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update event." });
  }
};

// ─── DELETE /api/events/:id ──────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    return res.json({ message: "Event deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete event." });
  }
};

module.exports = {
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
