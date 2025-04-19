import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-6 px-4 md:px-8">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          <Image
            src="/icon.jpeg"
            alt="health sphere"
            className="w-[180px] md:w-[8vw]"
            width={100}
            height={100}
          />

          <ul className="flex flex-col md:flex-row text-center md:text-left text-sm md:text-xs font-semibold gap-4 md:gap-8 mt-4 md:mt-0">
            <li className="cursor-pointer hover:text-primary">Book Now</li>
            <li className="cursor-pointer hover:text-primary">Get Help</li>
            <li className="cursor-pointer hover:text-primary">Contact US</li>
            <li className="cursor-pointer hover:text-primary">Support</li>
          </ul>

          <div className="flex gap-6 md:gap-4 mt-6 md:mt-0">
            <Link href="#" aria-label="Facebook">
              <Image
                src="/footer/facebook.png"
                alt="Facebook"
                className="w-[24px] md:w-[1vw]"
                width={100}
                height={100}
              />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Image
                src="/footer/X1.png"
                alt="Twitter"
                className="w-[24px] md:w-[1vw]"
                width={100}
                height={100}
              />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Image
                src="/footer/ins.png"
                alt="Instagram"
                className="w-[24px] md:w-[1vw]"
                width={100}
                height={100}
              />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Image
                src="/footer/youtube.png"
                alt="YouTube"
                className="w-[24px] md:w-[1vw]"
                width={100}
                height={100}
              />
            </Link>
          </div>
        </div>

        <hr className="border-black mt-8 md:mt-16" />

        <div className="flex flex-row items-center justify-center mt-6 text-xs">
          <p>© 2025 LawEdge. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
