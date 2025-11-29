import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home-page/HomePage.tsx";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
