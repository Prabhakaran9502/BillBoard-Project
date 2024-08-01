



import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate=useNavigate();
    const[logout,setLogout] = React.useState(false);

    React.useEffect(()=>{
        if(!localStorage.getItem('auth'))
            {
                navigate("/login");
            }
    },[logout]);

    const logoutHandler = (e) =>{
        e.preventDefault();
        localStorage.removeItem("auth");
        setLogout(true);
    }
    return (
        <div className="dashboard" style={{backgroundColor:"red",Width:"100%"}}>
            <div className="form-box">
            Dashboard 
            <p>
                <button onClick={logoutHandler}>Logout</button>
            </p>
            </div>
        </div>
    );
};

export default Dashboard;