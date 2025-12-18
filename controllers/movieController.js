import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (genre) {
      query.genre = { $in: [genre] };
    }
    if (language) {
      query.language = language;
    }
    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch {
    res.status(400).json({ message: "Invalid movie data" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch {
    res.status(400).json({ message: "Invalid data" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    await movie.deleteOne();
    res.json({ message: "Movie removed" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
