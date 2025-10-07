'use client';
import Header from "./Header";
import DisplayBlock from "./DisplayBlock";
import Discover from "./Discover";

export const UHomepage = () => {
    const title = "Introducing Dog Date";
    const content = "Dog Owners want safe, easy ways to find compatible playmates nearby. Existing social apps are general-purpose and do not account for dog-specific preferences (size, temperament,vaccination status, etc.)."

    return(
        <main>
            <Header buttons = {
                <button className="btn">Log Out</button>
            }/>
            <DisplayBlock title={title} content={content} />
            <Discover/>
        </main>
    )
}