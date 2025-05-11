import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkData();
    fetchData(); // ✅ Call API on mount
  }, []);

  const checkData = () => {
    if (localStorage.getItem('is_login')) {
      setName(localStorage.getItem('username'));
    } else {
      alert('Login is required');
      navigate('/Login');
    }
  };

  const fetchData = () => {
    const token = localStorage.getItem('token'); // ✅ get token from localStorage

    axios.get('http://localhost:4000/display', {
      headers: {
        Authorization: `Bearer ${token}`,// ✅ pass token in headers
      }
    })
    .then(res => {
      if (res.data.flag === 1) {
        setUserData(res.data.mydata);
      } else {
        alert('Unauthorized or No Data Found');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching data');
    });
  };

  const logoutData = () => {
    localStorage.clear();
    navigate('/Login');
  };

  return (
    <>
      <h1>Hi {name}</h1>
      <input type='button' onClick={logoutData} value='Logout' />

      <h3>All Users:</h3>
      <ul>
        {userData.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </>
  );
}

export default Home;
