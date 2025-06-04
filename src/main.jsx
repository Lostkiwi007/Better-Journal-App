import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JournalPage from "./pages/JournalPage";
import PerformancePage from "./pages/PerformancePage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<JournalPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);