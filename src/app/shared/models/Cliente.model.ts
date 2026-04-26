/**
 * Modelo para la entidad Cliente
 */
export interface Cliente {
    codigo: string;
    id: string; // Alias
    nombre: string;
    num_documento: string;
    tipo_documento: string;
    correo: string;
    telefono: string;
    direccion: string;
    id_banco: string; // Relación con banco
    fecha_creacion: string;
    fecha_edicion?: string;
    banco?: {
        nombre: string;
    };
}

/**
 * Modelo para crear un nuevo cliente
 */
export interface CreateClienteRequest {
    nombre: string;
    num_documento: string;
    tipo_documento: string;
    correo: string;
    telefono: string;
    direccion: string;
    id_banco: string; //
}

/**
 * Modelo para actualizar un cliente
 */
export interface UpdateClienteRequest {
    nombre?: string;
    num_documento: string;
    tipo_documento: string;
    correo: string;
    telefono: string;
    direccion: string;
    id_banco: string; //
}

/**
 * Modelo para filtros de clientes
 */
export interface ClienteFilters {
    nombre?: string;
    num_documento?: string;
    tipo_documento?: string;
    id_banco?: string;
}

/**
 * Modelo para respuesta paginada de clientes
 */
export interface ClienteListResponse {
    data: Cliente[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}
