import "./footer.css"

function Footer() {
    return(
        <>
            <footer>
                <div>
                    <img src="./footer.png" alt="logo"/>
                </div>
                <nav>
                    <a href=""><i className="fa-brands fa-github"></i></a>
                    <a href=""><i className="fa-brands fa-youtube"></i></a>
                    <a href=""><i className="fa-brands fa-square-linkedin"></i></a>
                </nav>
                <p>Feito com foco por você. <i className="fa-regular fa-heart"></i></p>
            </footer>
        </>
    )
}

export default Footer
