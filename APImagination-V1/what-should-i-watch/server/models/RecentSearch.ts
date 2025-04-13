// server/models/RecentSearch.ts
import mongoose from 'mongoose';

const recentSearchSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster_path: {
    type: String,
    required: true
  },
  release_date: {
    type: String,
    required: true
  },
  vote_average: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RecentSearch', recentSearchSchema);