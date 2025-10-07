'use client';
import Sidebar from "./Sidebar";

type DisplayBlockProps = {
    title: string;
    content: string;
};

export default function DisplayBlock ({ title, content }: DisplayBlockProps) {
    return (
        <div id="Second section" className="flex bg-black items-center justify-center min-h-screen">
            <div><Sidebar/></div>
            <div className="flex-col"> {/* Word content contianer */}
                <h1 className="font-mono text-white text-4xl m-2">{ title }</h1><br/>
                <p className="font-mono text-white text-xl m-2">{ content }</p>
            </div>
        </div>
    )
}