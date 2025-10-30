import { create } from "zustand";

export const useConsultaStore = create((set, get) => ({
  // --- ESTADOS ---
  alumnoDni: "",
  alumnoAnio: "",
  reporteAlumno: null,
  reporteCurso: null,

  // --- ESTADOS AUXILIARES ---
  selectedCursoNombre: "",
  selectedMateriaNombre: "",
  selectedPeriodoNombre: "",
  selectedAnioNombre: "",

  // --- SETTERS ---
  setAlumnoDni: (dni) => set({ alumnoDni: dni }),
  setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),

  // Evitamos duplicar si los datos son los mismos
  setReporteAlumno: (data) => {
    const current = get().reporteAlumno;
    const currentStr = JSON.stringify(current);
    const newStr = JSON.stringify(data);
    if (currentStr !== newStr) set({ reporteAlumno: data });
  },

  setReporteCurso: (reporte) => set({ reporteCurso: reporte }),

  setSelectedCursoNombre: (nombre) => set({ selectedCursoNombre: nombre }),
  setSelectedMateriaNombre: (nombre) => set({ selectedMateriaNombre: nombre }),
  setSelectedPeriodoNombre: (nombre) => set({ selectedPeriodoNombre: nombre }),
  setSelectedAnioNombre: (nombre) => set({ selectedAnioNombre: nombre }),

  // Reset total
  resetConsulta: () =>
    set({
      alumnoDni: "",
      alumnoAnio: "",
      reporteAlumno: null,
      reporteCurso: null,
      selectedCursoNombre: "",
      selectedMateriaNombre: "",
      selectedPeriodoNombre: "",
      selectedAnioNombre: "",
    }),
}));
