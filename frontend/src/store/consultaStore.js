import { create } from "zustand";

export const useConsultaStore = create((set) => ({
  // --- 1. DEFINICIÓN DE ESTADOS ---
  alumnoDni: "",
  alumnoAnio: "",
  reporteAlumno: null,
  reporteCurso: null, // <-- El estado de curso va aquí

  // --- 2. DEFINICIÓN DE ACCIONES (SETTERS) ---
  setAlumnoDni: (dni) => set({ alumnoDni: dni }),
  setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),
  setReporteAlumno: (data) => set({ reporteAlumno: data }),
  setReporteCurso: (reporte) => set({ reporteCurso: reporte }), // <-- El setter de curso va aquí

  // Acción para limpiar todo
  resetConsulta: () =>
    set({
      alumnoDni: "",
      alumnoAnio: "",
      reporteAlumno: null,
      reporteCurso: null, // <-- Aquí solo reseteamos el valor
    }),
}));