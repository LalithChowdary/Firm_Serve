import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/authOptions";

const AdminNav = async () => {
  // This will only work in a server component (no "use client" directive)
  const session = await getServerSession(authOptions);

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
          <Link href="/admin/staff">Staff</Link>
          <Link href="/admin/clients">Clients</Link>
          <Link href="/admin/cases">Case</Link>
          <Link href="/admin/appointments">Appointments</Link>
          <Link href="/admin/billing_expences">Billing & Expences</Link>
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

export default AdminNav;
