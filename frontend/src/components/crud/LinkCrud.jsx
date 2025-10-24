import React from 'react'
import { Link } from 'react-router-dom'
import BtnVolver from '../ui/BtnVolver'

const LinkCrud = ({showBackButton = false}) => {
  return (
    <div>
        <div className='d-flex justify-content-around' style={{margin:"20px 180px"}}>
        <Link to={"/alumnos"} className='linkCrud'>Alumnos</Link>
        <Link to={"/docentes"} className='linkCrud'>Docentes</Link>
        <Link to={"/materias"} className='linkCrud'>Materias</Link>
        <Link to={"/plan-de-equivalencias"} className='linkCrud'>Plan de Equivalencias</Link>
        </div>
        <hr className="linea-separadora2" />
          {showBackButton && (
        <BtnVolver rutaVolver={"/crud"} mostrarAgregar="true"/>
          )}

    </div>
  )
}

export default LinkCrud