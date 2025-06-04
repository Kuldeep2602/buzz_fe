import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/Button";

export function Home() {
    const location = useLocation();
    const successMessage = location.state?.success;

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                // Clear the success message from location state
                window.history.replaceState({}, document.title);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Buzz</h1>
                        <p className="text-gray-600 mb-2">Your social media platform for connecting, saving, and sharing moments</p>
                        <p className="text-gray-500 text-sm mb-8">Connect with your community in real-time</p>
                        
                        <div className="space-y-4">
                            <Link to="/signup" className="block">
                                <Button 
                                    variant="primary" 
                                    text="Create Account" 
                                    fullWidth={true}
                                />
                            </Link>
                            
                            <div className="relative flex items-center my-6">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            
                            <Link to="/signin" className="block">
                                <Button 
                                    variant="secondary" 
                                    text="Sign In" 
                                    fullWidth={true}
                                />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Buzz. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}



