'use client';
import Link from 'next/link';
import Header from "./Header";
import DisplayBlock from './DisplayBlock';

export const GHomepage = () => {
    const title = "Introducing Dog Date";
    const content = "Dog Owners want safe, easy ways to find compatible playmates nearby. Existing social apps are general-purpose and do not account for dog-specific preferences (size, temperament,vaccination status, etc.)."

    return(
          <main className="">
            <Header buttons= {
                <>
                    <Link href="/signup" className="btn">Sign Up</Link>
                    <Link href="/login" className="btn">Log In</Link>
                </>
            }/>
            <DisplayBlock title={title} content={content} />
        </main>
  );
    
}