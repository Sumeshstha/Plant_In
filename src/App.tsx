import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Garden from './pages/Garden';
import SearchPage from './pages/SearchPage';
import Tools from './pages/Tools';
import Scan from './pages/Scan';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import PlantProfile from './pages/PlantProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import RoomPlanner from './pages/RoomPlanner';
import ExpertChat from './pages/ExpertChat';
import ProfileEdit from './pages/ProfileEdit';
import AccountSecurity from './pages/AccountSecurity';
import ForgotPassword from './pages/ForgotPassword';
import Notifications from './pages/Notifications';
import AddPlant from './pages/AddPlant';
import WateringCalculator from './pages/WateringCalculator';
import CareCalendar from './pages/CareCalendar';
import RepottingChecker from './pages/RepottingChecker';
import SpaceProfile from './pages/SpaceProfile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plant/:id" element={<PlantProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/room-planner" element={<RoomPlanner />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/security" element={<AccountSecurity />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/add-plant" element={<AddPlant />} />
          <Route path="/space/:id" element={<SpaceProfile />} />
          <Route path="/tools/watering" element={<WateringCalculator />} />
          <Route path="/tools/calendar" element={<CareCalendar />} />
          <Route path="/tools/repotting" element={<RepottingChecker />} />
        </Route>
        <Route path="/scan" element={<Scan />} />
        <Route path="/chat" element={<ExpertChat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </Router>
  );
}
