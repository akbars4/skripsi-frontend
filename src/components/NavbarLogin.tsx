import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { logout } from "lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const NavbarLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const {user} = useAuth();
  if (!user) return null

  const handleLogout = () => {
    logout();             // ⬅️ Clear token & state
    window.location.href = "/"; // ⬅️ Redirect ke homepage
  };

  return (
    <nav className="bg-[#1b2a3d] sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-1 py-4 flex items-center justify-between">
        <div className="p-0">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logoWeb1.png"
              alt="Logo PlayPal"
              width={128}   // misal lebar 128px
              height={32}   // misal tinggi 32px
              className="cursor-pointer"
              priority       // karena ini LCP image, bisa diset priority
            />
          </Link>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8 text-white">
          <Link href="/games" className="hover:underline">Games</Link>
          <Link href="/forum" className="hover:underline">Forum</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <Link href="/lists" className="hover:underline">List</Link>
          <Link href="/activity" className="hover:underline">Activity</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>

          <button onClick={handleLogout} className="hover:underline text-left">
            Log Out
          </button>

          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>

        {/* Hamburger (mobile) */}
        <div className="md:hidden text-white">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1b2a3d] px-6 pb-4 space-y-2 text-white">
          <Link href="/games" className="block hover:underline" onClick={() => setIsOpen(false)}>Games</Link>
          <Link href="/forum" className="block hover:underline" onClick={() => setIsOpen(false)}>Forum</Link>
          <Link href="/search" className="block hover:underline" onClick={() => setIsOpen(false)}>Search</Link>
          <Link href="/lists" className="block hover:underline" onClick={() => setIsOpen(false)}>List</Link>
          <Link href="/activity" className="block hover:underline" onClick={() => setIsOpen(false)}>Activity</Link>
          <Link href="/profile" className="block hover:underline" onClick={() => setIsOpen(false)}>Profile</Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="block hover:underline text-left"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarLogin;
