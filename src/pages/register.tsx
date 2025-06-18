import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!agree) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  if (password !== passwordConfirmation) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch("https://skripsi-backend-production-7fd4.up.railway.app/api/register", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await res.json();

    if (data.errors) {
      console.log("Validation errors:", data.errors);
    }

    if (!res.ok) {
      const errorMessages = Object.values(data.errors || {}).flat();
      throw new Error(errorMessages.join("\n") || data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/";
  } catch (err: any) {
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen bg-[#11161D] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1b2a3d] p-8 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-white text-xl font-semibold mb-6 text-center">
          Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-300 text-black rounded outline-none"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="mr-2"
          />
          <label htmlFor="agree" className="text-white text-sm">
            i agree the terms & condition!
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gray-300 text-black rounded font-semibold hover:bg-gray-200"
        >
          CREATE AN ACCOUNT
        </button>
      </form>
    </div>
  );
}
