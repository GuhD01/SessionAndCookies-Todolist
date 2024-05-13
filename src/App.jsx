import "./App.css";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Todo from "./Todo";
import Login from "./Login";
import SignUp from "./SignUp";

function ProtectedRoute({ children }) {
  const [cookies] = useCookies();
  const token = cookies.session;
  if (!token) {
    return <Navigate to="/login" />;
  } 

  return children;
}

function App() {
  const [cookies] = useCookies();

  useEffect(() => {
    const savedTheme = cookies.theme;
    if (savedTheme) {
      document.body.style = savedTheme === 'Light' ? 'background: #F5F5F5; color: #000;' : 'background: #333333; color: #FFF;';
    }
  }, [cookies]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><main><Todo /></main></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
