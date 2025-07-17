
export interface Incident {
    _id?: string;  // Cambiamos de id a _id
    tipo: string;
    direccion: string;
    ciudad: string;
    descripcion: string;
    nivel_gravedad: string;
    estado: string;
    imagen?: string;
    fecha_hora?: Date;
    fecha_resolucion?: Date;
}