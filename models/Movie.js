import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    times: [{ type: String, required: true }]
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: [{ type: String }],
    duration: { type: Number, required: true }, // minutes
    language: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 10 },
    poster: { type: String, required: true },
    trailer: { type: String },
    cast: [{ type: String }],
    director: { type: String },
    price: { type: Number, required: true },
    status: { type: String, enum: ["now_showing", "coming_soon"], default: "now_showing" },
    showtimes: [showtimeSchema]
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
