const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { auth } = require("../middleware/auth");
const router = express.Router();

// POST /api/registrations -> Register the logged-in user for an event
router.post("/", auth, async (req, res, next) => {
  try {
    const { eventId } = req.body;

    // Check 1: Does the event exist?
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check 2: Are seats available?
    if (event.seats < 1) {
      return res.status(400).json({ message: "No seats left" });
    }

    // Check 3: Has this user already registered?
    const alreadyRegistered = await Registration.findOne({
      user: req.user.id,
      event: event._id,
    });
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Create registration record
    await Registration.create({ user: req.user.id, event: event._id });

    // Reduce seat count by 1 and save
    event.seats = event.seats - 1;
    await event.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
});

// GET /api/registrations/my -> View all registrations for logged-in user
router.get("/my", auth, async (req, res, next) => {
  try {
    const list = await Registration.find({ user: req.user.id }).populate("event");
    res.json(list.filter((r) => r.event !== null));
  } catch (err) {
    next(err);
  }
});

module.exports = router;