import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";


function Header(){

  const navigate = useNavigate();


  return (

    <header>


      <img
        src={Logo}
        className="logo"
        alt="SINNERS"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      />



      <nav>


        <button>
          Eventos
        </button>



        <button>
          Productos
        </button>


      </nav>



      <div className="header-actions">


        <button
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>



        <button
          onClick={() => navigate("/registro")}
        >
          Registro
        </button>


      </div>


    </header>

  );

}


export default Header;