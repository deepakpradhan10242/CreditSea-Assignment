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

app.use(cors());
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
