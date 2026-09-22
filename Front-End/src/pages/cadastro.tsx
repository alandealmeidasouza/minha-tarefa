import "./cadastro.css"
import { Link, useNavigate } from "react-router";
import { useState } from "react";

function Cadastro() {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    async function cadastrar(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro("");

        setCarregando(true);

      try {

        const resposta = await fetch("https://minha-tarefa.onrender.com/usuarios", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim(),
            senha: senha
        })
    });

    const dados = await resposta.json();

    console.log(dados);

    if (resposta.ok) {
        setErro("");
        navigate("/login");
    } else {
        setErro(dados.mensagem || "Erro ao realizar cadastro");
    }
    
  } catch (erro) {
    console.error(erro);
    setErro("Não foi possível conectar ao servidor.");
    }finally {
    setCarregando(false);
    }
}

    return(
        <>
         <section className="cadastro">

            <div className="apresentacao-cadastro">
                <h1>
                    Crie sua conta <br />
                    <span>e comece agora</span>
                </h1>

                <p>
                    Organize suas tarefas, tenha mais foco
                    e conquiste seus objetivos todos os dias.
                </p>
            </div>

            <form className="form-cadastro" onSubmit={cadastrar}>
                <h2>Cadastro</h2>
                <p>Preencha os dados abaixo para criar<br />sua conta.</p>

                {erro && (<p className="erro-cadastro">{erro}</p>)}

                <label>Nome</label>
                <div className="input-cadastro">
                    <i className="fa-regular fa-user"></i>
                    <input type="text" placeholder="Seu nome completo" required value={nome}  onChange={(e) => setNome(e.target.value)}/>
                </div>

                <label>E-mail</label>
                <div className="input-cadastro">
                    <i className="fa-regular fa-envelope"></i>
                    <input type="email" placeholder="seuemail@exemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <label>Senha</label>
                <div className="input-cadastro">
                    <i className="fa-solid fa-lock"></i>
                    <input type={mostrarSenha ? "text" : "password"} placeholder="Crie uma senha" minLength={6} required value={senha} onChange={(e) => setSenha(e.target.value)}/>
                    <i className={mostrarSenha ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => setMostrarSenha(!mostrarSenha)}></i>
                </div>
                <p className="aviso-senha">A senha deve ter pelo menos 6 caracteres.</p>
                <button type="submit" disabled={carregando}>
                    {carregando ? "Cadastrando..." : "Cadastrar"}
                </button>
    
                <p className="login-link">Já tem uma conta? <Link to="/login">Entrar agora</Link>
                </p>
            </form>

        </section>
        </>
    )
}
export default Cadastro