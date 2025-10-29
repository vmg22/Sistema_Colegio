import React from 'react';
import BtnVolver from '../ui/BtnVolver';


import CardNavegacion from '../../components/ui/CardNavegacion'; 

const cardData = [
  {
    to: "/alumnos",
    label: "Alumnos",
    icon: "group", // Ícono de Google para Alumnos
    color: "#2563EB", // azul-600
  },
  {
    to: "/docentes",
    label: "Docentes",
    icon: "work", // Ícono de Google para Docentes
    color: "#2563EB", // verde-600
  },
  {
    to: "/materias",
    label: "Materias",
    icon: "menu_book", // Ícono de Google para Materias
    color: "#2563EB", // indigo-600
  },
  {
    to: "/plan-de-equivalencias",
    label: "Plan de Equivalencias",
    icon: "description", // Ícono de Google para Plan de Equivalencias
    color: "#2563EB", // rojo-600
  },
];


const LinkCrud = ({ showBackButton = false }) => {

  return (
    <div className="link-crud-container">
      <CardNavegacion cardData={cardData} />
      <hr className="separator" />
      {showBackButton && (
        <BtnVolver rutaVolver={"/crud"} />
      )}
    </div>
  );
};

export default LinkCrud;