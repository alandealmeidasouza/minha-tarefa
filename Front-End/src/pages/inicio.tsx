import "./inicio.css"
import { Link } from "react-router";

function referenses(icone:string, titulo:string, texto:string, cor:string, fundo:string) {
    return(
        <aside className="boxflex2">
            <div><i className={icone} style={{backgroundColor: fundo,  color: cor}}></i></div>
                <div className="parag3">
                <h3>{titulo}</h3>
                <p>{texto}</p>
            </div>
        </aside>
    )
}

function Inicio() {
    return(
        <>
            <section className="imgfundo">
                    <div className="boxflex">
                        <i className="fa-solid fa-circle-check"></i>
                        <p>Mais produtividade<br />no seu dia a dia</p>
                    </div>
                    <h1>Organize suas<br />tarefas <span className="cortitulo">de forma<br />simples</span></h1>
                    <p className="parag2">Crie, gerencie e acompanhe suas<br />tarefas em um só lugar. Tenha mais<br />foco, produtividade e tempo para<br />o que realmente importa.</p>
                    <div className="botoes-inicio">
                        <Link to="cadastro"className="botao-green"><i         className="fa-solid fa-arrow-right"></i>
                            <p>Começar agora</p>
                        </Link>
                        <div className="botao-black">
                            <p>Saiba mais</p>
                        </div>
                    </div>
            </section>

            <div className="beneficios-inicio">
                <aside className="boxflex2">
                    <div><i className="fa-solid fa-bolt-lightning"></i></div>
                    <div className="parag3">
                        <h3>Mais foco</h3>
                        <p>Centralize suas tarefas e matenha<br />o foco no que realmente importa.</p>
                    </div>
                </aside>
                {referenses("fa-solid fa-bars-progress", "Mais produtividade", "Organize seu dia e veja seu progresso.", "#3B82F6", "#DBEAFE")}
                {referenses("fa-regular fa-clock", "Mais tempo","Tenha controle da sua rotina e\n conquiste tempo mais livre", "#7C3AED", "#b870be77")}
            </div>
             
        </>
    )
}
export default Inicio