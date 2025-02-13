import { useState } from 'react';
import Link from 'next/link';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(false);

    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 w-full overflow-hidden">
            {/* Form Container */}
            <div className="relative bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
                {/* Left Side - Branding and Toggle Button */}
                <div className="bg-blue-500 text-white p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-center items-center w-full md:w-1/3 text-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">iCopify</h1>
                        <p className="mb-8">Never Pay Until You're 100% Satisfied - Increasing traffic, leads and sales.</p>
                    </div>
                    <div>
                        <p className="mb-4">{isLogin ? "Don't have an account?" : "Have an account?"}</p>
                        <button onClick={toggleForm} className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-blue-500 transition-colors">
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="relative p-8 w-full md:w-2/3 flex flex-col justify-center h-full max-w-md mx-auto overflow-hidden">
                    {/* Circle Backgrounds inside White Form Section */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 border-4 border-blue-400 rounded-full opacity-70 z-0"></div>
                    <div className="absolute -bottom-10 -left-10 h-24 w-24 border-4 border-blue-300 rounded-full opacity-70 z-0"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4 text-center">{isLogin ? "Log In" : "Create New Account"}</h2>
                        <form>
                            {!isLogin && (
                                <div className="mb-4">
                                    <input className="w-full p-3 border rounded" placeholder="Name" type="text" required />
                                </div>
                            )}
                            <div className="mb-4">
                                <input className="w-full p-3 border rounded" placeholder="Email address" type="email" required />
                            </div>
                            <div className="mb-4">
                                <input className="w-full p-3 border rounded pr-10" placeholder="Enter your password" type="password" required />
                            </div>
                            {!isLogin && (
                                <div className="flex items-start mb-4">
                                    <input className="mr-2 mt-1" type="checkbox" required />
                                    <p className="text-sm">
                                        By creating an account, you agree to the iCopify
                                        <Link className="text-blue-500" href="#"> Terms of Service</Link>
                                        and to occasionally receive marketing emails from us. Please read our
                                        <Link className="text-blue-500" href="#"> Privacy Policy</Link>
                                        to learn how we use your personal data.
                                    </p>
                                </div>
                            )}
                            {isLogin && (
                                <div className="mb-4 text-sm flex justify-between items-center">
                                    <label className="flex items-center">
                                        <input className="mr-2" type="checkbox" />
                                        Remember me
                                    </label>
                                    <Link className="text-blue-500" href="#">Forgot Password?</Link>
                                </div>
                            )}
                            <button className="w-full bg-blue-500 text-white py-3 rounded mb-4 hover:bg-blue-600 transition-colors" type="submit">
                                {isLogin ? "Log In" : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
