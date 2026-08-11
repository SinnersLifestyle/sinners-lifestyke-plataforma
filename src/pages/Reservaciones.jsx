import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import "./Reservaciones.css";

const API_URL = "https://sinners-api.onrender.com";

function Reservaciones() {

  const { usuario } = useAuth();
  const location = useLocation();

  // =====================================================
  // INICIAR PANTALLA DESDE ARRIBA
  // =====================================================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // DATOS DEL EVENTO
  // =====================================================

  const eventoSeleccionado =
    location.state?.evento || "";

  const fechaSeleccionada =
    location.state?.fecha || "";

  const imagenEvento =
    location.state?.imagen || "";

  // =====================================================
  // FORMULARIO
  // =====================================================

  const [form, setForm] = useState({
    numeroMesas: "",
    personas: ""
  });

  const [mensaje, setMensaje] = useState("");

  const [mostrarResumen, setMostrarResumen] =
    useState(false);

  // =====================================================
  // CAMBIO DE CAMPOS
  // =====================================================

  const manejarCambio = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setMensaje("");
  };

  // =====================================================
  // CAPACIDAD
  // =====================================================

  const capacidadMaxima =
    form.numeroMesas
      ? Number(form.numeroMesas) * 3
      : 0;

  // =====================================================
  // CREAR RESERVACIÓN
  // =====================================================

  const enviarReservacion = async (e) => {

    console.log(
      "CONFIRMAR RESERVACIÓN - BOTÓN PRESIONADO"
    );

    e.preventDefault();

    // ===================================================
    // VALIDAR SESIÓN
    // ===================================================

    if (!usuario) {

      setMensaje(
        "Debes iniciar sesión para realizar una reservación."
      );

      return;
    }

    const mesas = Number(form.numeroMesas);
    const personas = Number(form.personas);

    // ===================================================
    // VALIDAR MESAS Y PERSONAS
    // ===================================================

    if (!mesas || !personas) {

      setMensaje(
        "Selecciona el número de mesas y personas."
      );

      return;
    }

    // ===================================================
    // VALIDAR CAPACIDAD
    // ===================================================

    if (personas > mesas * 3) {

      const mesasNecesarias =
        Math.ceil(personas / 3);

      setMensaje(
        `Para ${personas} personas necesitas reservar ${mesasNecesarias} mesas. Cada mesa tiene capacidad máxima para 3 personas.`
      );

      return;
    }

    // ===================================================
    // VALIDAR MÁXIMO DE MESAS
    // ===================================================

    if (mesas > 3) {

      setMensaje(
        "Para solicitar más de 3 mesas, comunícate directamente con SINNERS al 55 7111 0679."
      );

      return;
    }

    // ===================================================
    // VALIDAR EVENTO
    // ===================================================

    if (!eventoSeleccionado) {

      setMensaje(
        "No se encontró el evento seleccionado."
      );

      return;
    }

    // ===================================================
    // CONVERTIR FECHA
    // =====================================================

    const fechaConvertida =
      convertirFecha(fechaSeleccionada);

    if (!fechaConvertida) {

      setMensaje(
        "No se pudo determinar la fecha del evento."
      );

      return;
    }

    // ===================================================
    // DATOS PARA API
    // ===================================================

    console.log(
      "DATOS QUE SE ENVIARÁN A LA API:",
      {
        evento: eventoSeleccionado,
        fechaReserva: fechaConvertida,
        numeroMesas: mesas,
        personas: personas,
        usuarioId: usuario.id
      }
    );

    try {

      // =================================================
      // ENVIAR A API
      // =================================================

      const respuesta = await fetch(
        `${API_URL}/reservaciones?usuarioId=${usuario.id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            evento: eventoSeleccionado,

            fechaReserva: fechaConvertida,

            numeroMesas: mesas,

            personas: personas

          })
        }
      );

      // =================================================
      // MANEJAR ERROR
      // =================================================

      if (!respuesta.ok) {

        let mensajeError =
          "No se pudo realizar la reservación.";

        try {

          const texto =
            await respuesta.text();

          if (texto) {
            mensajeError = texto;
          }

        } catch (error) {

          console.error(
            "Error leyendo respuesta:",
            error
          );

        }

        throw new Error(mensajeError);
      }

      // =================================================
      // RESERVACIÓN REGISTRADA
      // =================================================

      console.log(
        "RESERVACIÓN REGISTRADA CORRECTAMENTE"
      );

      setMensaje("");

      setMostrarResumen(true);

    } catch (error) {

      console.error(
        "Error al realizar reservación:",
        error
      );

      setMensaje(
        error.message ||
        "No se pudo realizar la reservación."
      );
    }
  };

  // =====================================================
  // CANCELAR RESUMEN
  // =====================================================

  const cancelarResumen = () => {

    setMostrarResumen(false);

    setMensaje(
      "La reservación quedó registrada. Puedes continuar cuando estés listo."
    );
  };

  // =====================================================
  // ENVIAR A WHATSAPP
  // =====================================================

  const confirmarWhatsApp = () => {

    const nombreCliente =
      `${usuario?.nombre || ""} ${usuario?.apellidos || ""}`.trim();

    const telefono =
      usuario?.telefono || "";

    const email =
      usuario?.email || "";

    const mesas =
      Number(form.numeroMesas);

    const personas =
      Number(form.personas);

    const mensajeWhatsApp =
      `Hola SINNERS, quiero confirmar mi reservación.%0A%0A` +
      `*Cliente:* ${nombreCliente}%0A` +
      `*Teléfono:* ${telefono}%0A` +
      `*Email:* ${email}%0A%0A` +
      `*Evento:* ${eventoSeleccionado}%0A` +
      `*Fecha:* ${fechaSeleccionada}%0A` +
      `*Mesas:* ${mesas}%0A` +
      `*Personas:* ${personas}%0A%0A` +
      `Mi reservación ya fue registrada y deseo confirmar el envío de la solicitud.`;

    const numeroSinners =
      "525571110679";

    const urlWhatsApp =
      `https://wa.me/${numeroSinners}?text=${mensajeWhatsApp}`;

    window.open(
      urlWhatsApp,
      "_blank"
    );
  };

  return (

    <div className="reservacion-page">

      <div className="reservacion-container">

        <img
          src={Logo}
          className="reservacion-logo"
          alt="SINNERS"
        />

        <h1>
          Reservación SINNERS
        </h1>


        {/* =================================================
            EVENTO
        ================================================= */}

        <div className="evento-reservacion">

          {imagenEvento && (

            <div className="evento-imagen-container">

              <img
                src={imagenEvento}
                alt={eventoSeleccionado}
                className="evento-imagen"
              />

            </div>

          )}

          <div className="evento-datos">

            <span className="dato-label">
              EVENTO
            </span>

            <h2>
              {eventoSeleccionado}
            </h2>

            <span className="dato-label">
              FECHA
            </span>

            <p>
              {fechaSeleccionada}
            </p>

          </div>

        </div>


        {/* =================================================
            DATOS DEL CLIENTE
        ================================================= */}

        <div className="cliente-box">

          <h3>
            Datos del cliente
          </h3>

          <div className="cliente-datos">

            <div>

              <span>
                Nombre
              </span>

              <strong>
                {usuario?.nombre}{" "}
                {usuario?.apellidos}
              </strong>

            </div>

            <div>

              <span>
                Email
              </span>

              <strong>
                {usuario?.email}
              </strong>

            </div>

            <div>

              <span>
                Teléfono
              </span>

              <strong>
                {usuario?.telefono}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            FORMULARIO
        ================================================= */}

        {!mostrarResumen && (

          <form
            className="reservacion-form"
            onSubmit={enviarReservacion}
          >

            <h3>
              Datos de la reservación
            </h3>


            <div className="selecciones">


              {/* MESAS */}

              <div className="campo-reserva">

                <label htmlFor="numeroMesas">
                  Número de mesas
                </label>

                <select
                  id="numeroMesas"
                  name="numeroMesas"
                  value={form.numeroMesas}
                  onChange={manejarCambio}
                  required
                >

                  <option value="">
                    Selecciona
                  </option>

                  <option value="1">
                    1 mesa
                  </option>

                  <option value="2">
                    2 mesas
                  </option>

                  <option value="3">
                    3 mesas
                  </option>

                </select>

              </div>


              {/* PERSONAS */}

              <div className="campo-reserva">

                <label htmlFor="personas">
                  Número de personas
                </label>

                <select
                  id="personas"
                  name="personas"
                  value={form.personas}
                  onChange={manejarCambio}
                  required
                >

                  <option value="">
                    Selecciona
                  </option>

                  {Array.from(
                    { length: 9 },
                    (_, index) => index + 1
                  ).map((numero) => (

                    <option
                      key={numero}
                      value={numero}
                    >

                      {numero}{" "}

                      {numero === 1
                        ? "persona"
                        : "personas"}

                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* =================================================
                AVISO DE CAPACIDAD
            ================================================= */}

            {form.numeroMesas && (

              <div className="capacidad-info">

                Capacidad máxima con{" "}

                <strong>
                  {form.numeroMesas}
                  {form.numeroMesas === "1"
                    ? " mesa"
                    : " mesas"}
                </strong>

                :{" "}

                <strong>
                  {capacidadMaxima} personas
                </strong>

              </div>

            )}


            {/* =================================================
                MENSAJE
            ================================================= */}

            {mensaje && (

              <div
                className="mensaje-reservacion error"
              >

                {mensaje}

              </div>

            )}


            {/* =================================================
                AVISO
            ================================================= */}

            <div className="aviso-reservacion">

              <strong>
                Importante
              </strong>

              <p>
                Tu reservación se respeta hasta las{" "}

                <strong>
                  11:30 PM.
                </strong>

              </p>

              <p>
                Cada mesa tiene capacidad máxima
                para{" "}

                <strong>
                  3 personas.
                </strong>

              </p>

              <p>
                Para solicitar más de 3 mesas,
                comunícate directamente con SINNERS
                al{" "}

                <strong>
                  55 7111 0679
                </strong>.

              </p>

            </div>


            {/* =================================================
                BOTÓN
            ================================================= */}

            <button
              type="submit"
              className="btn-confirmar"
            >

              Confirmar reservación

            </button>

          </form>

        )}


        {/* =====================================================
            RESUMEN DE RESERVACIÓN
        ===================================================== */}

        {mostrarResumen && (

          <div className="resumen-reservacion">

            <h2>
              Resumen de tu reservación
            </h2>

            <p>
              Revisa cuidadosamente los datos antes
              de continuar.
            </p>


            <div className="resumen-datos">

              <div>
                <span>
                  Cliente
                </span>

                <strong>
                  {usuario?.nombre}{" "}
                  {usuario?.apellidos}
                </strong>
              </div>


              <div>
                <span>
                  Teléfono
                </span>

                <strong>
                  {usuario?.telefono}
                </strong>
              </div>


              <div>
                <span>
                  Evento
                </span>

                <strong>
                  {eventoSeleccionado}
                </strong>
              </div>


              <div>
                <span>
                  Fecha
                </span>

                <strong>
                  {fechaSeleccionada}
                </strong>
              </div>


              <div>
                <span>
                  Mesas
                </span>

                <strong>
                  {form.numeroMesas}
                </strong>
              </div>


              <div>
                <span>
                  Personas
                </span>

                <strong>
                  {form.personas}
                </strong>
              </div>

            </div>


            <div className="resumen-aviso">

              <strong>
                Reservación registrada
              </strong>

              <p>
                Tu reservación ya fue registrada en
                el sistema de SINNERS.
              </p>

              <p>
                Al confirmar, se abrirá WhatsApp
                para enviar estos datos al equipo
                de SINNERS.
              </p>

            </div>


            {/* =================================================
                BOTONES
            ================================================= */}

            <div className="resumen-botones">

              <button
                type="button"
                className="btn-whatsapp"
                onClick={confirmarWhatsApp}
              >

                Confirmar y enviar por WhatsApp

              </button>


              <button
                type="button"
                className="btn-cancelar-resumen"
                onClick={cancelarResumen}
              >

                Cancelar

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   CONVERTIR FECHA
========================================================= */

function convertirFecha(fecha) {

  if (!fecha) {
    return null;
  }

  const meses = {

    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12"

  };

  const partes = fecha
    .toLowerCase()
    .replace(" de ", " ")
    .trim()
    .split(/\s+/);

  if (partes.length < 2) {
    return null;
  }

  const dia = partes[0];
  const mesNombre = partes[1];

  const mes = meses[mesNombre];

  if (!mes) {
    return null;
  }

  const año = "2026";

  return `${año}-${mes}-${dia.padStart(2, "0")}`;
}

export default Reservaciones;