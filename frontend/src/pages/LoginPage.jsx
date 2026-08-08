import { useState } from "react";
import { Signin } from "../components/LoginPageComponents/Signin";
import { OAuthOptions } from "../components/LoginPageComponents/OAuthOptions";
import { Signup } from "../components/LoginPageComponents/Signup";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { signinCredsValidator } from "../components/LoginPageComponents/utils";

export default function LoginPage() {
    const navigate = useNavigate();
    const [wantToLogin, setWantToLogin] = useState(true);
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [userData, setUserData] = useState({});

    const [loginFailed, setLoginFailed] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('Server error, try again later');

    const toggleWantToLogin = () => {
        setWantToLogin(!wantToLogin);
        setLoginFailed(false);
    }

    const handleLogin = async (e, creds) => {
        e?.preventDefault();
        
        if (!signinCredsValidator(creds, setLoginFailed, setLoginErrorMessage)) {
            throw new Error('Error in credentials')
        }

        try {
            const response = await axios.post(`${AUTH_API_URL}/signin`, creds);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                if (data.status_code == 'success') {
                    localStorage.setItem('xen_access_token', data.access_token);
                    localStorage.setItem('xen_refresh_token', data.refresh_token);
                    setUserData(data.user);
                    navigate('/');
                }
            } else {
                throw new Error('login failed');
            }
        } catch (error) {
            setLoginFailed(true);
            setLoginErrorMessage(error.response.data.detail);
            console.log(loginErrorMessage)
            console.error('Error singing in:', error)
        }
    };        


    return (
        <div className="h-screen w-screen flex items-center justify-center " style={{ "backgroundColor": "rgb(60,-250,-250)" }}>
            <div className="flex flex-row items-center pl-5 pr-5 w-[60vw] h-[80vh] bg-white rounded-xl">

                <div className="w-[50%] h-full flex flex-col items-center justify-center p-4 pt-0">

                    {wantToLogin ? (
                        <Signin handleLogin={handleLogin} loginFailed={loginFailed} loginErrorMessage={loginErrorMessage} />
                    ) : (
                        <Signup AUTH_API_URL={AUTH_API_URL} setUserData={setUserData} handleLogin={handleLogin} loginFailed={loginFailed} setLoginFailed={setLoginFailed} loginErrorMessage={loginErrorMessage} setLoginErrorMessage={setLoginErrorMessage}/>
                    )}

                    <p className="mt-4">
                        {wantToLogin ? "New User? " : "Already Registered? "}
                        <button
                            onClick={toggleWantToLogin}
                            className="text-blue-700 cursor-pointer hover:underline"
                        >{wantToLogin ? "Sign Up" : "Sign In"}</button>
                    </p>
                    <OAuthOptions />
                </div>

                <div className="h-[95%] w-[50%]">
                    <img src="/login-bg1.jpg" className="rounded-xl h-full w-full" />
                </div>

            </div>
        </div>
    );
}