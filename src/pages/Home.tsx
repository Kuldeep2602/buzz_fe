import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-center items-center p-4">


<div className="mt-16 flex justify-center space-x-8 opacity-60">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-1000"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-2000"></div>
          </div>
          
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                        Buzz
                    </span>
                </h1>
                <p className="text-gray-600 mb-2">Your social media platform for connecting saving and sharing moments</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/signup"
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                    Create Account
                </Link>
                <Link
                    to="/signin"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
}



