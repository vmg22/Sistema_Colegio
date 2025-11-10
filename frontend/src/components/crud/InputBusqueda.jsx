import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const InputBusqueda = ({ tipo }) => {
  // console.log(tipo)
  return (
    <div>
      <InputGroup>
        <InputGroup.Text>
          {tipo === "alumno" || tipo === "docente" ? (
            <span className="material-symbols-outlined">person</span>
          ) : tipo === "materia" ? (
            <span className="material-symbols-outlined">assignment</span>
          ) : null}
        </InputGroup.Text>
        <FormControl type="text" placeholder={`Buscar ${tipo}`} />

        <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2"
                style={{backgroundColor:"#1e40af"}}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>Buscar</span>
              </Button>
      </InputGroup>
    </div>
  );
};

export default InputBusqueda;
