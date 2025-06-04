import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function signup() {
        setError(null);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        
        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            });
            navigate("/signin", { state: { success: "Account created successfully! Please sign in." } });
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
                    <p className="text-gray-500 mt-2">Join our community today</p>
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
                    <div className="text-red-600 text-center text-sm mt-2 mb-2">
                        {error}
                        {error.toLowerCase().includes("exist") && (
                            <div className="mt-2">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-purple-600 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-4 pt-2">
                    <Button 
                        onClick={signup} 
                        loading={isLoading} 
                        variant="primary" 
                        text={isLoading ? "Creating account..." : "Sign Up"} 
                        fullWidth={true} 
                    />
                    
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/signin" 
                            className="text-purple-600 hover:underline font-medium"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}