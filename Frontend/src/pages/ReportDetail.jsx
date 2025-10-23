import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, FileText, CreditCard } from 'lucide-react';
import api from '../api/api';

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/reports/${id}`)
      .then((res) => setReport(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load report. Please try again.');
      });
  }, [id]);

  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
    );

  if (!report)
    return <p className="text-center text-gray-500 mt-10">Loading report...</p>;

  const { basic, summary, accounts = [], score } = report;

  //  Credit Card Filter (Portfolio_Type = 'R' or Account_Type 10–13)
  const creditCardAccounts = accounts.filter((a) => {
    const type = String(a.accountType || '').trim();
    const portfolio = String(a.portfolioType || '').trim().toUpperCase();
    return portfolio === 'R' || ['10', '11', '12', '13'].includes(type);
  });

  //  Loan Accounts Filter (exclude Credit Cards)
  const loanAccounts = accounts.filter((a) => {
    const type = String(a.accountType || '').trim();
    const portfolio = String(a.portfolioType || '').trim().toUpperCase();
    return portfolio !== 'R' && !['10', '11', '12', '13'].includes(type);
  });

  //  Helpers
  const getStatus = (a) => (a.currentBalance > 0 ? 'Active' : 'Closed');
  const formatCurrency = (n) =>
    n ? '₹' + Number(n).toLocaleString('en-IN') : '₹0';

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition"
        >
          <ArrowLeft size={20} />
          Back to Reports
        </Link>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-sm font-semibold">Credit Score</span>
          <h2 className="text-2xl font-bold">{score || 'N/A'}</h2>
        </div>
      </div>

      {/* Basic Details */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
          <User size={22} /> Basic Details
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
          <p>
            <span className="font-medium">Name:</span> {basic.firstName}{' '}
            {basic.lastName}
          </p>
          <p>
            <span className="font-medium">Mobile:</span> {basic.mobile}
          </p>
          <p>
            <span className="font-medium">PAN:</span> {basic.pan}
          </p>
        </div>
      </section>

      {/* Report Summary */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
          <FileText size={22} /> Report Summary
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 text-sm md:text-base">
          <SummaryItem label="Total Accounts" value={summary.totalAccounts ?? 0} />
          <SummaryItem label="Active Accounts" value={summary.activeAccounts ?? 0} />
          <SummaryItem label="Closed Accounts" value={summary.closedAccounts ?? 0} />
          <SummaryItem label="Outstanding Balance" value={formatCurrency(summary.outstandingAll)} />
          <SummaryItem label="Secured Amount" value={formatCurrency(summary.outstandingSecured)} />
          <SummaryItem label="Unsecured Amount" value={formatCurrency(summary.outstandingUnsecured)} />
          <SummaryItem label="Last 7 Days Enquiries" value={summary.last7daysEnquiries ?? 0} />
        </div>
      </section>

      {/* Credit Accounts Information */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
          <CreditCard size={22} /> Credit Accounts Information
        </div>

        {/* Credit Card Accounts */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-1">
            Credit Cards
          </h3>
          <AccountTable
            accounts={creditCardAccounts}
            getStatus={getStatus}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Loan Accounts */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-1">
            Loan Accounts
          </h3>
          <AccountTable
            accounts={loanAccounts}
            getStatus={getStatus}
            formatCurrency={formatCurrency}
          />
        </div>
      </section>
    </div>
  );
}

//  Helper to safely render holder address
function formatAddress(addr) {
  if (!addr) return '-';
  if (typeof addr === 'string') return addr;
  return [
    addr.line1,
    addr.line2,
    addr.city,
    addr.state,
    addr.postalCode,
    addr.country,
  ]
    .filter(Boolean)
    .join(', ');
}

//  Account Table
function AccountTable({ accounts, getStatus, formatCurrency }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm md:text-base">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
          <tr>
            <th className="p-3 text-left">Bank</th>
            <th className="p-3 text-left">Account No</th>
            <th className="p-3 text-left">Holder</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Balance</th>
            <th className="p-3 text-left">Overdue</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((a, i) => (
              <tr
                key={a._id || i}
                className={`${
                  i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition`}
              >
                <td className="p-3">{a.bank}</td>
                <td className="p-3">{a.accountNumber}</td>
                <td className="p-3">{a.holderName || '-'}</td>
                <td className="p-3 max-w-xs truncate">
                  {formatAddress(a.holderAddress)}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    getStatus(a) === 'Active'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {getStatus(a)}
                </td>
                <td className="p-3 font-semibold text-gray-800">
                  {formatCurrency(a.currentBalance)}
                </td>
                <td className="p-3 text-red-600 font-medium">
                  {formatCurrency(a.amountPastDue)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-gray-500 italic"
              >
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

//  Reusable summary box
function SummaryItem({ label, value }) {
  return (
    <div className="flex flex-col bg-gray-50 p-3 rounded-md border border-gray-100 hover:shadow-sm transition">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
