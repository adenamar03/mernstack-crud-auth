import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    const submitValue = (event) => {
        event.preventDefault(); // Moved to top to prevent form default before anything
        axios.post('http://127.0.0.1:5000/register', { name, mobile, email, password })
            .then(res => {
                console.log(res);
                if (res.data.flag === 1) {
                    // Store the token and user info in localStorage
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("username", res.data.mydata.name);
                    localStorage.setItem("is_login", true);
                    alert('Registration successful');
                    navigate('/Display'); // Redirect after success
                } else {
                    alert('Something went wrong');
                }
            })
            .catch((error) => {
                alert("Error Occurred: " + error);
                console.log(error);
            });

        // Reset form fields
        setName("");
        setMobile("");
        setEmail("");
        setPassword("");
    }

    return (
        <>
            <h3>Register</h3>
            <form onSubmit={submitValue}>
                Name: <input type="text" value={name} onChange={e => setName(e.target.value)} /> <br />
                Mobile: <input type="number" value={mobile} onChange={e => setMobile(e.target.value)} /><br />
                Email: <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
                <input type="submit" />
            </form>
        </>
    );
}

export default Register;
