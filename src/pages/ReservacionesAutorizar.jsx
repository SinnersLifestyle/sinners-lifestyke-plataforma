import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://sinners-api.onrender.com";

function ReservacionesAutorizar() {

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [reservaciones, setReservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // =====================================================
  // VALIDAR ACCESO
  // =====================================================

  useEffect(() => {

    if (!usuario?.esAdministrador) {

      navigate("/");

      return;
    }

    cargarReservaciones();

  }, [usuario, navigate]);

  // =====================================================
  // OBTENER RESERVACIONES
  // =====================================================

  const cargarReservaciones = async () => {

    try {

      setCargando(true);
      setMensaje("");

      const respuesta = await fetch(
        `${API_URL}/reservaciones`
      );

      if (!respuesta.ok) {

        throw new Error(
          "No se pudieron obtener las reservaciones."
        );

      }

      const datos = await respuesta.json();

      console.log(
        "RESERVACIONES:",
        datos
      );

      // =================================================
      // MOSTRAR SOLAMENTE PENDIENTES
      // =================================================

      const pendientes = datos.filter(
        (reservacion) =>
          reservacion.estado === "REGISTRADA" ||
          reservacion.estado === "SOLICITUD_ENVIADA"
      );

      setReservaciones(pendientes);

    } catch (error) {

      console.error(
        "Error obteniendo reservaciones:",
        error
      );

      setMensaje(
        error.message ||
        "No se pudieron cargar las reservaciones."
      );

    } finally {

      setCargando(false);

    }
  };

  // =====================================================
  // FORMATO DE FECHA
  // =====================================================

  const formatearFecha = (fecha) => {

    if (!fecha) {
      return "Sin fecha";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  const cerrarSesion = () => {

    sessionStorage.removeItem("sesion");

    navigate("/login");

    window.location.reload();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "30px 20px"
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap"
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                color: "#d4af37"
              }}
            >
              SINNERS
            </h1>

            <p
              style={{
                marginTop: "8px"
              }}
            >
              Reservaciones por autorizar
            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >

            <button
              type="button"
              onClick={cargarReservaciones}
              style={{
                padding: "10px 16px",
                cursor: "pointer"
              }}
            >
              Actualizar
            </button>


            <button
              type="button"
              onClick={cerrarSesion}
              style={{
                padding: "10px 16px",
                cursor: "pointer"
              }}
            >
              Cerrar sesión
            </button>

          </div>

        </div>


        {/* =================================================
            CARGANDO
        ================================================= */}

        {cargando && (

          <div
            style={{
              padding: "30px",
              textAlign: "center"
            }}
          >
            Cargando reservaciones...
          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!cargando && mensaje && (

          <div
            style={{
              background: "#3a1515",
              border: "1px solid #a33",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}
          >
            {mensaje}
          </div>

        )}


        {/* =================================================
            SIN RESERVACIONES
        ================================================= */}

        {!cargando &&
          !mensaje &&
          reservaciones.length === 0 && (

            <div
              style={{
                background: "#1c1c1c",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >

              <h2>
                No hay reservaciones pendientes
              </h2>

              <p>
                Actualmente no existen reservaciones
                por autorizar.
              </p>

            </div>

          )}


        {/* =================================================
            RESERVACIONES
        ================================================= */}

        {!cargando &&
          reservaciones.length > 0 && (

            <div
              style={{
                display: "grid",
                gap: "20px"
              }}
            >

              {reservaciones.map(
                (reservacion) => (

                  <div
                    key={reservacion.id}
                    style={{
                      background: "#1c1c1c",
                      border:
                        "1px solid #333",
                      borderRadius: "10px",
                      padding: "20px"
                    }}
                  >

                    {/* =====================================
                        CABECERA
                    ===================================== */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginBottom: "20px"
                      }}
                    >

                      <h2
                        style={{
                          margin: 0,
                          color: "#d4af37"
                        }}
                      >
                        Reservación #
                        {reservacion.id}
                      </h2>


                      <span
                        style={{
                          padding:
                            "6px 12px",
                          borderRadius:
                            "20px",
                          background:
                            "#5a4200",
                          color:
                            "#ffd966",
                          fontWeight:
                            "bold"
                        }}
                      >
                        {reservacion.estado}
                      </span>

                    </div>


                    {/* =====================================
                        DATOS
                    ===================================== */}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "15px"
                      }}
                    >

                      <div>

                        <strong>
                          Cliente
                        </strong>

                        <p>
                          {reservacion.usuario?.nombre}{" "}
                          {reservacion.usuario?.apellidos}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Teléfono
                        </strong>

                        <p>
                          {reservacion.usuario?.telefono}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Email
                        </strong>

                        <p>
                          {reservacion.usuario?.email}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Evento
                        </strong>

                        <p>
                          {reservacion.evento}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Fecha
                        </strong>

                        <p>
                          {formatearFecha(
                            reservacion.fechaReserva
                          )}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Mesas
                        </strong>

                        <p>
                          {reservacion.numeroMesas}
                        </p>

                      </div>


                      <div>

                        <strong>
                          Personas
                        </strong>

                        <p>
                          {reservacion.personas}
                        </p>

                      </div>

                    </div>


                    {/* =====================================
                        ACCIONES
                    ===================================== */}

                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap"
                      }}
                    >

                      <button
                        type="button"
                        disabled
                        style={{
                          padding:
                            "10px 18px",
                          cursor:
                            "not-allowed",
                          opacity: 0.5
                        }}
                      >
                        Aceptar
                      </button>


                      <button
                        type="button"
                        disabled
                        style={{
                          padding:
                            "10px 18px",
                          cursor:
                            "not-allowed",
                          opacity: 0.5
                        }}
                      >
                        Rechazar
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>

  );
}

export default ReservacionesAutorizar;