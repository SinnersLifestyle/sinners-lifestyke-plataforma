import evento1 from "../assets/evento1.jpg";
import evento2 from "../assets/evento2.jpg";
import evento3 from "../assets/evento3.jpg";


function Gallery(){


return(

<section className="gallery">

<h2>
Experiencias Sinners
</h2>


<div>

<img src={evento1}/>
<img src={evento2}/>
<img src={evento3}/>


</div>


</section>


)


}


export default Gallery;