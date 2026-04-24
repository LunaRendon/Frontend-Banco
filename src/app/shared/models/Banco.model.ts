/**
 * Modelo para la entidad Banco
 */
export interface Banco {
  nit: string;
  id_banco: string;
  id: string; // Alias 
  nombre: string;
  direccion:string,
  telefono:string,
  correo_contacto:string,
  fecha_creacion: string;
  fecha_edicion?: string;
  };


/**
 * Modelo para crear un nuevo banco
 */
export interface CreateBancoRequest {
  nombre: string;
  nit: string;
  direccion:string;
  telefono:string;
  correo_contacto:string
}

/**
 * Modelo para actualizar un banco
 */
export interface UpdateBancoRequest {
  nombre?: string;
}

/**
 * Modelo para filtros de búsqueda de bancos
 */
export interface BancoFilters {
  nombre?: string;
}

/**
 * Modelo para respuesta paginada de bancos
 */
export interface BancoListResponse {
  data: Banco[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
