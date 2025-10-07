'use client';
import Image from "next/image";

type HeaderProps = {
  buttons?: React.ReactNode;
};

export default function Header({ buttons }: HeaderProps) {
  return (
    <div id="first section" className="flex w-full items-center bg-white justify-between;">
        <div className="flex items-start">
            <Image src="/globe.svg" alt="website icon" width={50} height={50}/>
            <h1 className="font-mono font-black text-2xl m-2">Dog Date</h1>
        </div>
        {/* Button Container */}
        <div className="flex space-x-1 mt-4 items-end ml-auto">
            { buttons }
        </div>
    </div>
  );
}