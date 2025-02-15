"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from "lucide-react";

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [touched, setTouched] = useState({ name: false, email: false, password: false });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false); // Terms and conditions checkbox
    const [captchaAnswer, setCaptchaAnswer] = useState(""); // CAPTCHA input
    const [captchaQuestion] = useState(generateCaptchaQuestion()); // Generate a simple CAPTCHA question

    // Generate a simple CAPTCHA question (e.g., "What is 2 + 3?")
    function generateCaptchaQuestion() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return { question: `${num1} + ${num2}`, answer: num1 + num2 };
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pass) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(pass);
    const validateNameLength = (name) => name.length >= 3 && name.length <= 20;

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        validateField(field);
    };

    const validateField = (field) => {
        let errorMessage = "";
        switch (field) {
            case "name":
                if (!validateNameLength(name)) {
                    errorMessage = "Name must be 3-20 characters long.";
                }
                break;
            case "email":
                if (!validateEmail(identifier)) {
                    errorMessage = "Please enter a valid email address.";
                }
                break;
            case "password":
                if (!validatePassword(password)) {
                    errorMessage = "Password must be at least 6 characters long, include one uppercase letter, and one special character.";
                }
                break;
            default:
                break;
        }
        setErrors({ ...errors, [field]: errorMessage });
    };

    const isFormValid = () => {
        if (isLogin) {
            return validateEmail(identifier) && validatePassword(password);
        }
        return (
            validateNameLength(name) &&
            validateEmail(identifier) &&
            validatePassword(password) &&
            acceptTerms && // Check if terms are accepted
            parseInt(captchaAnswer) === captchaQuestion.answer // Validate CAPTCHA
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateField("name");
        validateField("email");
        validateField("password");

        if (!isFormValid()) {
            if (!acceptTerms) {
                toast.error("Please accept the terms and conditions.");
            }
            if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
                toast.error("CAPTCHA answer is incorrect.");
            }
            return;
        }

        setIsLoading(true);
        const endpoint = isLogin ? "/api/auth/local" : "/api/auth/local/register";
        const payload = isLogin
            ? { identifier, password }
            : { username: name, email: identifier, password };

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`, payload);
            if (isLogin) {
                localStorage.setItem("jwt", res.data.jwt);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                toast.success("Login successful!");
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                toast.success("Registration successful!");
                setTimeout(() => setIsLogin(true), 2000);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                const errorMessage = err.response.data.error.message.toLowerCase();

                if (errorMessage.includes("username") || errorMessage.includes("name")) {
                    setErrors({ ...errors, name: "Username is already taken." });
                }
                if (errorMessage.includes("email")) {
                    setErrors({ ...errors, email: "Email is already registered." });
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 w-full overflow-hidden">
            <div className="relative bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500
 text-white p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-center items-center w-full md:w-1/3 text-center">
                    <h1 className="text-3xl font-bold mb-4">iCopify</h1>
                    <p className="mb-8">Never Pay Until You're 100% Satisfied - Increasing traffic, leads, and sales.</p>
                    <p className="mb-4">{isLogin ? "Don't have an account?" : "Have an account?"}</p>
                    <button onClick={() => setIsLogin(!isLogin)} className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-red-500
 transition-colors">
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </div>
                <div className="relative p-8 w-full md:w-2/3 flex flex-col justify-center h-full max-w-md mx-auto overflow-hidden">
                    <h2 className="text-3xl font-bold mb-4 text-center">{isLogin ? "Log In" : "Create New Account"}</h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="w-full max-w-sm min-w-[200px] mb-4">
                                <div className="relative">
                                    <input
                                        className={`peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${errors.name ? "border-red-500" : "border-slate-200"} rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => handleBlur("name")}
                                        required
                                    />
                                    <label className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left ${name ? "-top-2 left-2.5 text-xs scale-90" : ""} peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}>
                                        Name
                                    </label>
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}
                        <div className="w-full max-w-sm min-w-[200px] mb-4">
                            <div className="relative">
                                <input
                                    className={`peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    onBlur={() => handleBlur("email")}
                                    required
                                />
                                <label className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left ${identifier ? "-top-2 left-2.5 text-xs scale-90" : ""} peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}>
                                    {isLogin ? "Username or Email" : "Email"}
                                </label>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="w-full max-w-sm min-w-[200px] mb-4 relative">
                            <div className="relative">
                                <input
                                    className={`peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${errors.password ? "border-red-500" : "border-slate-200"} rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    required
                                />
                                <label className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left ${password ? "-top-2 left-2.5 text-xs scale-90" : ""} peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}>
                                    Password
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        {!isLogin && (
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-700">
                                    I agree to the terms and conditions
                                </label>
                            </div>
                        )}

                        {/* CAPTCHA */}
                        {!isLogin && (
                            <div className="w-full max-w-sm min-w-[200px] mb-4">
                                <div className="mb-2">
                                    <p className="text-sm text-slate-700">Solve the following: {captchaQuestion.question}</p>
                                </div>
                                <div className="relative">
                                    <input
                                        className={`peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${errors.captcha ? "border-red-500" : "border-slate-200"} rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                                        type="text"
                                        placeholder="Enter your answer"
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        required
                                    />
                                    <label className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left ${captchaAnswer ? "-top-2 left-2.5 text-xs scale-90" : ""} peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}>
                                        Answer
                                    </label>
                                </div>
                            </div>
                        )}

                        <button className="w-full text-white py-3 rounded mb-4 bg-gradient-to-r from-orange-500 to-red-500
 hover:text-red-500" type="submit" disabled={isLoading}>
                            {isLoading ? "Processing..." : isLogin ? "Log In" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default AuthForm;