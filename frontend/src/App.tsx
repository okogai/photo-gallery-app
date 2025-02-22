import { Route, Routes } from "react-router-dom";
import NavBar from "./components/UI/NavBar/NavBar.tsx";
import RegisterPage from "./features/users/RegisterPage.tsx";
import LoginForm from "./features/users/LoginForm.tsx";
import ImagesList from "./features/images/ImagesList.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import ImageForm from "./features/images/ImageForm.tsx";
import { useAppSelector } from "./app/hooks.ts";
import { selectUser } from "./features/users/userSlice.ts";

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <Routes>
        <Route path="/" element={<ImagesList />} />
        <Route path="/images/author/:userId" element={<ImagesList />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<h1>Not found</h1>} />

        <Route
          path="/add-image"
          element={
            <ProtectedRoute isAllowed={Boolean(user)}>
              <ImageForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
