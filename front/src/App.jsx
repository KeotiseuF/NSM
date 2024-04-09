import { Outlet, Navigate } from 'react-router-dom';

import Header from './common/Header/Header';

import './App.css';

function App() {
  const url = window.location.pathname;
  const checkUrl = url === '/';

  return (
    <>
      <Header />
      <Outlet />
      { checkUrl && <Navigate to="/home" replace={true} /> }
    </>
  )
}

export default App;
