import { useEffect, useState } from "react";
import NavbarGuest from "./NavbarGuest";
import NavbarLogin from "./NavbarLogin";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true jika token ada
  }, []);

  return isLoggedIn ? <NavbarLogin /> : <NavbarGuest />;
}
