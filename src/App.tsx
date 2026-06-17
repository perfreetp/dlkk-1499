import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import Materials from '@/pages/Materials';
import Apply from '@/pages/Apply';
import Progress from '@/pages/Progress';
import Result from '@/pages/Result';
import Receipt from '@/pages/Receipt';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/result" element={<Result />} />
          <Route path="/receipt" element={<Receipt />} />
        </Routes>
      </Layout>
    </Router>
  );
}
