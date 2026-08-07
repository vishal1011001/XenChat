import { useState } from "react";
import { Signin } from "../components/LoginPageComponents/Signin";
import { OAuthOptions } from "../components/LoginPageComponents/OAuthOptions";
import { Signup } from "../components/LoginPageComponents/Signup";
import axios from "axios";

export default function LoginPage() {
    const [wantToLogin, setWantToLogin] = useState(true);
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [userData, setUserData] = useState({});

    const toggleWantToLogin = () => {
        setWantToLogin(!wantToLogin);
    }

    const handleLogin = async (e, creds) => {
        e?.preventDefault();
        try {
            const response = await axios.post(`${AUTH_API_URL}/signin`, creds);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                if (data.status == 'success') {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    setUserData(data.user);
                }
            }
        } catch (error) {
            console.error('Error singing in:', error)
        }
    };


    return (
        <div className="h-screen w-screen flex items-center justify-center bg-linear-90 from-stone-700 to-stone-600">
            <div className="flex flex-row items-center pl-5 pr-5 w-[60vw] h-[80vh] bg-white rounded-xl">
                <div className="w-[50%] h-full flex flex-col items-center justify-center p-4 pt-0">
                    
                    {wantToLogin ? (
                        <Signin handleLogin={handleLogin} />
                    ) : (
                        <Signup API_URL={AUTH_API_URL} setUserData={setUserData} />
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