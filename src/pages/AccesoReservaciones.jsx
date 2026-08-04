import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Reservaciones from "./Reservaciones";


function AccesoReservaciones(){

  const { usuario } = useAuth();
  const navigate = useNavigate();


  if(!usuario){

    navigate("/registro");

    return null;

  }


  return <Reservaciones />;

}


export default AccesoReservaciones;