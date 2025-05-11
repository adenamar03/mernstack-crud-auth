import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

function Display() {
    const [mydata, setData] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        const token = localStorage.getItem('token');
        axios.get("http://localhost:5000/display", {
            headers: {
                Authorization: `Bearer ${token}` // ✅ Correct format
            }
        })
        .then(res => {
            console.log(res.data);
            setData(res.data.mydata);
        }).catch((error) => {
            alert("Error Occurred: " + (error.response?.data?.msg || error.message));
            console.log(error);
        });
    };

    const deleteData = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:5000/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // ✅ Correct format
            }
        })
        .then((res) => {
            alert(res.data.msg);
            getData(); // Refresh
        }).catch((error) => {
            alert("Error Occurred: " + (error.response?.data?.msg || error.message));
            console.log(error);
        });
    };

    return (
        <>
            <h3>Display</h3>
            <table border='1'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {mydata && mydata.length ? (
                        mydata.map((values, i) => (
                            <tr key={values._id}>
                                <td>{i + 1}</td>
                                <td>{values.name}</td>
                                <td>{values.mobile}</td>
                                <td>{values.email}</td>
                                <td>
                                    <Link to={'/Edit/' + values._id}>Edit</Link> | 
                                    <input type='button' onClick={() => deleteData(values._id)} value='X' />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No Record Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default Display;
