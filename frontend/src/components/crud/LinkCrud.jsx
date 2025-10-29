import React from 'react';
import BtnVolver from '../ui/BtnVolver';
import CardNavegacion from '../ui/CardNavegacion'; 
// Importamos el CSS para la grilla
import '../../styles/LinkCrud.css'; 

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
    // Contenedor principal
    <div className="link-crud-container">
        
        {/* Este nuevo div será la grilla para las cards */}
        <div className="card-grid">
        {/* Aquí está la magia:
            Mapeamos el array cardData. Por cada 'card' en el array,
            retornamos un componente CardNavegacion con las props correctas.
            - 'key' es importante para React al renderizar listas.
            - Pasamos 'card.label' a la prop 'titulo'.
            - Pasamos 'card.icon' a la prop 'icono'.
            - Pasamos 'card.to' a la prop 'to'.
        */}
        {cardData.map((card) => (
            <CardNavegacion
            key={card.to}
            titulo={card.label}
            icono={card.icon}
            to={card.to}
            />
        ))}
        </div>

        <hr className="separator" />
        
        {showBackButton && (
        <BtnVolver rutaVolver={"/crud"} />
        )}
    </div>
    );
};

export default LinkCrud;
