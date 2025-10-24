import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' | 'error' | ''
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus('');
        setStatusType('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setFile(selectedFile);
      setStatus('');
    } else {
      setStatus('Please upload a valid XML file.');
      setStatusType('error');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.xml')) {
      setFile(droppedFile);
      setStatus('');
    } else {
      setStatus('Please upload a valid XML file.');
      setStatusType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('Please select a file first.');

    const form = new FormData();
    form.append('file', file);

    try {
      setIsUploading(true);
      setProgress(10);
      setStatus('');
      setStatusType('');

      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });

      setProgress(100);
      setStatus('File uploaded successfully!');
      setStatusType('success');
      setFile(null);

      // Redirect to Reports List after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed. Please try again.');
      setStatusType('error');
      setProgress(0);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 1200);
    }
  };

  return (
    <div className="font-sans max-w-lg mx-auto mt-10 bg-white shadow-lg border border-gray-200 rounded-2xl p-8 text-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Upload XML Report</h2>
      <p className="text-gray-500 text-sm">
        Upload your Experian credit report (.xml) to generate insights
      </p>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {isUploading ? (
          <Loader2 size={36} className="text-blue-600 animate-spin" />
        ) : (
          <UploadCloud size={40} className="text-blue-600" />
        )}
        <p className="text-gray-700 font-medium">
          {isDragging ? 'Drop your file here' : 'Drag & Drop XML here or click to browse'}
        </p>
        <input
          type="file"
          accept=".xml"
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition text-sm font-medium cursor-pointer"
        >
          Choose File
        </label>
      </div>

      {/* File Preview */}
      {file && (
        <div className="bg-gray-50 border border-gray-200 rounded-md py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <FileText size={18} className="text-blue-600" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          !file || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Report'}
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
          <div
            className={`h-2 transition-all duration-500 ${
              statusType === 'error' ? 'bg-red-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Feedback Message */}
      {status && (
        <div
          className={`flex items-center justify-center gap-2 mt-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            statusType === 'success'
              ? 'text-green-700 bg-green-50 border border-green-200'
              : statusType === 'error'
              ? 'text-red-700 bg-red-50 border border-red-200'
              : 'text-gray-700'
          }`}
        >
          {statusType === 'success' && <CheckCircle size={18} className="text-green-600" />}
          {statusType === 'error' && <AlertCircle size={18} className="text-red-600" />}
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}
