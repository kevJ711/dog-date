'use client';
import Link from 'next/link';
import Header from './Header';
import Discover from "@/components/ui/Discover"
import { Navbar } from "@/components/ui/Navbar";

export const UHomepage = () => {

    return(
        <><Header buttons={
            <><Navbar />
            <Link href="" className="btn">Log Out</Link></>
        } />
            <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-300 to-blue-900 flex flex-col">
            {/* Main Content */}
            <section className="flex-1 flex flex-col items-center justify-center text-center text-white px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
                    Find Play Dates for Your Dog
                </h1>
                <p className="text-lg md:text-xl max-w-2xl text-indigo-900 mb-10">
                    Connect with local dog owners and discover the perfect playmates for your furry friend. Safe, easy, and tail-waggingly fun!
                </p>
            </section>
        </div><Discover /></>
    )
}