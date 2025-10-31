import { create } from "zustand";
// 1. Importamos las herramientas de persistencia
import { persist, createJSONStorage } from "zustand/middleware";

// 2. Envolvemos el (set) => ({...}) dentro de persist( ... )
export const useConsultaStore = create(
  persist(
    (set) => ({
      // DEFINICIÓN DE ESTADOS ---
      alumnoDni: "",
      alumnoAnio: "",
      reporteAlumno: null,
      reporteCurso: null,

      // Estados para guardar los NOMBRES de la consulta de curso para usarlo
      // en los componentes ya que en la consulta solo viaja los IDs
      selectedCursoNombre: "",
      selectedMateriaNombre: "",
      selectedPeriodoNombre: "",
      selectedAnioNombre: "",

      // (SETTERS)
      setAlumnoDni: (dni) => set({ alumnoDni: dni }),
      setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),

      setReporteAlumno: (data) => set({ reporteAlumno: data }),
      setReporteCurso: (reporte) => set({ reporteCurso: reporte }),

      // Setters para los nombres de la consulta de curso para mostrar en UI
      setSelectedCursoNombre: (nombre) => set({ selectedCursoNombre: nombre }),
      setSelectedMateriaNombre: (nombre) => set({ selectedMateriaNombre: nombre }),
      setSelectedPeriodoNombre: (nombre) => set({ selectedPeriodoNombre: nombre }),
      setSelectedAnioNombre: (nombre) => set({ selectedAnioNombre: nombre }),

      // Limpiamos todos los estados de la store consulta de alumno dni y consulta de curso
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
    }),
    {
      // 3. Añadimos la configuración de persistencia
      name: "consulta-storage", // El nombre de la clave en sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Usar sessionStorage
    }
  )
);
