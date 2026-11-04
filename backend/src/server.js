import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

// Local / traditional server entry. On Vercel, api/index.js is used instead.
const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`GRVTY API running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
