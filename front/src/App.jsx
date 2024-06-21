import { Outlet, Navigate } from 'react-router-dom';

import Header from './common/Header/Header';

import './App.css';

function App() {
  const url = window.location.href;
  const checkUrl = url === `${window.location.protocol}//${window.location.host}/NSM/`;
  return (
    <>
      <Header />
      <Outlet />
      { checkUrl && <Navigate to="/NSM/board" replace={true} /> }
    </>
  )
}

export default App;
