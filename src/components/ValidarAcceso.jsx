import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function ValidarAcceso({ ruta }) {

  const navigate = useNavigate();


  useEffect(() => {


    // Guardamos la pantalla que el usuario quería abrir
    localStorage.setItem(
      "rutaPendiente",
      ruta
    );


    // Revisamos si existe un usuario registrado
    const usuarioRegistrado =
      localStorage.getItem("usuario");



    if(usuarioRegistrado){

      // Si existe cuenta, pedimos login
      navigate("/login");


    }else{

      // Si no existe cuenta, mandamos a registro
      navigate("/registro");

    }


  }, [navigate, ruta]);



  return null;

}


export default ValidarAcceso;