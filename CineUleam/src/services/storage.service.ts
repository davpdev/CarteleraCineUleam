import { supabase } from "../api/supabase.config";

// Nombre del bucket de Supabase Storage (debe estar configurado previamente en Supabase)
const BUCKET_NAME = "peliculasImagen";

export const StorageService = {
    /**
     * Sube una imagen al bucket de Supabase Storage
     * El bucket debe estar configurado previamente en la consola de Supabase
     * @param file - Archivo de imagen a subir
     * @param peliculaId - ID de la película (usado como nombre del archivo)
     * @returns URL pública de la imagen o null si hay error
     */
    uploadImage: async (file: File, peliculaId: string): Promise<string | null> => {
        try {
            // Validar que el archivo sea una imagen
            if (!file.type.startsWith('image/')) {
                console.error('El archivo debe ser una imagen');
                return null;
            }

            // Obtener la extensión del archivo
            const fileExt = file.name.split('.').pop() || 'jpg';
            const fileName = `${peliculaId}.${fileExt}`;
            const filePath = fileName;

            // Primero, intentar eliminar la imagen anterior si existe (para reemplazarla)
            // Listar archivos en la raíz del bucket
            const { data: existingFiles } = await supabase.storage
                .from(BUCKET_NAME)
                .list('');

            if (existingFiles && existingFiles.length > 0) {
                // Eliminar archivos existentes que coincidan con el peliculaId
                const filesToDelete = existingFiles
                    .filter(f => f.name.startsWith(peliculaId))
                    .map(f => f.name);
                
                if (filesToDelete.length > 0) {
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove(filesToDelete);
                }
            }

            // Subir el nuevo archivo
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true // Si existe, lo reemplaza
                });

            if (error) {
                console.error('Error al subir imagen a Supabase Storage:', error.message);
                // Verificar si es porque el bucket no existe
                if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
                    console.error(`El bucket "${BUCKET_NAME}" no existe. Por favor, verifica que el bucket esté creado en Supabase Storage.`);
                }
                return null;
            }

            // Obtener la URL pública de la imagen
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }
    },

    /**
     * Elimina una imagen del bucket de Supabase Storage
     * @param peliculaId - ID de la película
     * @returns true si se eliminó correctamente, false en caso contrario
     */
    deleteImage: async (peliculaId: string): Promise<boolean> => {
        try {
            // Listar todos los archivos en el bucket
            const { data: files, error: listError } = await supabase.storage
                .from(BUCKET_NAME)
                .list('');

            if (listError) {
                console.error('Error al listar archivos en Supabase Storage:', listError.message);
                return false;
            }

            // Si no hay archivos, se considera exitoso (ya no existe)
            if (!files || files.length === 0) {
                return true;
            }

            // Eliminar todos los archivos que coincidan con el peliculaId
            const filesToDelete = files
                .filter(file => file.name.startsWith(peliculaId))
                .map(file => file.name);

            if (filesToDelete.length > 0) {
                const { error: deleteError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove(filesToDelete);

                if (deleteError) {
                    console.error('Error al eliminar imagen de Supabase Storage:', deleteError.message);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }
    },

    /**
     * Obtiene la URL pública de una imagen desde Supabase Storage
     * @param peliculaId - ID de la película
     * @param fileExtension - Extensión del archivo (opcional)
     * @returns URL pública de la imagen o null si no existe
     */
    getImageUrl: (peliculaId: string, fileExtension?: string): string | null => {
        try {
            const fileName = fileExtension ? `${peliculaId}.${fileExtension}` : peliculaId;
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            return publicUrl;
        } catch (error) {
            console.error('Error al obtener URL de imagen:', error);
            return null;
        }
    }
};

