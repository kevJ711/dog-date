import Image from "next/image";
//New Code
import Link from 'next/link';
//<Image src="/vercel.svg" alt="website icon" width={500} height={500}/>

export default function Home() {
  return (
  <main className="">
    <div id="first section" className="flex w-full items-center bg-white justify-between;">
      <div className="flex items-start">
        <Image src="/globe.svg" alt="website icon" width={50} height={50}/>
        <h1 className="font-mono font-black text-2xl m-2">Dog Date</h1>
      </div>
      {/* Button Container */}
      <div className="flex space-x-1 mt-4 items-end ml-auto">
        {/* Sign Up button */}
        <Link href="/signup">
        <button className='btn' >Sign up</button>
        </Link>
        {/* Log In button */}
        <Link href="/login">
        <button className='btn' >Log In</button>
        </Link>
      </div>
    </div>
    <div id="Second section" className="flex bg-black items-center justify-center min-h-screen">
      <div className="flex-col"> {/* Word content contianer */}
        <h1 className="font-mono text-white text-4xl m-2">Introducing Dog Date</h1><br/>
        <p className="font-mono text-white text-xl m-2">Dog Owners want safe, easy ways to find compatible playmates nearby. Existing social apps
        are general-purpose and do not account for dog-specific preferences (size, temperament,
        vaccination status, etc.).</p>
      </div>
    
    </div>
  </main>
  );
}
