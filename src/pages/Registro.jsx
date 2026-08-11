import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Registro.css";

function Registro() {
  const navigate = useNavigate();

  const { solicitarOtp, verificarOtp, login } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    usuario: "",
    password: ""
  });

  const [codigo, setCodigo] = useState("");
  const [mostrarOtp, setMostrarOtp] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const solicitarCodigo = async (e) => {
    e.preventDefault();

    try {
      setCargando(true);

      const codigoGenerado = await solicitarOtp(form);

      console.log("OTP generado:", codigoGenerado);

      setMostrarOtp(true);

      alert("Se ha enviado un código de verificación a tu teléfono.");

    } catch (error) {
      console.error("Error al solicitar OTP:", error);

      alert(
        error.message ||
        "No pudimos completar la solicitud de verificación."
      );
    } finally {
      setCargando(false);
    }
  };

  const verificarCodigo = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) {
      alert("Ingresa el código de verificación.");
      return;
    }

    try {
      setCargando(true);

      const usuarioGuardado = await verificarOtp(
        form.telefono,
        codigo.trim()
      );

      login(usuarioGuardado);

      alert("Bienvenido a SINNERS");

      const rutaPendiente = localStorage.getItem("rutaPendiente");

      if (rutaPendiente) {
        localStorage.removeItem("rutaPendiente");
        navigate(rutaPendiente);
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error al verificar OTP:", error);

      alert(
        error.message ||
        "El código es incorrecto o ya expiró."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">

      <div className="registro-card">

        <h1>SINNERS</h1>

        <h2>
          {mostrarOtp
            ? "Verificar teléfono"
            : "Crear cuenta"}
        </h2>

        {!mostrarOtp ? (

          <form onSubmit={solicitarCodigo}>

            <input
              name="nombre"
              type="text"
              placeholder="Nombre(s)"
              value={form.nombre}
              onChange={manejarCambio}
              required
            />

            <input
              name="apellidos"
              type="text"
              placeholder="Apellidos"
              value={form.apellidos}
              onChange={manejarCambio}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={manejarCambio}
              required
            />

            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={manejarCambio}
              maxLength="10"
              required
            />

            <input
              name="usuario"
              type="text"
              placeholder="Usuario"
              value={form.usuario}
              onChange={manejarCambio}
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
                ? "Enviando..."
                : "Continuar"}
            </button>

          </form>

        ) : (

          <form onSubmit={verificarCodigo}>

            <p>
              Ingresa el código de verificación
              enviado a tu teléfono.
            </p>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChange={(e) =>
                setCodigo(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              maxLength="6"
              required
            />

            <button
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? "Verificando..."
                : "Verificar y crear cuenta"}
            </button>

          </form>

        )}

        <p>
          ¿Ya tienes cuenta?{" "}

          <Link to="/login">
            Inicia sesión
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Registro;