import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

const SEAT_PRICES = {
  regular: 150,
  premium: 200,
  vip: 300
};

export const createBooking = async (req, res) => {
  try {
    const { movieId, showDate, showtime, seats } = req.body;
    if (!movieId || !showDate || !showtime || !seats || !seats.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const showDateObj = new Date(showDate);
    const existing = await Booking.find({
      movie: movieId,
      showDate: showDateObj,
      showtime,
      bookingStatus: "active",
      "seats.seatNumber": { $in: seats.map((s) => s.seatNumber) }
    });

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Some selected seats are already booked" });
    }

    const totalAmount = seats.reduce(
      (sum, seat) => sum + (SEAT_PRICES[seat.type] || 0),
      0
    );

    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showDate: showDateObj,
      showtime,
      seats,
      totalAmount,
      paymentStatus: "paid"
    });

    res.status(201).json(booking);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("movie", "title poster")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("movie", "title")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookedSeats = async (req, res) => {
  try {
    const { movieId, showDate, showtime } = req.query;
    if (!movieId || !showDate || !showtime) {
      return res.status(400).json({ message: "movieId, showDate, showtime required" });
    }
    const showDateObj = new Date(showDate);
    const bookings = await Booking.find({
      movie: movieId,
      showDate: showDateObj,
      showtime,
      bookingStatus: "active"
    });
    const bookedSeats = bookings.flatMap((b) => b.seats.map((s) => s.seatNumber));
    res.json({ bookedSeats });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to cancel" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
