import { Route, Routes } from "react-router-dom";
import NavBar from "./components/UI/NavBar/NavBar.tsx";
import RegisterPage from "./features/users/RegisterPage.tsx";
import LoginForm from "./features/users/LoginForm.tsx";

const App = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <Routes>
        <Route path="/" element={<h1>Home page</h1>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </>
  );
};

export default App;
