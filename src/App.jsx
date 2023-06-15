import React from 'react';
import './App.css';
import { Footer, Blog, Possibility, Features, GPT3, Header } from './containers';
import { CTA, Brand, Navbar, UserPage } from './components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { withCookies } from "react-cookie";
import EnterNewPassword from './containers/header/EnterNewPassword';
import { useSelector } from 'react-redux';
import { selectResetPSToken } from './redux/resetPSToken';

const Protected = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
 };

const App = () => {

  const rsToken = useSelector(selectResetPSToken);
  const refreshToken = useSelector(state => state.user.refreshToken);

  return (
    <div className='App'>
      <div className='gradient_bg'>
        <Routes>
          <Route index element={<Navbar/> }/>
          <Route exact path="auth/savePassword" element={<Protected isLoggedIn={rsToken && Object.values(rsToken).length!==0}><EnterNewPassword/> </Protected>}/>
          <Route exact path="/userDetails" element={<Protected isLoggedIn={refreshToken}><UserPage/> </Protected>}/>
        </Routes>
        <Header/>
        <Brand />
        <GPT3 />
        <Features />
        <Possibility />
        <CTA />
        <Blog />
        <Footer />
      </div>
    </div>
  )
}

export default withCookies(App);