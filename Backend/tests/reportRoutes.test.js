const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Report = require('../src/models/report.model');
const reportRouter = require('../src/routes/report.routes');

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', reportRouter);
});

beforeEach(async () => {
  await Report.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Integration: Report Routes', () => {
  test('POST /api/upload → should upload a valid XML file', async () => {
    const sampleXml = `
      <INProfileResponse>
        <Current_Application>
          <Current_Application_Details>
            <Current_Applicant_Details>
              <First_Name>Sagar</First_Name>
              <Last_Name>Ugle</Last_Name>
              <MobilePhoneNumber>9999999999</MobilePhoneNumber>
            </Current_Applicant_Details>
          </Current_Application_Details>
        </Current_Application>
        <SCORE><BureauScore>745</BureauScore></SCORE>
        <CAIS_Account>
          <CAIS_Account_DETAILS>
            <Subscriber_Name>HDFC Bank</Subscriber_Name>
            <Account_Number>XXXX1234</Account_Number>
            <Current_Balance>50000</Current_Balance>
            <Amount_Past_Due>0</Amount_Past_Due>
          </CAIS_Account_DETAILS>
        </CAIS_Account>
      </INProfileResponse>
    `;

    const res = await request(app)
      .post('/api/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', Buffer.from(sampleXml), 'test.xml');

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('GET /api/reports → should return list of reports', async () => {
    await Report.create({
      basic: { firstName: 'A', lastName: 'B', mobile: '123', pan: 'ABCDE1234F' },
      summary: { totalAccounts: 1 },
      score: 700,
      accounts: [],
    });

    const res = await request(app).get('/api/reports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('GET /api/reports/:id → should return one report', async () => {
    const newReport = await Report.create({
      basic: { firstName: 'Test', lastName: 'User', mobile: '12345', pan: 'ABCDE1234F' },
      summary: { totalAccounts: 1 },
      score: 750,
      accounts: [],
    });

    const res = await request(app).get(`/api/reports/${newReport._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.basic.firstName).toBe('Test');
  });

  test('DELETE /api/reports/:id → should delete a report', async () => {
    const newReport = await Report.create({
      basic: { firstName: 'Delete', lastName: 'Me', mobile: '00000', pan: 'XYZAB1234G' },
      summary: { totalAccounts: 1 },
      score: 600,
      accounts: [],
    });

    const res = await request(app).delete(`/api/reports/${newReport._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const remaining = await Report.findById(newReport._id);
    expect(remaining).toBeNull();
  });
});
