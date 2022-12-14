import { Card } from "flowbite-react";
import Markdown from "../view/Markdown";


function Home() {
  return <div className="container mx-auto px-2 sm:max-w-7xl sm:p-4">
    <Card>
      <Markdown src="https://gist.githubusercontent.com/0x50Fc/4f4746a4263a78fb7ac65e57004c0d47/raw/README.md"></Markdown>
    </Card>
  </div>
}

export default Home;
