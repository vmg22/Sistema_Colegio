import React from "react";
import LinkCrud from "../../../components/crud/LinkCrud";
import HeaderCrud from "../../../components/crud/HeaderCrud";
import InputBusqueda from "../../../components/crud/InputBusqueda";

const Alumnos = () => {
  return (
    <div>
      <HeaderCrud />
      <LinkCrud showBackButton={true} />
        <div style={{  display:"flex", justifyContent:"center"}}>
          <InputBusqueda tipo="alumno" />
        </div>
    </div>
  );
};

export default Alumnos;
