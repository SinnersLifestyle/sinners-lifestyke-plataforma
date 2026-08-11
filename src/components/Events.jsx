import { useNavigate } from "react-router-dom";

import evento01 from "../assets/evento-01-12 Agosto Parejas Atrevidas.png";
import evento02 from "../assets/evento-02-22 Agosto Cumpleaños Oswaldo_Maggie_Mariana.png";
import evento03 from "../assets/evento-03-29 Agosto Cumpleaños Danna.png";

function Events() {

  const navigate = useNavigate();

  const eventos = [
    {
      nombre: "Parejas Atrevidas",
      fecha: "12 de agosto",
      imagen: evento01
    },
    {
      nombre: "Cumpleaños Oswaldo / Maggie / Mariana",
      fecha: "22 de agosto",
      imagen: evento02
    },
    {
      nombre: "Cumpleaños Danna",
      fecha: "29 de agosto",
      imagen: evento03
    }
  ];

  const reservarEvento = (evento) => {

    navigate("/reservaciones", {
      state: {
        evento: evento.nombre,
        fecha: evento.fecha,
        imagen: evento.imagen
      }
    });

  };

  return (

    <section className="section">

      <h2>
        Próximos Eventos
      </h2>

      <div className="events-grid">

        {eventos.map((evento, index) => (

          <div
            className="event-card"
            key={index}
          >

            <img
              src={evento.imagen}
              alt={evento.nombre}
            />

            <div className="event-info">

              <h3>
                {evento.nombre}
              </h3>

              <p>
                {evento.fecha}
              </p>

              <button
                type="button"
                onClick={() => reservarEvento(evento)}
              >
                Reservar
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Events;