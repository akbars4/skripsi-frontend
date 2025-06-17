import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password); // ⬅️ cukup panggil context
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
    
  };
 
  return (
    <div className="min-h-screen bg-[#11161D] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1b2a3d] p-8 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-white text-xl font-semibold mb-6 text-center">
          LOGIN
        </h2>

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4 text-sm">
            <p>{error}</p>
            <Link
              href="/register"
              className="text-blue-600 underline hover:text-blue-800 mt-1 inline-block"
            >
              Register here
            </Link>
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label htmlFor="remember" className="text-white text-sm">
            remember me!
          </label>
        </div>

        {/* 🔗 Link to register page */}
        <p className="text-white text-sm mb-4">
          Don't have an account?{" "}
          <Link href="/Register" className="underline hover:text-gray-300">
            Register here
          </Link>
        </p>

        <button
          type="submit"
          className="w-full py-2 bg-gray-300 text-black rounded font-semibold hover:bg-gray-200"
        >
          SIGN IN
        </button>
      </form>
    </div>
  );
}
