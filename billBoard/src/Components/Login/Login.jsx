import React, { useState } from "react";
import './Login.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { emailValidator, passwordValidator, nameRegValidator, emailRegValidator, passwordRegValidator } from "./regexValidator";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const [response, setResponse] = useState([]);

    const navigate = useNavigate();
    const [input, setInput] = React.useState({
        email: '',
        password: '',
        regName: '',
        regEmail: '',
        regPassword: '',
        checkboxTerms: 0,
        checkboxRemember: 0
    })

    const [errorMessage, setErrorMessage] = React.useState('')

    const [errorRegMessage, setErrorRegMessage] = React.useState('')

    const handleCheckboxChange = (e) => {
        var termCheck = (input.checkboxTerms == 1 ? 0 : 1);
        setInput({ ...input, [e.target.name]: termCheck })
    }

    const handleRememberCheckboxChange = (e) => {
        var termCheck = (input.checkboxRemember == 1 ? 0 : 1);
        setInput({ ...input, [e.target.name]: termCheck })
    }

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }


    React.useEffect(() => {
        if (localStorage.getItem('auth')) { navigate('/home'); }
    }, [])

    const formLoginSubmitter = (e) => {
        e.preventDefault();
        if (!emailValidator(input.email)) {
            return setErrorMessage('Please enter valid email id.')
        }
        if (!passwordValidator(input.password)) {
            return setErrorMessage('Password should have minimum 8 character with the combination of uppercase,lowercase, numbers and specialcharacters.')
        }
        else {
            const data = {
                Email: input.email,
                Password: input.password
            }
            const url = 'https://localhost:44374/api/Login/login';
            axios.put(url, data).then((result) => {
                const res = JSON.parse(result.data) ;
                if (res[0].IsAuthorised == "true") {
                    localStorage.setItem('auth', res[0].LoginToken);
                    navigate('/home');
                }
                else {
                    setErrorMessage('Invalid email or password.');
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        }
    }


    const formRegisterSubmitter = (e) => {
        e.preventDefault();

        if (!nameRegValidator(input.regName)) {
            return setErrorRegMessage('Please enter valid name.')
        }
        if (!emailRegValidator(input.regEmail)) {
            return setErrorRegMessage('Please enter valid email id.')
        }
        if (!passwordRegValidator(input.regPassword)) {
            return setErrorRegMessage('Password should have minimum 8 character with the combination of uppercase,lowercase, numbers and specialcharacters.')
        }
        if (input.checkboxTerms == 0) {
            return setErrorRegMessage('Please accept the therm & conditions checkbox.')
        }

        else {
            const data = {
                Name: input.regName,
                Email: input.regEmail,
                Password: input.regPassword,
                IsTermsConfirm: input.checkboxTerms,
                IsActive: 1
            }
            const url = 'https://localhost:44374/api/Login/addUser';
            axios.post(url, data).then((result) => {
                if (result.data == "Successfull") {
                    setErrorMessage('');
                    setErrorRegMessage('');
                }
                else {
                    setAction(' active');
                    setErrorRegMessage('Please enter different email id.');
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        }
        if (nameRegValidator(input.regName) && emailRegValidator(input.regEmail) && passwordRegValidator(input.regPassword)) {
            setErrorMessage('');
            setErrorRegMessage('');
            setAction('');
        }
    }


    const [action, setAction] = useState('');

    const registerLink = () => {
        clearData();
        setAction(' active');
        // localStorage.setItem('reg', true);
    };

    const loginLink = () => {
        clearData();
        setAction('');
    };

    const clearData = () => {
        input.email = '';
        input.password = '';
        input.regName = '';
        input.regEmail = '';
        input.regPassword = '';
        input.checkboxTerms = 0;
        input.checkboxRemember = 0;
        setErrorMessage('');
        setErrorRegMessage('');
    }
    return (
        <div className="login">
            <div className={`wrapper${action}`}>
                <div className="form-box login">
                    <form action=""
                        onSubmit={formLoginSubmitter}
                    >
                        <h1> Login </h1>

                        <div className="input-box">
                            <input type="email" name="email" placeholder="Email"
                                value={input.email}
                                onChange={handleChange}
                            />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" name="password" placeholder="Password"
                                value={input.password}
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>

                        <div className="remember-forget">
                            <label><input type="checkbox" name="checkboxRemember"
                                onChange={handleRememberCheckboxChange} checked={input.checkboxRemember}
                            />Remeber me</label>
                            <a href="#"> Forget password ? </a>
                        </div>

                        {errorMessage.length > 0 && (<div style={{ textAlign: "center", marginBottom: "10px", marginTop: "10px", color: "red" }}>{errorMessage}</div>)}

                        <button type="submit"> Login</button>

                        <div className="register-link">
                            <p>Don't have an account? <a href="#"
                                onClick={registerLink}
                            >Register</a></p>
                        </div>

                    </form>
                </div>

                <div className="form-box register">
                    <form action=""
                        onSubmit={formRegisterSubmitter}
                    >
                        <h1> Registration </h1>

                        <div className="input-box">
                            <input type="text" name="regName" placeholder="Name"
                                value={input.regName}
                                onChange={handleChange}
                            />
                            <FaUser className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="email" name="regEmail" placeholder="Email"
                                value={input.regEmail}
                                onChange={handleChange}
                            />
                            <FaEnvelope className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="password" name="regPassword" placeholder="Password"
                                value={input.regPassword}
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>

                        <div className="remember-forget">
                            <label><input type="checkbox" name="checkboxTerms"
                                onChange={handleCheckboxChange} checked={input.checkboxTerms}
                            />I agree to the terms & conditions.</label>
                        </div>

                        {errorRegMessage.length > 0 && (<div style={{ textAlign: "center", marginBottom: "10px", marginTop: "10px", color: "red" }}>{errorRegMessage}</div>)}

                        <button type="submit"> Register </button>

                        <div className="register-link">
                            <p>Already have an account? <a href="#"
                                onClick={loginLink}
                            >Login</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;