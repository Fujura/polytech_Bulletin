import "./styles/App.css";
import { Header } from "./components/Header/Header";
import { About } from "./components/About/About";
import { NavBar } from "./components/NavBar/NavBar";

function App() {

  
  return (
    <>
      <NavBar />
      <Header />
      <About />
    </>
  );
}

export default App;
