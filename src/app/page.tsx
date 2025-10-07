import { GHomepage } from "./components/GHomepage";
import { UHomepage } from "./components/UHomepage";

export default function Home() {
    const loggedIn = true;

    if(!loggedIn) {
      return(
        <GHomepage/>
      );
    }

  return (
    <UHomepage/>
  );
}
