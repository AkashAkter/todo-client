import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import SignUp from "./components/SignUp";
import TodoList from "./components/TodoList";
import Login from "./components/Login";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && <Route path="/" exact element={<TodoList />} />}

      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
