"use client";
import AuthForm from "../_components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AuthForm isLogin={false} />
    </main>
  );
}
