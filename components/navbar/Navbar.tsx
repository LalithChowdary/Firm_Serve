"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Link href="/">
          <Image
            className="w-[8vw]"
            src="/icon.jpeg"
            alt="health sphere"
            width={100}
            height={100}
          />
        </Link>
        <div className="flex items-center space-x-6">
          <div>Home</div>
          <div>Book Appointment</div>
          <div>Pill Box</div>
          <div>Dasboard</div>
          <div>Profile</div>
          <div className="flex gap-2">
            {status === "unauthenticated" ? (
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
    </div>
  );
};

export default Navbar;
