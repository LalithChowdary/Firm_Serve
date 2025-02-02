import React from "react";
import Image from "next/image";
const Footer = () => {
  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex flex-row items-center justify-between">
          <Image
            src="/icon.jpeg"
            alt="health sphere"
            className="w-[8vw]"
            width={100}
            height={100}
          />

          <ul className="flex text-xs font-semibold gap-8">
            <li>Book Now</li>
            <li>Get Help</li>
            <li>Contact US</li>
            <li>Support</li>
          </ul>
          <div className="flex gap-4">
            <Image
              src="/footer/facebook.png"
              alt=""
              className="w-[1vw]"
              width={100}
              height={100}
            />
            <Image
              src="/footer/X1.png"
              alt=""
              className="w-[1vw]"
              width={100}
              height={100}
            />
            <Image
              src="/footer/ins.png"
              alt=""
              className="w-[1vw]"
              width={100}
              height={100}
            />
            <Image
              src="/footer/youtube.png"
              alt=""
              className="w-[1vw]"
              width={100}
              height={100}
            />
          </div>
        </div>

        <hr className="border-black mt-16 " />

        <div className="flex flex-row items-center justify-center mt-6 text-xs">
          <p>© 2024 HealthApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
