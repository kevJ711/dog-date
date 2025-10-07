'use client';
import Link from 'next/link';
import { User } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <>
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="navbtn">Browse Dogs</Link>
            <Link href="/playdates" className="navbtn">Play Dates</Link>
            <Link href="/messages" className="navbtn">Messages</Link>
        </nav>

        <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link href="/profile/owner" className="ddbtn">Owner Profile</Link>
                <Link href="/profile/dog" className="ddbtn"> Dog Profile </Link>
                <Link href="/settings" className="ddbtn"> Settings</Link>
                <hr className="my-1"/>
                <Link href="/logout" className="ddbtn">Sign Out</Link>
              </div>
            )}
          </div>
        </>
    );
}