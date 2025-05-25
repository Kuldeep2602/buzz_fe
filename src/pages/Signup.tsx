import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    async function signup() {
        setError(null);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            })
            alert("You have signed up!");
            navigate("/signin");
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Signup failed. Please try again.");
            }
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
                </div>
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
            {error && (
                <div className="text-red-600 text-center text-sm mt-2 mb-2">
                    {error}
                    {error.toLowerCase().includes("exist") && (
                        <div className="mt-2">
                            Already have an account?{' '}
                            <a href="/signin" className="text-purple-600 hover:underline">Sign in</a>
                        </div>
                    )}
                </div>
            )}
            <div className="flex flex-col gap-4 pt-4">
                <Button onClick={signup} loading={false} variant="primary" text="Sign Up" fullWidth={true} />
                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a 
                        href="/signin" 
                        className="text-purple-600 hover:underline font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/signin');
                        }}
                    >
                        Sign In
                    </a>
                </div>
                </div>
            </div>
        </div>
    )
}