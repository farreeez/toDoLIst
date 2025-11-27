import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.tsx";

function App() {
  return (
    <div className="app">
      <div className="header">
        <nav>
          <Link to={"/"}>HomePage</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
