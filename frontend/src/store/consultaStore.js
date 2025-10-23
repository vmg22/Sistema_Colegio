import { create } from "zustand";

export const useConsultaStore = create((set) => ({
  // 🔹 Estado inicial
  alumnoDni: "",
  alumnoAnio: "",
  reporteAlumno: null,

  // 🔹 Setters individuales
  setAlumnoDni: (dni) => set({ alumnoDni: dni }),
  setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),

  // 🔹 Set del reporte completo (respuesta del backend)
  setReporteAlumno: (data) => set({ reporteAlumno: data }),

  // 🔹 Reset total (opcional, por si cambiás de alumno o curso)
  resetConsulta: () =>
    set({
      alumnoDni: "",
      alumnoAnio: "",
      reporteAlumno: null,
    }),
}));
