import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import ProtectedRoutes from "./screens/ProtectedRoutes";
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<ProtectedRoutes />}>
            <Route element={<Home />} path="/" />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
