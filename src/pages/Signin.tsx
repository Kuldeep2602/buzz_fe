import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface SigninProps {
    onLogin?: () => void;
}

export function Signin({ onLogin }: SigninProps) {
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    async function signin() {
        setError(null);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }
        
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
                username,
                password
            });
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            if (onLogin) {
                onLogin();
            }
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Signin error:", err);
            setError(err.response?.data?.message || "Failed to sign in. Please try again.");
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>
                
                <Input 
                    reference={usernameRef} 
                    placeholder="Username" 
                    className="mb-4"
                />
                <Input 
                    reference={passwordRef} 
                    placeholder="Password" 
                    type="password"
                    className="mb-2"
                />
                
                {error && (
                    <div className="text-red-600 text-center text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4 pt-4">
                    <Button 
                        onClick={signin} 
                        loading={false} 
                        variant="primary" 
                        text="Sign In" 
                        fullWidth={true} 
                    />
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            className="text-purple-600 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
