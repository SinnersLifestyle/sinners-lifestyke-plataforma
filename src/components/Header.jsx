import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {

  const navigate = useNavigate();

  const { usuario, logout } = useAuth();

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  const cerrarSesion = () => {

    logout();

    navigate("/login");

  };

  // =====================================================
  // HEADER
  // =====================================================

  return (

    <header>

      {/* =================================================
          LOGO
      ================================================= */}

      <img
        src={Logo}
        className="logo"
        alt="SINNERS"
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer"
        }}
      />


      {/* =================================================
          MENÚ
      ================================================= */}

      <nav>

        <button
          type="button"
        >
          Eventos
        </button>


        <button
          type="button"
        >
          Productos
        </button>


        {/* ===============================================
            MENÚ EXCLUSIVO SINNERS
        =============================================== */}

        {usuario?.esAdministrador && (

          <button
            type="button"
            onClick={() =>
              navigate(
                "/reservaciones-autorizar"
              )
            }
          >
            Reservaciones por autorizar
          </button>

        )}

      </nav>


      {/* =================================================
          ACCIONES
      ================================================= */}

      <div className="header-actions">

        {!usuario ? (

          <>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Iniciar sesión
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/registro")
              }
            >
              Registro
            </button>

          </>

        ) : (

          <>

            <span
              style={{
                marginRight: "10px"
              }}
            >
              Hola,{" "}
              <strong>
                {usuario.nombre}
              </strong>
            </span>


            <button
              type="button"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

          </>

        )}

      </div>

    </header>

  );

}

export default Header;