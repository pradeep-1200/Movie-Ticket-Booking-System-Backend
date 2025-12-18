import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import User from "./models/User.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

const getShowtimes = () => {
  const today = new Date();
  const times = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  const days = [0, 1, 2];

  return days.map((offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    d.setHours(0, 0, 0, 0);
    return { date: d, times };
  });
};

const movies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: 148,
    language: "English",
    releaseDate: new Date("2010-07-16"),
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/inception.jpg",
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    director: "Christopher Nolan",
    price: 200,
    status: "now_showing"
  },
  {
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham City.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    language: "English",
    releaseDate: new Date("2008-07-18"),
    rating: 9.0,
    poster: "https://image.tmdb.org/t/p/w500/darkknight.jpg",
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    cast: ["Christian Bale", "Heath Ledger"],
    director: "Christopher Nolan",
    price: 200,
    status: "now_showing"
  },
  {
    title: "Interstellar",
    description: "A team travels through a wormhole in space.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    duration: 169,
    language: "English",
    releaseDate: new Date("2014-11-07"),
    rating: 8.6,
    poster: "https://image.tmdb.org/t/p/w500/interstellar.jpg",
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    cast: ["Matthew McConaughey", "Anne Hathaway"],
    director: "Christopher Nolan",
    price: 200,
    status: "now_showing"
  },
  {
    title: "Avengers: Endgame",
    description: "The Avengers assemble once more.",
    genre: ["Action", "Adventure", "Drama"],
    duration: 181,
    language: "English",
    releaseDate: new Date("2019-04-26"),
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/endgame.jpg",
    trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    cast: ["Robert Downey Jr.", "Chris Evans"],
    director: "Anthony Russo, Joe Russo",
    price: 250,
    status: "now_showing"
  },
  {
    title: "Parasite",
    description: "A poor family schemes to become employed by a wealthy family.",
    genre: ["Comedy", "Drama", "Thriller"],
    duration: 132,
    language: "Korean",
    releaseDate: new Date("2019-05-30"),
    rating: 8.6,
    poster: "https://image.tmdb.org/t/p/w500/parasite.jpg",
    trailer: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    cast: ["Song Kang-ho", "Lee Sun-kyun"],
    director: "Bong Joon-ho",
    price: 180,
    status: "now_showing"
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over years.",
    genre: ["Drama"],
    duration: 142,
    language: "English",
    releaseDate: new Date("1994-09-23"),
    rating: 9.3,
    poster: "https://image.tmdb.org/t/p/w500/shawshank.jpg",
    trailer: "https://www.youtube.com/watch?v=NmzuHjWmXOc",
    cast: ["Tim Robbins", "Morgan Freeman"],
    director: "Frank Darabont",
    price: 180,
    status: "now_showing"
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Movie.deleteMany();
    await User.deleteMany();

    const showtimes = getShowtimes();
    const moviesWithShowtimes = movies.map((m) => ({ ...m, showtimes }));

    await Movie.insertMany(moviesWithShowtimes);

    await User.create({
      name: "Admin",
      email: "admin@cinebook.com",
      password: "admin123",
      phone: "9999999999",
      role: "admin"
    });

    console.log("Seed completed");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
