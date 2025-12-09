import React from 'react'
import BtnVolver from '../../components/ui/BtnVolver'
import HeaderPages from '../../components/ui/HeaderPages'
import LineaSeparadora from '../../components/ui/LineaSeparadora'
import HeaderInfoCurso from '../../components/curso/HeaderInfoCurso'
import BodyAsistenciaCurso from '../../components/curso/BodyAsistenciaCurso'

const AsistenciaCurso = () => {
  return (
    <div>
      <BtnVolver rutaVolver={"/consulta-curso"}/>
        <HeaderPages titulo="Toma de Asistencia" icono="assignment_turned_in"/>
        <LineaSeparadora/>
        <HeaderInfoCurso/>
        <BodyAsistenciaCurso/>
    </div>
  )
}

export default AsistenciaCurso