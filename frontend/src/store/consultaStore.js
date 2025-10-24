import { create } from "zustand";

export const useConsultaStore = create((set) => ({
  alumnoDni: "",
  alumnoAnio: "",
  reporteAlumno: null,

  setAlumnoDni: (dni) => set({ alumnoDni: dni }),
  setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),

  setReporteAlumno: (data) => set({ reporteAlumno: data }),

  resetConsulta: () =>
    set({
      alumnoDni: "",
      alumnoAnio: "",
      reporteAlumno: null,
    }),
}));
