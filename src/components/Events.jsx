import eventoAgosto from "../assets/evento-01-agosto.jpg";


function Events() {

  return (

    <section className="section">

      <h2>
        Próximo Evento
      </h2>


      <div className="event-feature">


        <img 
          src={eventoAgosto} 
          alt="Evento 01 de Agosto Sinners"
        />


        <div className="event-info">

          <h3>
            Sinners
          </h3>


          <p>
            01 de Agosto
          </p>


          <button>
            Reservaciones
          </button>


        </div>


      </div>


    </section>

  );

}


export default Events;