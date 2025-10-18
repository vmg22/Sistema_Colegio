import React from 'react'
import { useState } from 'react'



const Dashboard = () => {

  const [tipoConsulta, setConsulta]= useState("alumno");
  // const [resultado, setResultado]= useState(null);
  // const [cargando, setCargando]= useState(false);
  



  return (
    <div classname= "nombre_vista">
      <h1>Consulta Academica</h1>

      {/*seleccion x tipo de consultas alumno / curso*/}
      <button
      clasname={`btn-tipo ${tipoConsulta === 'alumno' ? 'activo' : ""}`}
      onClick={()=> setConsulta("alumno")}
      >
        Consulta por Alumno
      </button>

      <button
      clasname={`btn-tipo ${tipoConsulta === 'curso' ? 'activo' : ""}`}
      onClick={()=> setConsulta("curso")}
      >
        Consulta por Curso
      </button>

      






      {/* formulario de tipo de busqueda  */}
      














    </div>
  )
}
export default Dashboard
