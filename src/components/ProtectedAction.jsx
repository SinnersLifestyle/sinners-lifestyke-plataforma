import { useNavigate } from "react-router-dom";

function ProtectedAction({ children }) {

  const navigate = useNavigate();

  const validarAcceso = () => {

    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      return true;
    }

    navigate("/registro");
    return false;

  };


  return children(validarAcceso);

}

export default ProtectedAction;