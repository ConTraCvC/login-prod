import React, { useState, useEffect, useRef } from 'react';
import { RiMenu3Line, RiCloseLine} from 'react-icons/ri';
import logo from '../../assets/logo.svg'
import './navbar.css';
import { Button, Container, Label, Form, FormGroup, Input, Modal } from 'reactstrap';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AUTH_URL } from '..';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarWave } from 'react-cssfx-loading';
import { IdleTimerProvider } from 'react-idle-timer';

import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

import ReactModal from 'react-modal';
import { exit, selectResetPSToken, updateResetPSToken } from '../../redux/resetPSToken';
import { updateRole, updateUser, updateEmail, updateRefreshToken, updateJwtToken, logOut, selectUser } from '../../redux/userSlice';

const Menu = () => (
  <>
  <p><a href='#home'>Home</a></p>
  <p><a href='#wgpt3'>What is GPT3</a></p>
  <p><a href='#possibility'>Open AI</a></p>
  <p><a href='#features'>CaseStudies</a></p>
  <p><a href='#blog'>Library</a></p>
  </>
)

const customStyles = {
  content: {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};
ReactModal.setAppElement('#root');

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [ toggleMenu, setToggleMenu ] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  
  const refreshToken = useSelector(state => state.user.refreshToken);
  const user = useSelector(selectUser);
  const rsToken = useSelector(selectResetPSToken);
  const usernames = useSelector(state => state.user.username);
  const role = useSelector(state => state.user.roles);

  // Modals
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  function closeModal() {
    setIsOpen(false)
  }
  function closeModal2() {
    setIsOpen2(false)
  }
  function closeModal3() {
    setIsOpen3(false)
  }

  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&_+=()-])(?=\S+$).{8,30}$/

  // Idle timeout
  function onIdle() {
    refreshToken ? setCookie('alreadyClose', 'alreadyClose', {
      maxAge: 5,
      path:"/"
    }) : null
    dispatch(logOut(user));
    window.location.reload(false);
  }

  function resetPassword() {
    setCookie('resetPassword', 'resetPassword', {
      maxAge: 5,
      path:"/"
    });
  }

  function logoutUser() {
    dispatch(logOut(user));
    window.location.reload(false);
  }

  function close() {
    removeCookie("resetPassword")
    dispatch(exit(rsToken))
  }

  // // Avoid double sql query effect.
  const effectRan = useRef(false);
  useEffect (() => {
    setLoading(true);
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (effectRan.current===true){
    if(cookies.alreadyClose){
      setIsOpen(true)
    }
    if(cookies.newPassword){
      setIsOpen3(true)
    }
    if(cookies.enterNewPs){
      setIsOpen2(true)
    }
    window.addEventListener("loading", () => {setLoading, setIsOpen, setIsOpen2, setIsOpen3});}
    return () => {
      window.removeEventListener("loading", () => {setLoading, setIsOpen, setIsOpen2, setIsOpen3})
      clearTimeout(timeOut)
      return effectRan.current=true
    }
  }, [cookies.alreadyClose, cookies.newPassword, cookies.enterNewPs])

  // Login User
  const handleSubmit = async(event, user={username, password}) => {
    event.preventDefault();
    setLoading(true)
    try{
    const response = await axios.post(`${AUTH_URL}/sign-in`, user)
    // //
      if(response.data.body.token) {
        dispatch(updateUser(response.data?.body?.username))
        dispatch(updateEmail(response.data?.body?.email))
        dispatch(updateRole(response.data?.body?.roles))
        dispatch(updateRefreshToken(response.data?.body?.refreshToken))
        dispatch(updateJwtToken(response.data?.body?.token))
      }
      toast(response.data.body, {
        autoClose: 4000,
          theme:'dark'
      })
      if(response.data){
        setTimeout(() => {
          setLoading(false);
      }, 1000)}
    } catch (err) {
      if(err){
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      !err.code.match("ERR_NETWORK") ? 
      toast(err.response.data.errors.join(".\r\n"), {
        autoClose: 4000,
        theme: "dark",
        type:'error'
      }) : toast("Something went wrong, try again later !", {
        autoClose: 4000,
        theme: "dark",
        type:'error'
      })
      console.log(err)
    }
  }

  const handleSignUp = async(event, user={email, username, password}) => {
    event.preventDefault();
    setLoading(true)
    try {
    const response = await axios.post(`${AUTH_URL}/sign-up`, user)
    if(response.data){
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    toast(response.data.body.message, {
      autoClose: 4000,
        theme:'dark'
    })
    toast(response.data.body, {
      autoClose: 4000,
        theme:'dark'
    })
    } catch (err) {
      if(err) {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      !err.code.match("ERR_NETWORK") ? 
      toast(err.response.data.errors.join(".\r\n"), {
        autoClose: 4000,
        type:'error',
        theme:'dark'
      }) : toast("Something went wrong, try again later !", {
          autoClose: 4000,
          theme: "dark",
          type:'error'
      })
    }
  }

  const handleForgotPassword = async(event, userEmail={email}) => {
    setLoading(true)
    event.preventDefault();
    try {
      const response = await axios.post(`${AUTH_URL}/resetPassword`, userEmail)
      if (response.data){
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      if (response.data.body){
        dispatch(updateResetPSToken(response.data.body))
        setCookie('newPassword', 'newPassword', {
          maxAge: 5,
          path:"/"
        });
        setCookie('rsToken', response.data.body, {
          maxAge: 600,
          path:"/"
        })
        removeCookie("resetPassword")
      } else {
        toast("Invalid email, try again !" , {
          autoClose: 4000,
          theme: "dark"
        })
      }
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      err.code.match("ERR_NETWORK") ? (
        toast("Something went wrong, try again later !", {
          autoClose: 4000,
          theme: "dark",
          type:'error'
      })) : ( toast(err, {
        autoClose: 4000,
        theme: "dark"
      }))
    }
  }
  
  return (
    <div className='gpt3_navbar'>
      <IdleTimerProvider
          timeout={1000*60*10}
          onIdle={onIdle}/>
      <div className='gpt3_navbar-links'>
        <div className='gpt3_navbar-links_logo'>
          <img src={logo} alt="logo" />
        </div>
        <div className='gpt3_navbar-links_container'>
          <Menu />
          <Modal
            isOpen={isOpen}
            style={customStyles}
            onRequestClose={closeModal}>
            <Button onClick={closeModal} color='danger' style={{position: 'absolute', right: '0px', top:'0px'}}>&#10005;</Button>
            <h5>Good Day !!</h5>
            <h2>Your session has been close or timeout. Please login again.</h2>
          </Modal>
          <Modal
            isOpen={isOpen2}
            style={customStyles}
            onRequestClose={closeModal2}>
            <Button onClick={closeModal2} color='success' style={{position: 'absolute', right: '0px', top:'0px'}}>&#10003;</Button>
            <h5>Reset password Successfully!</h5>
            <h2>Please login again.</h2>
          </Modal>
          <Modal
            isOpen={isOpen3}
            style={customStyles}
            onRequestClose={closeModal3}>
            <Button onClick={closeModal3} color='success' style={{position: 'absolute', right: '0px', top:'0px'}}>&#10003;</Button>
            <h5>Successfully!</h5>
            <h2>Check your email box.</h2>
          </Modal>
        </div>
      </div>

      { cookies.resetPassword ? ( loading ? <BarWave width={90} height={35}/> : 
      <Form controlId="email" className='email-css'>
        <Input
        type='email'
        value={email}
        placeholder='&#x1F4E7; Your Register Email.'
        onChange={(e) => setEmail(e.target.value)}
        style={{width: '19rem'}}/>
        <Button color='success' ref={Node} type="submit" onClick={handleForgotPassword} style={{width: '70%'}}>Reset password mail</Button>
        <Button color='danger' onClick={close} style={{width: '30%'}}>Exit</Button>
      </Form>) : (
      <div className="tool-bar">
        {!refreshToken && !loading ?
        <Container fluid><Link to='/' onClick={resetPassword} >Forgot Password?</Link></Container> :
        refreshToken ? null : <Container><BarWave width={60} height={30}/></Container>}

          { refreshToken ? (
            <>
            <a href='/userDetails' style={{fontSize: "18px" }} color='#ff7000'>
            {loading ? <Container><BarWave width={90} height={30}/></Container> : <Container>{role.toString()==="ROLE_ADMIN" ? ("Welcome * admin. ") :
            (`Welcome * ${usernames}. `)}</Container>}</a>
            <Button size="lg" color='danger' onClick={logoutUser}>LogOut</Button>
            </>
          ) : (
          <div style={{display:"flex"}}>
          <Popup contentStyle={{width: "16rem"}} trigger={<div><Button color='success' id='login'> Login</Button></div>} position="bottom center">
            <Form>
            <FormGroup controlId="username">
              <Label>Username:</Label>
              <Input
                placeholder="&#x1F464; Username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
              </FormGroup>
            <FormGroup controlId="password">
              <Label>Password:</Label>
              <Input
                placeholder="&#x1F512; Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              <hr></hr>
              <Button size="lg" block="true" color='success' onClick={handleSubmit}
                ref={Node} type="submit">Login</Button>
            </FormGroup>
            </Form>
          </Popup>
          <Container fluid>
            <Popup modal contentStyle={{width: "30rem"}} trigger={<div><Button color='primary'>SignUp</Button></div>} position="bottom right">
              <Form>
                <FormGroup controlId="email">
                  <Label>Email:</Label>
                  <Input
                    placeholder="&#x1F4E7; Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                </FormGroup>
                <FormGroup controlId="username">
                  <Label>Username:</Label>
                  <Input
                    placeholder="&#x1F464; Username"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                </FormGroup>
                <FormGroup controlId="password">
                  <Label>Password content must have at least 8 character, one special character, one Captcha and not allow white-space. Max out 40 character.</Label>
                  <Input
                    placeholder="&#x1F512; Password"
                    type="password"
                    value={password}
                    valid={Object.keys(password).length>8 && password.match(regex)}
                    invalid={!password.match(regex)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup controlId="password">
                  <Input
                    placeholder="&#x1F512; Confirm new password"
                    type="password"
                    value={confirmPassword}
                    valid={Object.keys(confirmPassword).length>8 && password.match(regex)}
                    invalid={password!==confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <hr></hr>
                  {(password===confirmPassword) ?
                  <Button size="lg" block="true" color='success' onClick={handleSignUp}>
                    SignUp</Button> : "Confirm password does not match ! "}
                </FormGroup>
              </Form>
            </Popup>
          </Container>
        </div>
      )}
      </div>
      )}

      <div className='gpt3_navbar-menu'>
        {loading ? null : toggleMenu
          ? <RiCloseLine color='#fff' size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color='#fff' size={27} onClick={() => setToggleMenu(true)} />
        }
        {toggleMenu && (
          <div className='gpt3_navbar-menu_container scale-up-center'>
              <Menu />
              {/* <div className='gpt3_navbar-menu_container-links-sign'>
              <Container fluid>
              <Popup trigger={<div><Button size="lg" block="true" color='success'>
                Login</Button></div>} position="left right">
          <Form>
          <FormGroup controlId="username">
          <Label>Username</Label>
          <Input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button block="true" color='success' size="lg" type="submit" onClick={handleSubmit} ref={Node}>
          Login
        </Button>
        <hr></hr>
        <p><a href='#possibility'>Forgot password: Click here!</a></p>
          </Form>
      </Popup>
      </Container>
        <Container fluid>
          <hr></hr>
          <Popup trigger={<div><Button size='lg' color='success'> SignUp</Button></div>} position="left right">
          <Form>
          <FormGroup controlId="email">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
          <FormGroup controlId="username">
          <Label>Username</Label>
          <Input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <hr></hr>
          <Button size="lg" block="true" color='success' onClick={handleSignUp}>
            SignUp</Button>
        </FormGroup>
          </Form>
      </Popup> 
        </Container>
        </div> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar