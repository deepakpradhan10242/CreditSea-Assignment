const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const reportRouter = require('./routes/report.routes');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Strict CORS Setup

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://credit-sea-assignment-cyan.vercel.app', // Production
  'http://localhost:5173', // Dev (Vite default)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// -------------------
app.use(express.json());

// Simple console-based request logging
app.use(
  morgan('tiny', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// Routes
app.use('/api', reportRouter);

// Error handler middleware
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('✅ MongoDB connected'))
  .catch((err) => logger.error(`❌ MongoDB connection failed: ${err.message}`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));

module.exports = app; // For integration testing
