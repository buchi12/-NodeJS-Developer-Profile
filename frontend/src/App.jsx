import "./App.css";
import { Fixed } from "./components/Footers/Fixed";
import { Footer } from "./components/Footers/Footer";
import { Header } from "./components/Headers/Header";
import { Main } from "./components/Main";

function App() {
	return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
      <Fixed />
    </div>
  );
}

export default App;
