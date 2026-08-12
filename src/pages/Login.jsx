import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL = "https://sinners-api.onrender.com";

// =====================================================
// DATOS DEL PERFIL ADMINISTRATIVO SINNERS
// =====================================================

const SINNERS_USUARIO = "Sinners";
const SINNERS_PASSWORD = "Sinners3261*";

const SINNERS_PERFIL = {
  id: 0,
  nombre: "Sinners",
  apellidos: "club",
  email: "clubsinnersw@gmail.com",
  telefono: "5571110679",
  usuario: "Sinners",
  esAdministrador: true
};

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    telefono: "",
    password: ""
  });

  const [cargando, setCargando] = useState(false);

  // =====================================================
  // CAMBIO DE CAMPOS
  // =====================================================

  const manejarCambio = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // =====================================================
  // INICIAR SESIÓN
  // =====================================================

  const iniciarSesion = async (e) => {

    e.preventDefault();

    try {

      setCargando(true);

      // =================================================
      // ACCESO ADMINISTRATIVO SINNERS
      // =================================================

      if (
        form.telefono === SINNERS_USUARIO &&
        form.password === SINNERS_PASSWORD
      ) {

        console.log(
          "ACCESO ADMINISTRATIVO SINNERS"
        );

        login(SINNERS_PERFIL);

        navigate("/reservaciones-autorizar");

        return;
      }

      // =================================================
      // LOGIN NORMAL DE CLIENTE
      // =================================================

      const respuesta = await fetch(
        `${API_URL}/usuarios`
      );

      if (!respuesta.ok) {

        throw new Error(
          "No se pudo consultar la API."
        );

      }

      const usuarios =
        await respuesta.json();

      console.log(
        "USUARIOS API:",
        usuarios
      );

      // =================================================
      // BUSCAR USUARIO
      // =================================================

      const usuarioEncontrado =
        usuarios.find(
          (usuario) =>
            String(usuario.telefono).trim() ===
              String(form.telefono).trim() &&
            usuario.password ===
              form.password
        );

      console.log(
        "USUARIO ENCONTRADO:",
        usuarioEncontrado
      );

      // =================================================
      // USUARIO NO ENCONTRADO
      // =================================================

      if (!usuarioEncontrado) {

        alert(
          "Teléfono o contraseña incorrectos."
        );

        return;
      }

      // =================================================
      // CREAR SESIÓN DEL CLIENTE
      // =================================================

      const usuarioSesion = {

        id: usuarioEncontrado.id,

        nombre:
          usuarioEncontrado.nombre,

        apellidos:
          usuarioEncontrado.apellidos,

        email:
          usuarioEncontrado.email,

        telefono:
          usuarioEncontrado.telefono,

        usuario:
          usuarioEncontrado.usuario,

        esAdministrador: false

      };

      console.log(
        "USUARIO GUARDADO EN SESIÓN:",
        usuarioSesion
      );

      login(usuarioSesion);

      // =================================================
      // RUTA PENDIENTE
      // =================================================

      const ruta =
        localStorage.getItem(
          "rutaPendiente"
        );

      if (ruta) {

        localStorage.removeItem(
          "rutaPendiente"
        );

        navigate(ruta);

      } else {

        navigate("/");

      }

    } catch (error) {

      console.error(
        "Error al iniciar sesión:",
        error
      );

      alert(
        "No se pudo conectar con SINNERS."
      );

    } finally {

      setCargando(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          SINNERS
        </h1>

        <h2>
          Iniciar sesión
        </h2>


        <form
          onSubmit={iniciarSesion}
        >

          <input
            name="telefono"
            type="text"
            placeholder="Número de celular"
            value={form.telefono}
            onChange={manejarCambio}
            maxLength="15"
            required
          />


          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={manejarCambio}
            required
          />


          <button
            type="submit"
            disabled={cargando}
          >

            {cargando
              ? "Entrando..."
              : "Entrar"}

          </button>

        </form>


        <p>

          ¿No tienes cuenta?{" "}

          <Link to="/registro">
            Crear cuenta
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;