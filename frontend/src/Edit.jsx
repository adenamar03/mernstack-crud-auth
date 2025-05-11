import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Edit() {
    const [name, setName] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    let { id } = useParams();

    React.useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/edit/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // ✅ Fixed
            }
        })
        .then(res => {
            const data = res.data.mydata;
            setName(data.name);
            setMobile(data.mobile);
            setEmail(data.email);
            setPassword(data.password);
        })
        .catch((error) => {
            alert("Error Occurred: " + (error.response?.data?.msg || error.message));
            console.log(error);
        });
    };

    const submitValue = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/update/${id}`, 
            { name, mobile, email, password },
            {
                headers: {
                    Authorization: `Bearer ${token}` // ✅ Fixed
                }
            }
        )
        .then(res => {
            if (res.data.flag === 1) {
                alert('Record Updated Successfully');
                navigate('/Display');
            } else {
                alert('Something went wrong');
            }
        })
        .catch(err => {
            alert("Error: " + (err.response?.data?.msg || err.message));
            console.log(err);
        });
    };

    return (
        <>
            <h3>Edit</h3>
            <form onSubmit={submitValue}>
                Name : <input type="text" value={name} onChange={e => setName(e.target.value)} /> <br/>
                Mobile : <input type="number" value={mobile} onChange={e => setMobile(e.target.value)} /><br/>
                Email : <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br/>
                Password : <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
                <input type="submit" />
            </form>
        </>
    );
}

export default Edit;
