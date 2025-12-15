import React, { useState, useEffect } from "react";
import {
  createDocentePerfil,
  createUsuarioParaDocente,
  getDocenteEstados,
} from "../../services/docenteService";
import "../../styles/docentesmodal.css";

const initialPerfilState = {
  dni_docente: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  especialidad: "",
  estado: "activo",
};
const initialUsuarioState = {
  username: "",
  email: "",
  password: "",
};

const DocenteWizardModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [perfilData, setPerfilData] = useState(initialPerfilState);
  const [usuarioData, setUsuarioData] = useState(initialUsuarioState);
  const [createdDocente, setCreatedDocente] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [listaEstados, setListaEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  useEffect(() => {
    // La lógica de carga de estados se mantiene igual
    async function fetchEstados() {
      try {
        setLoadingEstados(true);
        const response = await getDocenteEstados();
        let estados = [];

        if (
          Array.isArray(response) &&
          response.length > 0 &&
          response[0].Type
        ) {
          const enumString = response[0].Type;
          const match = enumString.match(/enum\((.*?)\)/);

          if (match && match[1]) {
            estados = match[1]
              .split(",")
              .map((val) => val.replace(/'/g, "").trim());
          }
        }

        if (estados.length === 0) {
          estados = ["activo", "inactivo", "licencia"];
        }

        setListaEstados(estados);
      } catch (error) {
        console.error("Error cargando estados:", error);
        setListaEstados(["activo", "inactivo", "licencia"]);
      } finally {
        setLoadingEstados(false);
      }
    }
    fetchEstados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (step === 1) {
      setPerfilData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUsuarioData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // La lógica de los handlers de envío se mantiene igual
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const docente = await createDocentePerfil({
        ...perfilData,
        // Limpiamos opcionales para evitar problemas en el backend si están vacíos
        telefono: perfilData.telefono || null,
        email: perfilData.email || null,
        especialidad: perfilData.especialidad || null,
      });
      setCreatedDocente(docente);
      setStep(2);
    } catch (err) {
      setError(err.message || "No se pudo guardar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await createUsuarioParaDocente(createdDocente.id_docente, usuarioData);
      onSave();
    } catch (err) {
      setError(err.message || "No se pudo crear el usuario.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* --- PASO 1: PERFIL DEL DOCENTE --- */}
        {step === 1 && (
          <div>
            <h3>Alta de Docente: Perfil (Paso 1 de 2)</h3>
            <form onSubmit={handleStep1Submit}>
              {error && <p className="error-message">{error}</p>}
              <div className="form-group">
                <label htmlFor="dni_docente">
                  DNI <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  id="dni_docente"
                  name="dni_docente"
                  value={perfilData.dni_docente}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) {
                      handleChange({
                        target: { name: "dni_docente", value: value },
                      });
                    }
                  }}
                  maxLength={8}
                  placeholder="Ej: 12345678"
                  required
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={perfilData.nombre}
                  onChange={handleChange}
                  required
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label htmlFor="apellido">
                  Apellido <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={perfilData.apellido}
                  onChange={handleChange}
                  required
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Email de Contacto */}
              <div className="form-group">
                <label htmlFor="email">Email de Contacto</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={perfilData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@email.com"
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={perfilData.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleChange({
                        target: { name: "telefono", value: value },
                      });
                    }
                  }}
                  maxLength={10}
                  placeholder="Ej: 3814123456"
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Especialidad */}
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad</label>
                <input
                  type="text"
                  id="especialidad"
                  name="especialidad"
                  value={perfilData.especialidad}
                  onChange={handleChange}
                  placeholder="Ej: Matemática, Lengua, etc."
                  disabled={isSaving || loadingEstados}
                />
              </div>

              {/* Estado */}
              <div className="form-group" style={{ marginBottom: "22px" }}>
                <label htmlFor="estado">
                  Estado <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={perfilData.estado}
                  onChange={handleChange}
                  disabled={loadingEstados || isSaving}
                  required
                  style={{ maxWidth: "250px" }}
                >
                  {loadingEstados ? (
                    <option>Cargando...</option>
                  ) : (
                    listaEstados.map((est) => {
                      const estadoStr =
                        typeof est === "string"
                          ? est
                          : est?.nombre || String(est);
                      return (
                        <option key={estadoStr} value={estadoStr}>
                          {estadoStr.charAt(0).toUpperCase() +
                            estadoStr.slice(1)}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-cancel"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSaving || loadingEstados}
                >
                  {isSaving ? "Guardando..." : "Siguiente"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PASO 2: CUENTA DE USUARIO --- */}
        {step === 2 && createdDocente && (
          <div>
            <h3>Alta de Docente: Cuenta (Paso 2 de 2)</h3>
            <form onSubmit={handleStep2Submit}>
              <p style={{ marginBottom: "22px" }}>
                {/* Ajusté el margin-bottom a 22px para seguir la separación de .form-group */}
                Creando cuenta para:{" "}
                <strong>
                  {createdDocente.nombre} {createdDocente.apellido}
                </strong>
              </p>

              {error && <p className="error-message">{error}</p>}

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">
                  Username <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={usuarioData.username}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Email (para login) */}
              <div className="form-group">
                <label htmlFor="email">
                  Email (para login) <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={usuarioData.email}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label htmlFor="password">
                  Contraseña <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={usuarioData.password}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-cancel"
                  disabled={isSaving}
                >
                  Atrás
                </button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? "Creando..." : "Finalizar Alta"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocenteWizardModal;
