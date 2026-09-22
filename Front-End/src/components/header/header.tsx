import "./header.css"
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Header() {

    const [menuAberto, setMenuAberto] = useState(false);
    const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
    const nome = localStorage.getItem("nome");
    const navigate = useNavigate();

    function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");

    navigate("/");
    window.location.reload();
}

    return(
        <>
        <header className="container1">
            <section>
                <img src="./logo.png" alt="logo" className="logo"/>
            </section>

            {!nome && (
                <nav className="menu-desktop">
                    <Link to="/">Home</Link>
                    <Link to="/cadastro">Cadastro</Link>
                    <Link to="/login">Login</Link>
                </nav>
            )}

            {nome ? (<section className="container2">
                <span>{nome}</span>
              <div className="perfil-logado" onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
    >
        <i className="fa-solid fa-circle-user"></i>
        <i className={`fa-solid fa-chevron-down ${menuPerfilAberto ? "seta-aberta" : ""}`}></i>
    </div>
    {menuPerfilAberto && (<div className="menu-perfil">
        <button onClick={sair}>Sair</button>
        </div>)}

 </section>
) : (
    <section className="container2">
        <div className="menu-hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
            <i className="fa-solid fa-bars"></i>
        </div>

        <p>
            <i className="fa-solid fa-circle-user"></i>
        </p>
    </section>
)}
            
        </header>
        
        {menuAberto && (
    <div className="menu-overlay">

        <div className="menu-mobile">
            <div className="topo-menu">

                <div className="fechar-menu" onClick={() => setMenuAberto(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </div>

                <div className="perfil-menu">
                    <i className="fa-solid fa-circle-user"></i>
                </div>
            </div>
            <div className="logo-menu"></div>
            <div className="opcoes-menu">

                <Link to="/" className="opcao-menu" onClick={() => setMenuAberto(false)}>
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                </Link>

                <Link to="/cadastro" className="opcao-menu" onClick={() => setMenuAberto(false)}>
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Cadastro</span>
                </Link>

                <Link to="/login" className="opcao-menu" onClick={() => setMenuAberto(false)}>
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span>Login</span>
                </Link>

            </div>
        </div>
    </div>
)}
    </>
)
}


export default Header
