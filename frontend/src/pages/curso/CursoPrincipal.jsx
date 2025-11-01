import React from 'react'
import BtnVolver from '../../components/ui/BtnVolver'
import HeaderPages from '../../components/ui/HeaderPages'
import LineaSeparadora from '../../components/ui/LineaSeparadora'
import CardNavegacion from '../../components/ui/CardNavegacion'

const CursoPrincipal = () => {
    const navigationCards = [
    {
      to: "/asistencia-curso",
      label: "Asistencias",
      icon: "assignment_turned_in",
      color: "#2563EB",
    },
    {
      to: "/notas-curso",
      label: "Notas",
      icon: "assignment",
      color: "#2563EB",
    },
  ];

  return (
    <div>
        <BtnVolver rutaVolver={"/"}/>
        <HeaderPages titulo="Información del Curso" icono="search"/>
        <LineaSeparadora/>
        <div style={{marginTop:"80px"}}>
        <CardNavegacion cardData={navigationCards} />
        </div>
    </div>
  )
}

export default CursoPrincipal