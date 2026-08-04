import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";


function Header(){

  const navigate = useNavigate();


  const validarModulo = (ruta) => {


    // Guardamos el módulo que el usuario quería abrir
    localStorage.setItem(
      "rutaPendiente",
      ruta
    );


    // Revisamos si existe una cuenta registrada
    const usuarioRegistrado =
      localStorage.getItem("usuario");



    if(usuarioRegistrado){

      // Si ya tiene cuenta, debe iniciar sesión
      navigate("/login");


    }else{

      // Si no tiene cuenta, debe registrarse
      navigate("/registro");

    }


  };



  return(

    <header>


      <img
        src={Logo}
        className="logo"
        alt="SINNERS"
      />



      <nav>


        <button
          onClick={() => navigate("/")}
        >
          Inicio
        </button>



        <button>
          Eventos
        </button>



        <button
          onClick={() => validarModulo("/reservaciones")}
        >
          Reservaciones
        </button>



        <button
          onClick={() => validarModulo("/productos")}
        >
          Productos
        </button>



      </nav>


    </header>

  );

}


export default Header;