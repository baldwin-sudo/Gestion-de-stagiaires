import React from "react";
import Image from "next/image";

export default function NavItem({ item }) {
  return (
    <div className="flex flex-row items-center justify-start mx-3 py-1.5 px-3 rounded-sm text-white hover:bg-blue-500 hover:font-semibold font-medium">
      {item.icon && (
        <Image
          src={item.icon}
          alt={item.text}
          width={24}
          height={24}
          className="mr-2"
        />
      )}
      {item.text}
    </div>
  );
}
