import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true }, // e.g. "A1"
    type: { type: String, enum: ["regular", "premium", "vip"], required: true }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    showtime: { type: String, required: true },      // "10:00 AM"
    showDate: { type: Date, required: true },
    seats: [seatSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid"
    },
    bookingStatus: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active"
    },
    bookingId: { type: String, unique: true }
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = `CB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
