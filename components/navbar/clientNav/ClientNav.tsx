import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ClientNav = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Link href="/">
          <Image
            className="w-[30vw]"
            src="/icon.jpeg"
            alt="health sphere"
            width={100}
            height={100}
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/client/cases">Case</Link>
          <Link href="/client/appointment">Appointment</Link>
          <Link href="/client/bills_payment">Bills & Payment</Link>
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
    </div>
  );
};

export default ClientNav;
