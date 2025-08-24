import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tasks from "./pages/Task.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={token ? <Tasks /> : <Navigate to="/login" replace />}
        />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
