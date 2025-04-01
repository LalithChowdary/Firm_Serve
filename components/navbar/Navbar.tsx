import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const Navbar = () => {
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
          <Link href="/">Home</Link>
          <div>Book Appointment</div>
          <Link href="/clients">Clients</Link>
          <div>Profile</div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-black">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-black text-white">
              <Link href="/api/auth/signin">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
