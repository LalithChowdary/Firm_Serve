import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Link href="/">
          <Image className="w-[8vw]" src="/icon.jpeg" alt="health sphere" />
        </Link>
        <div className="flex items-center space-x-6">
          <div>Home</div>
          <div>Book Appointment</div>
          <div>Pill Box</div>
          <div>Dasboard</div>
          <div>Profile</div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-black">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-black text-white">
              <Link href="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
