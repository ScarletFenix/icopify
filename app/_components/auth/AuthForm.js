"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [touched, setTouched] = useState({ name: false, email: false, password: false });

    // Email Validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password Validation: Min 6 chars, 1 uppercase, 1 special character
    const validatePassword = (pass) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        return passwordRegex.test(pass);
    };

    // Name Length Validation
    const validateNameLength = (name) => {
        return name.length >= 3 && name.length <= 20;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    const isFormValid = () => {
        if (isLogin) {
            return validateEmail(identifier) && validatePassword(password);
        }
        return (
            validateNameLength(name) &&
            validateEmail(identifier) &&
            validatePassword(password)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
                    identifier,
                    password,
                });

                // Store Token and User Info
                localStorage.setItem("token", res.data.jwt);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                toast.success("Login successful!");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            } catch (err) {
                toast.error("Invalid login credentials.");
            }
        } else {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
                    username: name,
                    email: identifier,
                    password,
                });
                toast.success("Registration successful!");
                setTimeout(() => setIsLogin(true), 2000); // Redirect to login form
            } catch (err) {
                toast.error("Registration failed.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 w-full overflow-hidden">
            <div className="relative bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
                <div className="bg-blue-500 text-white p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-center items-center w-full md:w-1/3 text-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">iCopify</h1>
                        <p className="mb-8">Never Pay Until You're 100% Satisfied - Increasing traffic, leads and sales.</p>
                    </div>
                    <div>
                        <p className="mb-4">{isLogin ? "Don't have an account?" : "Have an account?"}</p>
                        <button onClick={() => setIsLogin(!isLogin)} className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-blue-500 transition-colors">
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </div>
                </div>

                <div className="relative p-8 w-full md:w-2/3 flex flex-col justify-center h-full max-w-md mx-auto overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4 text-center">{isLogin ? "Log In" : "Create New Account"}</h2>
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-4">
                                    <input
                                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => handleBlur("name")}
                                        required
                                    />
                                    {touched.name && !validateNameLength(name) && (
                                        <p className="text-red-500 text-sm mt-1">Name must be 3-20 characters long.</p>
                                    )}
                                </div>
                            )}
                            <div className="mb-4">
                                <input
                                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={isLogin ? "Username or Email" : "Email"}
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    onBlur={() => handleBlur("email")}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    required
                                />
                            </div>
                            <button
                                className={`w-full text-white py-3 rounded mb-4 transition-colors ${isFormValid() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                type="submit"
                                disabled={!isFormValid()}
                            >
                                {isLogin ? "Log In" : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default AuthForm;
