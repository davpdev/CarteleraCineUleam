-- Políticas RLS para la tabla Peliculas
-- Ejecuta estos comandos en el SQL Editor de Supabase

-- 1. Habilitar RLS en la tabla Peliculas (si no está ya habilitado)
ALTER TABLE "Peliculas" ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir que usuarios autenticados INSERTEN películas
-- Esta política permite que cualquier usuario autenticado cree una película
CREATE POLICY "Users can insert their own peliculas"
ON "Peliculas"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "usuario_id");

-- Alternativa más permisiva (si quieres que cualquier usuario autenticado pueda crear películas):
-- CREATE POLICY "Authenticated users can insert peliculas"
-- ON "Peliculas"
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- 3. Política para permitir que usuarios vean todas las películas
CREATE POLICY "Anyone can view peliculas"
ON "Peliculas"
FOR SELECT
TO authenticated
USING (true);

-- 4. Política para permitir que usuarios actualicen sus propias películas
CREATE POLICY "Users can update their own peliculas"
ON "Peliculas"
FOR UPDATE
TO authenticated
USING (auth.uid() = "usuario_id")
WITH CHECK (auth.uid() = "usuario_id");

-- 5. Política para permitir que usuarios eliminen sus propias películas
CREATE POLICY "Users can delete their own peliculas"
ON "Peliculas"
FOR DELETE
TO authenticated
USING (auth.uid() = "usuario_id");

-- Nota: Si tienes roles de administrador, puedes agregar políticas adicionales:
-- CREATE POLICY "Admins can do everything"
-- ON "Peliculas"
-- FOR ALL
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM "profiles"
--     WHERE "profiles"."id" = auth.uid()
--     AND "profiles"."rol" = true
--   )
-- );

