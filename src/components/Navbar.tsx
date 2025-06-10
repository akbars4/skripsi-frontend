import { logout } from "lib/api";
import { useAuth } from "@/context/AuthContext";
import NavbarGuest from "@/components/NavbarGuest";
import NavbarLogin from "@/components/NavbarLogin";

export default function Navbar() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // atau spinner

  return isAuthenticated ? <NavbarLogin /> : <NavbarGuest />;
}
