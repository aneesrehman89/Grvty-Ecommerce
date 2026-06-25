import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

app.listen(PORT, () => {
  console.log(`GRVTY Backend executing on port ${PORT} inside src/ directory`);
});