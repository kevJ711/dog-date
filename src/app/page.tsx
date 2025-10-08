import { GHomepage } from "../components/ui/GHomepage";
import { UHomepage } from "../components/ui/UHomepage";

export default function Home() {
  const loggedIn = false;

    if(!loggedIn) {
      return(
        <GHomepage/>
      );
    }

  return (
    <UHomepage/>

  );
}
