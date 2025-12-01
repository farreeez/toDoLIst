import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/layout/sidebar/Sidebar.tsx";
import DashBoard from "./pages/home-page/DashBoard.tsx";

function App() {
  return (
    <div className="app">
      <div className="sidebarDiv">
        <Sidebar />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<DashBoard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
