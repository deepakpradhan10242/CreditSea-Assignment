const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  { _id: false }
);

const AccountSchema = new mongoose.Schema(
  {
    bank: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    portfolioType: { type: String, default: '' },
    accountType: { type: String, default: '' },
    currentBalance: { type: Number, default: 0 },
    amountPastDue: { type: Number, default: 0 },
    openDate: { type: String, default: '' },
    dateReported: { type: String, default: '' },
    holderName: { type: String, default: '' },
    holderAddress: { type: AddressSchema, default: {} },
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema(
  {
    basic: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      mobile: { type: String, default: '' },
      pan: { type: String, index: true, default: '' },
    },
    summary: {
      totalAccounts: { type: Number, default: 0 },
      activeAccounts: { type: Number, default: 0 },
      closedAccounts: { type: Number, default: 0 },
      outstandingAll: { type: Number, default: 0 },
      outstandingSecured: { type: Number, default: 0 },
      outstandingUnsecured: { type: Number, default: 0 },
      last7daysEnquiries: { type: Number, default: 0 },
    },
    accounts: { type: [AccountSchema], default: [] },
    score: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
