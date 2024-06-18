import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import AboutUs from './AboutUs';
import WorkWithUs from './WorkWithUs';
import Shop from './Shop';
import Footer from './Footer';
import UserProfile from './UserProfile';
import Error from './Error';
import ContactForm from './ContactForm';
import Admin from "./Admin";
import './App.css';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="App">
      <div className="background">
        <div className="stars-container"></div>
      </div>
      {location.pathname !== '/profile' && <Header />}
      <Routes>
        <Route path="/" element={<><MainContent /><AboutUs /><WorkWithUs /><Shop /><ContactForm /><Footer /></>} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
