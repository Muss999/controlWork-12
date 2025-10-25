import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import "./App.css";
import Home from "./features/home/Home";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import RecipeInfo from "./features/recipes/RecipeInfo";

const App = () => {
  return (
    <Layout>
      <Routes>
        {["/"].map((path) => (
          <Route path={path} element={<Home />} />
        ))}

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/recipes/:id" element={<RecipeInfo />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;
