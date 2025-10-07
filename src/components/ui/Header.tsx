'use client';
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  buttons?: React.ReactNode;
};

export default function Header({ buttons }: HeaderProps) {
  
  return (
    <header className="w-full bg-blue-200/80 backdrop-blur-sm border-b border-blue-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dogdate-logo.png"
            alt="Dog Date Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">Dog Date</h1>
        </Link>

        {/* Navbar/Buttons Section (Optional)*/}
        <div className="flex items-center gap-4">
          { buttons }
        </div>
      </div>
    </header>
  );
}