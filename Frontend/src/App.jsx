import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import ReportList from './pages/ReportList';
import ReportDetail from './pages/ReportDetail';
import Upload from './pages/Upload';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<ReportList />} />
          <Route path="/report/:id" element={<ReportDetail />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
