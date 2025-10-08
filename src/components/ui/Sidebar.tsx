'use client';

export default function Sidebar() {
    return(
        <div id="sidebar_section " className="bg-amber-300 p-4 h-screen w-[200px] not-hover:hidden hover:contents">
            <div id="sidebar_icon" className="text-2xl font-bold text-white" >☰</div>
                <div>
                    <ul className="text-xl font-bold text-white">
                        <li className="hover:text-blue-500"><a href="/userProfile">My Profile</a></li>
                        <li className="hover:text-blue-500"><a href="/dogs">My Dogs</a></li>
                        <li className="hover:text-blue-500"><a href="/playdates" >Playdates</a></li>
                        <li className="hover:text-blue-500"><a href="/favorites" >Favorites</a></li>
                     </ul>
                </div>
        </div>
    );
}