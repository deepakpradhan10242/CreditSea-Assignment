import { useState } from 'react';
import api from '../api/api';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setFile(selectedFile);
      setStatus('');
    } else {
      setStatus('❌ Please upload a valid XML file.');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.xml')) {
      setFile(droppedFile);
      setStatus('');
    } else {
      setStatus('❌ Please upload a valid XML file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('❌ Please select a file first.');

    const form = new FormData();
    form.append('file', file);

    try {
      setProgress(30);
      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });
      setProgress(100);
      setStatus('✅ File uploaded successfully!');
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed. Try again.');
      setProgress(0);
    }
  };

  return (
    <div className="font-sans max-w-lg mx-auto mt-10 bg-white shadow-lg border border-gray-200 rounded-2xl p-8 text-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Upload XML Report</h2>
      <p className="text-gray-500 text-sm">Upload your Experian credit report (.xml) to generate insights</p>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <UploadCloud size={40} className="text-blue-600" />
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
        disabled={!file}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          file ? 'bg-blue-600 hover:bg-blue-700 shadow' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Upload Report
      </button>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Status Message */}
      {status && (
        <div
          className={`flex items-center justify-center gap-2 mt-3 text-sm font-medium ${
            status.startsWith('✅')
              ? 'text-green-600'
              : status.startsWith('❌')
              ? 'text-red-600'
              : 'text-gray-700'
          }`}
        >
          {status.startsWith('✅') ? (
            <CheckCircle size={18} />
          ) : status.startsWith('❌') ? (
            <AlertCircle size={18} />
          ) : null}
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}
