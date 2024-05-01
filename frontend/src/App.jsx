import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Home from './pages/home/Home';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/Spinner';

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path='/'
          element={authUser ? <Home /> : <Navigate to={'/login'} />}
        />
        <Route
          path='/register'
          element={!authUser ? <Register /> : <Navigate to={'/'} />}
        />
        <Route
          path='/login'
          element={!authUser ? <Login /> : <Navigate to={'/'} />}
        />
        <Route
          path='notifications'
          element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path='profile/:username'
          element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
        />
      </Routes>
      {authUser && <RightPanel />}

      <Toaster />
    </div>
  );
};

export default App;
