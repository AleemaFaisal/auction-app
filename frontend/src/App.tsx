import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import SpecificAuction from './pages/specific-auction';
import Landing from './pages/landing';
import Profile from './pages/profile';
import Browse from './pages/browse';
import CreateAuction from './pages/createauction';

function App() {
  const user = useSelector((state : RootState) => state.user.username);
  console.log("user:", user);

  return (
    <Routes>
      <Route index path='/' element={ user!=="" ? <Navigate to='/home' /> : <Navigate to='/signup' /> } />
      <Route path='/signup' element={ user!=="" ? <Navigate to='/home' /> : <Signup />} />
      <Route path='/login'  element={ user!=="" ? <Navigate to='/home' /> : <Login />} />
      <Route path='/home' element={ user!=="" ? <Landing /> :  <Navigate to='/signup' />} />
      <Route path='/profile' element={ user!=="" ? <Profile /> : <Navigate to='/signup' />}  />
      <Route path='/browse' element={ user!=="" ? <Browse /> : <Navigate to='/signup' /> } />
      <Route path='/create-auction' element={ user!=="" ? <CreateAuction /> : <Navigate to='/signup' /> } />
      <Route path='/specific-auction' element={user!=="" ? <SpecificAuction /> : <Navigate to='/signup' />} />
    </Routes>
  );
}

export default App;
