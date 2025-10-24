import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Search, Trash2, Eye } from 'lucide-react';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/reports');
        setReports(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch reports');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
      alert('Report deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete report');
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      `${r.basic.firstName} ${r.basic.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.basic.pan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Uploaded Reports</h2>

        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-72">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name or PAN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">PAN</th>
              <th className="p-3 font-medium">Credit Score</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <p className="text-gray-500 mt-3 text-sm">Fetching reports...</p>
                  </div>
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((r, i) => (
                <tr
                  key={r._id}
                  className={`${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {r.basic.firstName} {r.basic.lastName}
                  </td>
                  <td className="p-3 text-gray-700">{r.basic.pan}</td>
                  <td className="p-3 text-gray-800 font-semibold">{r.score}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <Link
                      to={`/report/${r._id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="View Report"
                    >
                      <Eye size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Report"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
