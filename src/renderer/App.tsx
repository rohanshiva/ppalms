import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Generate from './components/Generate';
import './App.css';
import Toast from './components/Toast';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Router>
      <Toast />
    </>
  );
}
