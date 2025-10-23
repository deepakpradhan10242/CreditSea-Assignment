const express = require('express');
const multer = require('multer');
const { parseStringPromise } = require('xml2js');
const Report = require('../models/report.model');
const { mapXmlToReport } = require('../utils/mapper');
const logger = require('../utils/logger');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload XML
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('XML file required');
      err.statusCode = 400;
      throw err;
    }

    const xml = req.file.buffer.toString('utf8');
    const json = await parseStringPromise(xml, { explicitArray: false });
    const mapped = mapXmlToReport(json);

    const doc = await Report.create(mapped);
    logger.info(`✅ Report uploaded successfully (id: ${doc._id})`);
    res.status(201).json({ id: doc._id });
  } catch (err) {
    logger.error(`Upload failed: ${err.message}`);
    next(err);
  }
});

// Get all reports
router.get('/reports', async (_req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    logger.error(`Failed to fetch reports: ${err.message}`);
    next(err);
  }
});

// Get one report by ID
router.get('/reports/:id', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      const err = new Error('Report not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(report);
  } catch (err) {
    logger.error(`Failed to fetch report ${req.params.id}: ${err.message}`);
    next(err);
  }
});

// Delete report by ID
router.delete('/reports/:id', async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      const err = new Error('Report not found');
      err.statusCode = 404;
      throw err;
    }
    logger.info(`🗑️ Report deleted successfully (id: ${req.params.id})`);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    logger.error(`Failed to delete report ${req.params.id}: ${err.message}`);
    next(err);
  }
});

module.exports = router;
