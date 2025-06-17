import React from 'react'
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

const NavbarGuest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1b2a3d] sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-1 py-4 flex items-center justify-between">
        {/* Logo */}
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
        <div className="hidden md:flex space-x-8 text-white">
          <Link href="/games" className="hover:underline">Games</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link href="/register" className="hover:underline">Register</Link>
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
          <Link href="/login" className="block hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/register" className="block hover:underline" onClick={() => setIsOpen(false)}>Register</Link>
          <Link href="/search" className="block hover:underline" onClick={() => setIsOpen(false)}>Search</Link>
        </div>
      )}
    </nav>
  );
};

export default NavbarGuest;
