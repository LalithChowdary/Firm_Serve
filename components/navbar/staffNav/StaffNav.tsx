"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const StaffNav = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center py-4 px-4 md:px-8">
        <Link href="/">
          <Image
            className="w-[120px] md:w-[8vw]"
            src="/icon.jpeg"
            alt="health sphere"
            width={100}
            height={100}
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/staff/cases" className="hover:text-primary">
            Case
          </Link>
          <Link href="/staff/appointment" className="hover:text-primary">
            Appointment
          </Link>
          <Link href="/staff/documents" className="hover:text-primary">
            Documents
          </Link>
          <Link href="/staff/expences" className="hover:text-primary">
            Expences
          </Link>
          <div className="flex gap-2">
            {!session ? (
              <Button asChild variant="outline" className="border-black">
                <Link href="/api/auth/signin">Login</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="border-black">
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 py-4 px-6 flex flex-col space-y-4 border-t">
          <Link
            href="/staff/cases"
            className="hover:text-primary py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Case
          </Link>
          <Link
            href="/staff/appointment"
            className="hover:text-primary py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Appointment
          </Link>
          <Link
            href="/staff/documents"
            className="hover:text-primary py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Documents
          </Link>
          <Link
            href="/staff/expences"
            className="hover:text-primary py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Expences
          </Link>
          <div className="pt-2">
            {!session ? (
              <Button asChild variant="outline" className="border-black w-full">
                <Link href="/api/auth/signin">Login</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="border-black w-full">
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffNav;
