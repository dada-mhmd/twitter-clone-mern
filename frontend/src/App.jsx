import { Routes, Route } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Home from './pages/home/Home';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='notifications' element={<NotificationPage />} />
        <Route path='profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};

export default App;
