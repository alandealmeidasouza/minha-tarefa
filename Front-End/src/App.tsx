import './App.css'
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Inicio from "./pages/inicio";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Tarefa from './pages/tarefa';

function RotaProtegida({ children }: { children: React.ReactNode }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

function Layout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
  {path: "/", element: localStorage.getItem("token")
    ? <Navigate to="/tarefa" replace />
    : <Inicio />
},
  { path: "/cadastro", element: <Cadastro/>},
  { path: "/login", element: <Login /> },
  { path: "/tarefa", element: (
        <RotaProtegida>
            <Tarefa />
        </RotaProtegida>
    )
}
  ]
}
])

function App() {
  return(
    <RouterProvider router={router} />
  )
}

export default App