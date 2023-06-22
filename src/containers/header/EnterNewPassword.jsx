import React, {useState, useEffect} from 'react';
import '../../components/navbar/navbar.css';
import { Input, Button, Label, Form, FormGroup } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { AUTH_URL } from '../../components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarWave } from 'react-cssfx-loading';

import { useDispatch, useSelector } from 'react-redux';
import { exit, selectResetPSToken } from '../../redux/resetPSToken';

const EnterNewPassword = () => {

  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const rsToken = useSelector(selectResetPSToken);
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&_+=()-])(?=\S+$).{8,30}$/

  let navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 1000);
    window.addEventListener("loading", () => {setLoading})
    return () => {
      window.removeEventListener("loading", () => {setLoading})
      clearTimeout(timeOut)
    }
  }, [])

  function close() {
    dispatch(exit(rsToken))
    navigate('/')
  }

  const HandleNewPassword = async(event, password={newPassword}) => {
    setLoading(true)
    event.preventDefault();
    try{
      const response = await axios.post(`${AUTH_URL}/savePassword`, password, {
        params: {
          token: cookies.rsToken
        }
      })
      if(response.data){
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      if(response.data.match("Invalid Token")){
        toast("Your session is timeout, please try again!", {
          autoClose: 4000,
          theme: "dark"
        })
      }
      if(response.data.match("Password does not match wellFormed !")){
        toast("Password does not match wellFormed !", {
          autoClose: 4000,
          theme: "dark"
        })
      }
      if(response.data.match("Password Reset Successfully")){
        navigate('/')
        dispatch(exit(rsToken))
        setCookie('enterNewPs', 'enterNewPs', {
          maxAge: 5,
          path:"/",
          sameSite: 'strict'
        });
        removeCookie('rsToken')
      }
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      err.code.match("ERR_NETWORK") ?
        toast("Something went wrong, try again later !", {
          autoClose: 4000,
          theme: "dark",
          type:'error'
      }) : toast(err, {
        autoClose: 4000,
        theme: "dark"
      })
    }
  }

  return(
    <div className='gpt3_navbar-ps'>
      <div className='reset-password'>
      <Form>
        <FormGroup>
          {loading ? ( <Label><BarWave width="70px" height="25px"/>.</Label> ) : (
          <Label className='label'>Password content must have at least 8 character, one special character, one Captcha and not allow white-space. Max out 40 character.</Label>)}
          <Input
          type='password'
          value={newPassword}
          placeholder='&#x1F512; Enter new password here.'
          valid={Object.keys(newPassword).length>8 && newPassword.match(regex)}
          invalid={!newPassword.match(regex)}
          style={{width: '23rem'}}
          onChange={(e) => setNewPassword(e.target.value)}/>
        </FormGroup>
        <FormGroup>
          <Input
          type='password'
          value={confirmPassword}
          valid={Object.keys(confirmPassword).length>8 && confirmPassword.match(regex)}
          invalid={newPassword!==confirmPassword}
          placeholder='&#x1F512; Confirm new password.'
          style={{width: '23rem'}}
          onChange={(e) => setConfirmPassword(e.target.value)}/>
          <hr></hr>
          { (newPassword===confirmPassword) ?
          (<Button color='success' ref={Node} type="submit" onClick={HandleNewPassword} style={{ width: '70%' }}>
            Reset Password</Button>) : "Confirm password does not match ! "}
          <Button color='danger' onClick={close} style={{ width: '30%' }}>Exit</Button>
        </FormGroup>
      </Form>
      </div>
    </div>
  )
}

export default EnterNewPassword