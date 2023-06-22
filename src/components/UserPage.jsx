import React, {useState, useEffect, useRef} from 'react';
import { Table, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IdleTimerProvider } from 'react-idle-timer';
import { useCookies } from 'react-cookie';
import './navbar/navbar.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_URL } from '.';
import { BarWave } from 'react-cssfx-loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logOut, updateJwtToken } from '../redux/userSlice';

const UserPage = () => {

  const [users, setUsers] = useState([]);
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const username = useSelector(state => state.user.username);
  const email = useSelector(state => state.user.email);
  const role = useSelector(state => state.user.roles);
  const jwtToken = useSelector(state => state.user.token);
  const refreshToken = useSelector(state => state.user.refreshToken);
  
  const timeout = useSelector(logOut);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Avoid double sql queries effect.
  const effectRan = useRef(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (effectRan.current === true){
    setLoading(true);
    if(role.toString()==="ROLE_ADMIN"&&"ROLE_USER"){
      setInterval( async() => {
        try {
          const res = await axios.post(`${AUTH_URL}/refreshToken`, {
            token: refreshToken
          })
          dispatch(updateJwtToken(res.data.body.token))
        } catch(err) {
          console.log(err)
        }
      }, 1000*60*10);}
    window.addEventListener("loading", () => {setLoading});}
    return () => {
      window.removeEventListener("loading", () => {setLoading})
      clearTimeout(timeOut)
      effectRan.current=true
    }
  }, [])

  function onIdle() {
    dispatch(logOut(timeout));
    setCookie('alreadyClose', 'alreadyClose', {
      maxAge: 5,
      path:"/",
      sameSite: 'strict'
    });
    navigate("/");
    window.location.reload(false);
  }

  function returnUserPage() {
    navigate("/");
  }

  const AdminView = async() => {
    setLoading(true)
    try {
      const res = await axios.get(`${AUTH_URL}/mod`, {
        headers: {Authorization: `Bearer ${jwtToken}`}
      })
      setUsers(res.data)
      if(res.data){
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch(err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      err.code.match("ERR_NETWORK") ? 
        toast.isActive("Something went wrong, try again later !", {
          autoClose: 4000,
          theme: "dark",
          type:'error'
      }) : toast(err, {
        autoClose: 4000,
        theme: "dark"
      })
    }
  }

  const Remove = async(id) => {
    setLoading(true)
    try{
      const res = await axios.delete(`${AUTH_URL}/admin/${id}`, {
        headers: {Authorization: `Bearer ${jwtToken}`}
      })
      if(!res.data || res.data){
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      let updateUsers = [...users].filter(i => i.id !== id)
      setUsers(updateUsers)
    } catch(err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      !err.code.match("ERR_NETWORK") ? 
      toast("Delete failed, SQL had unique constraint.", {
        autoClose: 4000,
        theme: "dark"
      }) : toast("Something went wrong, try again later !", {
        autoClose: 4000,
        theme: "dark",
        type:'error'
      })
    }
  }

  function highlight(e) {
    e.target.style.background = 'grey';
  }
  function mouseLeave(e) {
    e.target.style.background = '';
  }

  const userListMap = users.map(user => {
    return <tr>
      <td onMouseEnter={highlight} onMouseLeave={mouseLeave}>{user.username.toString()}</td>
      <td onMouseEnter={highlight} onMouseLeave={mouseLeave}>{user.email.toString()}</td>
      <td onMouseEnter={highlight} onMouseLeave={mouseLeave}>{Object.values(user.roles)}</td>
      <td>
        <Button size='sm' color='danger' onClick={() => Remove(user.id)}>Delete</Button>
      </td>
    </tr>
  })


  return (
    <div>
    <div className='user-details'>
      {loading ? <BarWave width="70px" height="25px"/> : <h2>User Detail</h2>}
      <div>
      {role.toString()==="ROLE_ADMIN" ? <Button size='lg' onClick={AdminView}>Control Users</Button> : null}
      <Button size="lg" color='warning' onClick={returnUserPage}>Return</Button></div>
    </div>
      <IdleTimerProvider
          timeout={1000*60*10}
          onIdle={onIdle}/>
      { role.toString()==="ROLE_ADMIN" ? (
      <Table className='table'>
        <thead>
          <tr>
            <th>User Name:</th>
            <th>Email:</th>
            <th>Role:</th>
            <th>Control:</th>
          </tr>
        </thead>
        <tbody>
          {userListMap}
        </tbody>
      </Table>
      ) : (
      <Table className='table'>
        <thead>
          <tr>
            <th>User Name:</th>
            <td width="50%">{username}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{email}</td>
          </tr>
          <tr>
            <th>Role:</th>
            <td>{role}</td>
          </tr>
        </thead>
      </Table> )}
    </div>
  )
}

export default UserPage;