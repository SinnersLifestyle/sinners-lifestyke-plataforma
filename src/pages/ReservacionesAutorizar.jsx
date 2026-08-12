import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://sinners-api.onrender.com";

function ReservacionesAutorizar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [reservaciones, setReservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] = useState(null);

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
        "RESERVACIONES API:",
        datos
      );

      // =================================================
      // SOLO MOSTRAR RESERVACIONES QUE REQUIEREN
      // ACCIÓN ADMINISTRATIVA
      //
      // REGISTRADA -> ACEPTAR / RECHAZAR
      // ACEPTADA   -> LLEGÓ / NO_SHOW
      //
      // LLEGO, NO_SHOW Y CANCELADA NO SE MUESTRAN
      // =================================================

      const pendientes = datos.filter(
        (reservacion) =>
          reservacion.estado === "REGISTRADA" ||
          reservacion.estado === "ACEPTADA"
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
  // AGRUPAR RESERVACIONES POR EVENTO + FECHA
  // =====================================================

  const grupos = reservaciones.reduce(
    (acumulador, reservacion) => {
      const evento =
        reservacion.evento ||
        "Evento sin nombre";

      const fecha =
        reservacion.fechaReserva ||
        null;

      const clave =
        `${evento}|${fecha || "sin-fecha"}`;

      if (!acumulador[clave]) {
        acumulador[clave] = {
          evento,
          fecha,
          reservaciones: []
        };
      }

      acumulador[clave].reservaciones.push(
        reservacion
      );

      return acumulador;
    },
    {}
  );

  // =====================================================
  // ORDENAR EVENTOS POR FECHA
  // =====================================================

  const eventosOrdenados =
    Object.values(grupos).sort(
      (a, b) => {

        if (!a.fecha) {
          return 1;
        }

        if (!b.fecha) {
          return -1;
        }

        return a.fecha.localeCompare(
          b.fecha
        );
      }
    );

  // =====================================================
  // MOSTRAR SOLO LOS 5 EVENTOS MÁS PRÓXIMOS
  // =====================================================

  const eventosVisibles =
    eventosOrdenados.slice(0, 5);

  // =====================================================
  // CAMBIAR ESTADO
  // =====================================================

  const cambiarEstado = async (
    id,
    accion
  ) => {
    try {
      setProcesando(id);
      setMensaje("");

      let endpoint = "";

      // =================================================
      // ACEPTAR
      // =================================================

      if (accion === "aceptar") {
        endpoint =
          `${API_URL}/reservaciones/${id}/aceptar`;
      }

      // =================================================
      // RECHAZAR
      // =================================================

      if (accion === "rechazar") {
        endpoint =
          `${API_URL}/reservaciones/${id}/cancelar`;
      }

      // =================================================
      // LLEGÓ
      // =================================================

      if (accion === "llego") {
        endpoint =
          `${API_URL}/reservaciones/${id}/llego`;
      }

      // =================================================
      // NO_SHOW
      // =================================================

      if (accion === "no-show") {
        endpoint =
          `${API_URL}/reservaciones/${id}/no-show`;
      }

      // =================================================
      // VALIDAR ENDPOINT
      // =================================================

      if (!endpoint) {
        throw new Error(
          "Acción de reservación no válida."
        );
      }

      // =================================================
      // LLAMAR API
      // =================================================

      const respuesta = await fetch(
        endpoint,
        {
          method: "PUT"
        }
      );

      // =================================================
      // ERROR API
      // =================================================

      if (!respuesta.ok) {
        let mensajeError =
          "No se pudo actualizar la reservación.";

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

        throw new Error(
          mensajeError
        );
      }

      // =================================================
      // LEER RESPUESTA
      // =================================================

      const reservacionActualizada =
        await respuesta.json();

      console.log(
        "RESERVACIÓN ACTUALIZADA:",
        reservacionActualizada
      );

      // =================================================
      // ACTUALIZAR PANTALLA
      //
      // Si queda REGISTRADA o ACEPTADA,
      // continúa visible.
      //
      // Si pasa a CANCELADA, LLEGO o NO_SHOW,
      // desaparece de esta pantalla.
      // =================================================

      setReservaciones(
        (actuales) =>
          actuales
            .map(
              (reservacion) =>
                reservacion.id === id
                  ? reservacionActualizada
                  : reservacion
            )
            .filter(
              (reservacion) =>
                reservacion.estado ===
                  "REGISTRADA" ||
                reservacion.estado ===
                  "ACEPTADA"
            )
      );

    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );

      setMensaje(
        error.message ||
          "No se pudo actualizar la reservación."
      );

    } finally {
      setProcesando(null);
    }
  };

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  const cerrarSesion = () => {
    logout();
    navigate("/login");
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
              Reservaciones por evento
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
              disabled={cargando}
              style={{
                padding: "10px 16px",
                cursor: cargando
                  ? "not-allowed"
                  : "pointer"
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
            INFORMACIÓN DE EVENTOS
        ================================================= */}

        {!cargando &&
          eventosOrdenados.length > 5 && (
            <div
              style={{
                background: "#1c1c1c",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "15px 20px",
                marginBottom: "20px",
                color: "#ccc"
              }}
            >
              Mostrando los{" "}
              <strong
                style={{
                  color: "#d4af37"
                }}
              >
                5 eventos más próximos
              </strong>
              . Los eventos restantes permanecen
              registrados en la base de datos.
            </div>
          )}

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

        {!cargando &&
          mensaje && (
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
                Actualmente no existen
                reservaciones que requieran
                acción.
              </p>

            </div>
          )}

        {/* =================================================
            EVENTOS
        ================================================= */}

        {!cargando &&
          eventosVisibles.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "30px"
              }}
            >

              {eventosVisibles.map(
                (grupo) => (
                  <div
                    key={
                      `${grupo.evento}-` +
                      `${grupo.fecha}`
                    }
                    style={{
                      background: "#181818",
                      border:
                        "1px solid #444",
                      borderRadius: "12px",
                      overflow: "hidden"
                    }}
                  >

                    {/* =====================================
                        CABECERA DEL EVENTO
                    ===================================== */}

                    <div
                      style={{
                        background: "#222",
                        padding: "20px",
                        borderBottom:
                          "1px solid #444"
                      }}
                    >

                      <h2
                        style={{
                          margin: 0,
                          color: "#d4af37"
                        }}
                      >
                        {grupo.evento}
                      </h2>

                      <p
                        style={{
                          margin:
                            "8px 0 0",
                          fontSize: "16px"
                        }}
                      >
                        Fecha:{" "}
                        <strong>
                          {formatearFecha(
                            grupo.fecha
                          )}
                        </strong>
                      </p>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          color: "#bbb"
                        }}
                      >
                        {
                          grupo
                            .reservaciones
                            .length
                        }{" "}
                        reservación
                        {grupo
                          .reservaciones
                          .length !== 1
                          ? "es"
                          : ""}
                      </p>

                    </div>

                    {/* =====================================
                        RESERVACIONES DEL EVENTO
                    ===================================== */}

                    <div
                      style={{
                        display: "grid",
                        gap: "15px",
                        padding: "20px"
                      }}
                    >

                      {grupo.reservaciones.map(
                        (reservacion) => {

                          const estaProcesando =
                            procesando ===
                            reservacion.id;

                          return (
                            <div
                              key={
                                reservacion.id
                              }
                              style={{
                                background:
                                  "#1c1c1c",
                                border:
                                  "1px solid #333",
                                borderRadius:
                                  "10px",
                                padding:
                                  "20px"
                              }}
                            >

                              {/* =========================
                                  CABECERA RESERVACIÓN
                              ========================= */}

                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  gap: "15px",
                                  flexWrap:
                                    "wrap",
                                  marginBottom:
                                    "20px"
                                }}
                              >

                                <h3
                                  style={{
                                    margin: 0,
                                    color:
                                      "#fff"
                                  }}
                                >
                                  Reservación #
                                  {
                                    reservacion.id
                                  }
                                </h3>

                                <span
                                  style={{
                                    padding:
                                      "6px 12px",
                                    borderRadius:
                                      "20px",
                                    background:
                                      reservacion.estado ===
                                      "REGISTRADA"
                                        ? "#5a4200"
                                        : "#164a25",
                                    color:
                                      reservacion.estado ===
                                      "REGISTRADA"
                                        ? "#ffd966"
                                        : "#8ff0a4",
                                    fontWeight:
                                      "bold"
                                  }}
                                >
                                  {
                                    reservacion.estado
                                  }
                                </span>

                              </div>

                              {/* =========================
                                  DATOS CLIENTE
                              ========================= */}

                              <div
                                style={{
                                  display:
                                    "grid",
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
                                    {
                                      reservacion
                                        .usuario
                                        ?.nombre
                                    }{" "}
                                    {
                                      reservacion
                                        .usuario
                                        ?.apellidos
                                    }
                                  </p>
                                </div>

                                <div>
                                  <strong>
                                    Teléfono
                                  </strong>

                                  <p>
                                    {
                                      reservacion
                                        .usuario
                                        ?.telefono
                                    }
                                  </p>
                                </div>

                                <div>
                                  <strong>
                                    Email
                                  </strong>

                                  <p>
                                    {
                                      reservacion
                                        .usuario
                                        ?.email
                                    }
                                  </p>
                                </div>

                                <div>
                                  <strong>
                                    Mesas
                                  </strong>

                                  <p>
                                    {
                                      reservacion
                                        .numeroMesas
                                    }
                                  </p>
                                </div>

                                <div>
                                  <strong>
                                    Personas
                                  </strong>

                                  <p>
                                    {
                                      reservacion
                                        .personas
                                    }
                                  </p>
                                </div>

                              </div>

                              {/* =========================
                                  ACCIONES
                              ========================= */}

                              <div
                                style={{
                                  marginTop:
                                    "20px",
                                  display:
                                    "flex",
                                  gap: "12px",
                                  flexWrap:
                                    "wrap"
                                }}
                              >

                                {/* =================================
                                    REGISTRADA
                                ================================= */}

                                {reservacion.estado ===
                                  "REGISTRADA" && (
                                  <>

                                    <button
                                      type="button"
                                      disabled={
                                        estaProcesando
                                      }
                                      onClick={() =>
                                        cambiarEstado(
                                          reservacion.id,
                                          "aceptar"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "11px 20px",
                                        cursor:
                                          estaProcesando
                                            ? "not-allowed"
                                            : "pointer",
                                        background:
                                          "#1d6b35",
                                        color:
                                          "#fff",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        fontWeight:
                                          "bold",
                                        opacity:
                                          estaProcesando
                                            ? 0.5
                                            : 1
                                      }}
                                    >
                                      {estaProcesando
                                        ? "Procesando..."
                                        : "Aceptar"}
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        estaProcesando
                                      }
                                      onClick={() =>
                                        cambiarEstado(
                                          reservacion.id,
                                          "rechazar"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "11px 20px",
                                        cursor:
                                          estaProcesando
                                            ? "not-allowed"
                                            : "pointer",
                                        background:
                                          "#8b2020",
                                        color:
                                          "#fff",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        fontWeight:
                                          "bold",
                                        opacity:
                                          estaProcesando
                                            ? 0.5
                                            : 1
                                      }}
                                    >
                                      {estaProcesando
                                        ? "Procesando..."
                                        : "Rechazar"}
                                    </button>

                                  </>
                                )}

                                {/* =================================
                                    ACEPTADA
                                ================================= */}

                                {reservacion.estado ===
                                  "ACEPTADA" && (
                                  <>

                                    <button
                                      type="button"
                                      disabled={
                                        estaProcesando
                                      }
                                      onClick={() =>
                                        cambiarEstado(
                                          reservacion.id,
                                          "llego"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "11px 20px",
                                        cursor:
                                          estaProcesando
                                            ? "not-allowed"
                                            : "pointer",
                                        background:
                                          "#1d6b35",
                                        color:
                                          "#fff",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        fontWeight:
                                          "bold",
                                        opacity:
                                          estaProcesando
                                            ? 0.5
                                            : 1
                                      }}
                                    >
                                      {estaProcesando
                                        ? "Procesando..."
                                        : "LLEGÓ"}
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        estaProcesando
                                      }
                                      onClick={() =>
                                        cambiarEstado(
                                          reservacion.id,
                                          "no-show"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "11px 20px",
                                        cursor:
                                          estaProcesando
                                            ? "not-allowed"
                                            : "pointer",
                                        background:
                                          "#8b2020",
                                        color:
                                          "#fff",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        fontWeight:
                                          "bold",
                                        opacity:
                                          estaProcesando
                                            ? 0.5
                                            : 1
                                      }}
                                    >
                                      {estaProcesando
                                        ? "Procesando..."
                                        : "NO_SHOW"}
                                    </button>

                                  </>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

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