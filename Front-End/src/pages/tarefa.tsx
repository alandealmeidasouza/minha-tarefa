import "./tarefa.css"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router";

    type Tarefa = {
    id: string;
    titulo: string;
    concluida: boolean;
    };

function Tarefa() {

    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [titulo, setTitulo] = useState("");
    const [tarefaEditando, setTarefaEditando] = useState<string | null>(null);
    const [tituloEditado, setTituloEditado] = useState("");
    const [erro, setErro] = useState("");
    const [adicionando, setAdicionando] = useState(false);
    const inputEdicaoRef = useRef<HTMLInputElement>(null);
    const [carregandoTarefas, setCarregandoTarefas] = useState(true);

    const [filtro, setFiltro] = useState<"todas" | "pendentes" | "concluidas">("todas");

    const navigate = useNavigate();

    function sessaoExpirada() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");

    navigate("/login", {
        state: { sessaoExpirada: true }
    });
}

    useEffect(() => {

    async function buscarTarefas() {

     try {

        const token = localStorage.getItem("token");

        const resposta = await fetch("https://minha-tarefa.onrender.com/tarefas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (resposta.status === 401) {
            sessaoExpirada();
            return;
        }

        const dados = await resposta.json();

        if (resposta.ok) {
            setTarefas(dados);
            setErro("");
        }

        if (!resposta.ok) {
            setErro(dados.mensagem || "Erro ao carregar tarefas");
            return;
        }

        console.log(dados);

     } catch (erro) {
        console.error(erro);
        setErro("Não foi possível conectar ao servidor.");
    }finally {
    setCarregandoTarefas(false);
    }
}

    buscarTarefas();

}, []);

async function adicionarTarefa(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!titulo.trim()) {
    return;
}
    setAdicionando(true);

    setErro("");

 try {

    const token = localStorage.getItem("token");

    const resposta = await fetch("https://minha-tarefa.onrender.com/tarefas", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            titulo: titulo.trim()
        })
    });
    
    if (resposta.status === 401) {
    sessaoExpirada();
    return;
}

    const dados = await resposta.json();

    if (resposta.ok) {
    setTarefas([...tarefas, dados]);
    setTitulo("");
    setErro("");
}

    if (!resposta.ok) {
    setErro(dados.mensagem || "Erro ao adicionar tarefa");
    return;
}

    console.log(dados);

 } catch (erro) {
    console.error(erro);
    setErro("Não foi possível conectar ao servidor.");
} finally {
    setAdicionando(false);
  }

}

async function excluirTarefa(id: string) {

    const confirmar = window.confirm("Tem certeza que deseja excluir esta tarefa?");

    if (!confirmar) {
        return;
    }

  try {

    const token = localStorage.getItem("token");

    const resposta = await fetch(`https://minha-tarefa.onrender.com/tarefas/${id}`, {
        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (resposta.status === 401) {
    sessaoExpirada();
    return;
}
    const dados = await resposta.json();

    if (resposta.ok) {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    setErro("");
}

    if (!resposta.ok) {
    setErro(dados.mensagem || "Erro ao excluir tarefa");
    return;
}
    console.log(dados);

  } catch (erro) {
    console.error(erro);
    setErro("Não foi possível conectar ao servidor.");
}
}

function iniciarEdicao(tarefa: Tarefa) {
    setTarefaEditando(tarefa.id);
    setTituloEditado(tarefa.titulo);
    setTimeout(() => inputEdicaoRef.current?.focus(), 0);
}

function cancelarEdicao() {
    setTarefaEditando(null);
    setTituloEditado("");
}

async function salvarEdicao(id: string) {

    if (!tituloEditado.trim()) {
    return;
}
    setErro("");

  try {
  
    const token = localStorage.getItem("token");

    const resposta = await fetch(`https://minha-tarefa.onrender.com/tarefas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            titulo: tituloEditado.trim()
        })
    });

    if (resposta.status === 401) {
    sessaoExpirada();
    return;
}

    const dados = await resposta.json();

    if (resposta.ok) {
    setTarefas(
        tarefas.map((tarefa) =>
            tarefa.id === id ? dados : tarefa
        )
    );

    setTarefaEditando(null);
    setTituloEditado("");
    setErro("");
}

    if (!resposta.ok) {
    setErro(dados.mensagem || "Erro ao editar tarefa");
    return;
}

    console.log(dados);

    } catch (erro) {
        console.error(erro);
        setErro("Não foi possível conectar ao servidor.");
    }
}

async function alterarConcluida(tarefa: Tarefa) {

  setErro("");

  try {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        `https://minha-tarefa.onrender.com/tarefas/${tarefa.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                concluida: !tarefa.concluida
            })
        }
    );

    if (resposta.status === 401) {
    sessaoExpirada();
    return;
}

    const dados = await resposta.json();

    if (resposta.ok) {
    setTarefas(
        tarefas.map((item) =>
            item.id === tarefa.id ? dados : item
        )
    );
    setErro("");
}

    if (!resposta.ok) {
    setErro(dados.mensagem || "Erro ao atualizar tarefa");
    return;
}

    console.log(dados);

    } catch (erro) {
        console.error(erro);
        setErro("Não foi possível conectar ao servidor.");
    }
}


const tarefasFiltradas = tarefas.filter((tarefa) => {

    if (filtro === "pendentes") {
        return !tarefa.concluida;
    }

    if (filtro === "concluidas") {
        return tarefa.concluida;
    }

    return true;
});

const quantidadePendentes = tarefas.filter(
    (tarefa) => !tarefa.concluida
).length;

const quantidadeConcluidas = tarefas.filter(
    (tarefa) => tarefa.concluida
).length;

    return(
        <>
        <section className="tarefas">

            <div className="conteudo-tarefas">
                <div className="titulo-tarefas">
                    <h1>Minhas tarefas</h1>
                    <p>Organize seu dia e acompanhe seu progresso.</p>
                    <div className="quantidades-tarefas">

                        <p className="quantidade-pendentes">
                            {quantidadePendentes} {quantidadePendentes === 1 ? "tarefa pendente" : "tarefas pendentes"}
                        </p>

                        <p className="quantidade-concluidas">
                            {quantidadeConcluidas} {quantidadeConcluidas === 1 ? "tarefa concluída" : "tarefas concluídas"}
                        </p>

                    </div>
                </div>
                {erro && (<p className="erro-tarefa">{erro}</p>)}
                <form className="nova-tarefa" onSubmit={adicionarTarefa}>

                    <input type="text" placeholder="Digite uma nova tarefa..." value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
                    <button type="submit" disabled={adicionando}>
                        <i className="fa-solid fa-plus"></i>
                        {adicionando ? "Adicionando..." : "Adicionar"}
                    </button>

                </form>
                <div className="filtros-tarefas">
                    <button className={filtro === "todas" ? "filtro-ativo" : ""} onClick={()   => setFiltro("todas")}>Todas
                    </button>
                    <button className={filtro === "pendentes" ? "filtro-ativo" : ""}
                        onClick={() => setFiltro("pendentes")}>
                        Pendentes
                    </button>
                    <button className={filtro === "concluidas" ? "filtro-ativo" : ""}
                        onClick={() => setFiltro("concluidas")}>
                        Concluídas
                    </button>
                </div>
                <div className="lista-tarefas">
                    {carregandoTarefas && (<p className="sem-tarefas">Carregando tarefas...</p>)}
                    {!carregandoTarefas && tarefasFiltradas.length === 0 && (<p className="sem-tarefas">Nenhuma tarefa encontrada.</p>)}
                    {tarefasFiltradas.map((tarefa) => (<div className="item-tarefa" key={tarefa.id}>
                        <button className={`check-tarefa ${tarefa.concluida ?  "check-concluido" : ""}`} onClick={() => alterarConcluida(tarefa)}> {tarefa.concluida && "✓"}</button>
                        {tarefaEditando === tarefa.id ? (<input ref={inputEdicaoRef} type="text" onKeyDown={(e) => {if (e.key === "Enter") {salvarEdicao(tarefa.id);}  if (e.key === "Escape") {cancelarEdicao();}
                            }} value={tituloEditado}
                        onChange={(e) => setTituloEditado(e.target.value)}/>) : (<span className={tarefa.concluida ? "tarefa-concluida" : ""}>{tarefa.titulo}</span>)}
                        <div className="acoes-tarefa">{tarefaEditando === tarefa.id ? (<>
                            <button
                                className="editar-tarefa"
                                onClick={() => salvarEdicao(tarefa.id)}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                            <button
                                className="excluir-tarefa"
                                onClick={cancelarEdicao}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button> </>) : (
                            <button
                                className="editar-tarefa"
                                onClick={() => iniciarEdicao(tarefa)}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </button>)}
                            <button
                                className="excluir-tarefa"
                                onClick={() => excluirTarefa(tarefa.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}

export default Tarefa