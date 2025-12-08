import Banner from "./home/Banner";
import Details from "./home/Details";
import Elevate from "./home/Elevate";
import Function from "./home/Function";
import Welcome from "./home/Welcome";


export default function Home() {
  return (
    <div className="">
      <Banner />
      <Welcome />
      <Details />
      <Function />
      <Elevate/>
    </div>
  );
}
