import React from 'react'
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NavbarGuest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1b2a3d] sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-end">
        {/* Logo */}
        {/* <div className="bg-gray-300 text-black px-4 py-2">
          logo
        </div> */}

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-8 text-white">
          <Link href="/games" className="hover:underline">Games</Link>
          <Link href="/Login" className="hover:underline">Login</Link>
          <Link href="/Register" className="hover:underline">Register</Link>
          <Link href="/search" className="hover:underline">Search</Link>
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

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-[#1b2a3d] px-6 pb-4 space-y-2 text-white">
          <Link href="/games" className="block hover:underline" onClick={() => setIsOpen(false)}>Games</Link>
          <Link href="/Login" className="block hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/Register" className="block hover:underline" onClick={() => setIsOpen(false)}>Register</Link>
          <Link href="/search" className="block hover:underline" onClick={() => setIsOpen(false)}>Search</Link>
        </div>
      )}
    </nav>
  );
};

export default NavbarGuest;
