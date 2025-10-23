import { create } from 'zustand';

export const useConsultaStore = create((set) => ({
    // Estados iniciales para la consulta de alumno
    alumnoDni: '',
    alumnoAnio: '',
    // Acciones para actualizar el estado
    setAlumnoDni: (dni) => set({ alumnoDni: dni }),
    setAlumnoAnio: (anio) => set({ alumnoAnio: anio }),

}));