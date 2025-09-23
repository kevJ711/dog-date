//import Image from "next/image";
//New Code
import Link from 'next/link';

export default function Home() {
  return (
  <main>
    <div id="">
      <h1>Welcome to Dog Date</h1>
      {/* Sign Up Button */}
      <Link href="/signup">
      <button>Sign up</button>
      </Link>
      {/* Log In Button */}
      <Link href="/login">
      <button>Log In</button>
      </Link>
    </div>
  </main>
  );
}
