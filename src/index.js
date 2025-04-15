import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';


dotenv.config({
    path: "./env"
});

(async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`✅ Server running at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ MONGODB CONNECTION ERROR:', error);
    }
  })();