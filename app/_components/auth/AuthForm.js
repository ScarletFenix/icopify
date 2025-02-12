import { useState } from 'react';
import Link from 'next/link';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(false);

    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
                <div className="bg-blue-500 text-white p-8 rounded-l-lg flex flex-col justify-between w-1/4">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">iCopify</h1>
                        <p className="mb-8">Never Pay Until You're 100% Satisfied - Increasing traffic, leads and sales.</p>
                    </div>
                    <div>
                        <p className="mb-4">{isLogin ? "Don't have an account?" : "Have an account?"}</p>
                        <button onClick={toggleForm} className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-blue-500 transition-colors">
                            {isLogin ? "Sign Up" : "Log in"}
                        </button>
                    </div>
                </div>
                <div className="p-8 w-3/4 flex flex-col justify-center h-full">
                    <h2 className="text-3xl font-bold mb-4">{isLogin ? "Log in" : "Create New Account"}</h2>
                    <form>
                        <div className="mb-4">
                            <input className="w-full p-3 border rounded" placeholder="Email address Or Username" type="text" required />
                        </div>
                        <div className="mb-4">
                            <input className="w-full p-3 border rounded pr-10" placeholder="Enter your password" type="password" required />
                        </div>
                        {!isLogin && (
                            <div className="mb-4">
                                <input className="w-full p-3 border rounded" placeholder="Name" type="text" required />
                            </div>
                        )}
                        <button className="w-full bg-blue-500 text-white py-3 rounded mb-4 hover:bg-blue-600 transition-colors" type="submit">
                            {isLogin ? "Log in" : "Create An Account"}
                        </button>
                        {!isLogin && (
                            <div className="flex items-start">
                                <input className="mr-2 mt-1" type="checkbox" required />
                                <p className="text-sm">
                                    By creating an account, you agree to the iCopify
                                    <Link className="text-blue-500" href="#">Terms of Service</Link>
                                    and to occasionally receive marketing emails from us. Please read our
                                    <Link className="text-blue-500" href="#">Privacy Policy</Link>
                                    to learn how we use your personal data.
                                </p>
                            </div>
                        )}
                    {isLogin && (<div className="flex justify-between items-center mb-4">
    <label className="flex items-center">
        <input className="mr-2" type="checkbox" />
        Remember me
    </label>
    <Link className="text-blue-500" href="#">Forgot Password?</Link>
</div>)}
</form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
