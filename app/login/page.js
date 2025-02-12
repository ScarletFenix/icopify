"use client";
import AuthForm from "../_components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AuthForm isLogin={true} />
    </main>
  );
}
