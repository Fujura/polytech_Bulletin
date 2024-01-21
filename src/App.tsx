import "./styles/App.css";
import { Header } from "./components/Header/Header";
import { About } from "./components/About/About";
import { Message } from "./components/Message/Message";
import { NavBar } from "./components/NavBar/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Header />
      <About />
      <Message />
    </>
  );
}

export default App;
