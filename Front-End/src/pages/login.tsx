import "./login.css"
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

function Login() {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const sessaoExpirada = location.state?.sessaoExpirada;

    async function entrar(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro("");

        setCarregando(true);

     try {

        const resposta = await fetch("https://minha-tarefa.onrender.com/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email.trim(),
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            setErro(dados.mensagem || "Erro ao realizar login");
            return;
        }

        if (resposta.ok) {
            localStorage.setItem("token", dados.token);
            localStorage.setItem("nome", dados.usuario.nome);
            setErro("");
            navigate("/tarefa");
            window.location.reload();
        }

        console.log(dados);

     } catch (erro) {
        console.error(erro);
        setErro("Não foi possível conectar ao servidor.");
    }finally {
    setCarregando(false);
    }
}

    return(
        <>
             <section className="login">

            <div className="apresentacao-login">
                <h1>
                    Bem-vindo <br />
                    <span>de volta!</span>
                </h1>

                <p>
                    Entre na sua conta e continue organizando
                    suas tarefas e conquistando seus objetivos.
                </p>
            </div>

            <form className="form-login" onSubmit={entrar}>

                <h2>Login</h2>
                <p>Entre com seus dados para acessar sua conta.</p>

                {sessaoExpirada && (<p className="sessao-expirada">
                Sua sessão expirou. Faça login novamente.</p>)}

                {erro && (<p className="erro-login">{erro}</p>)}

                <label>E-mail</label>
                <div className="input-login">
                    <i className="fa-regular fa-envelope"></i>
                    <input type="email" placeholder="seuemail@exemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <label>Senha</label>
                <div className="input-login">
                    <i className="fa-solid fa-lock"></i>
                    <input type={mostrarSenha ? "text" : "password"} placeholder="Digite sua senha" required  value={senha} onChange={(e) => setSenha(e.target.value)}/>
                    <i className={mostrarSenha ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => setMostrarSenha(!mostrarSenha)}></i>
                </div>

                <button type="submit" disabled={carregando}>
                    {carregando ? "Entrando..." : "Entrar"}
                </button>

                <p className="cadastro-link">Ainda não tem uma conta?
                    <Link to="/cadastro">Cadastre-se</Link>
                </p>

            </form>

        </section>
        </>
    )
}
export default Login
