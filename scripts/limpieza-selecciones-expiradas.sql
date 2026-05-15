-- Script para limpiar selecciones temporales expiradas
-- Se ejecuta periódicamente (cada 15 minutos) via cron

DELETE FROM selecciones_temporales 
WHERE expira_en < NOW();

-- También limpiar registros huérfanos
DELETE FROM validaciones_horarios 
WHERE horario_id NOT IN (SELECT id FROM horarios);

-- Limpiar sesiones expiradas
DELETE FROM sesiones 
WHERE expira_en < NOW() 
   OR (activa = false AND updated_at < NOW() - INTERVAL '30 days');

-- Limpiar notificaciones antiguas
DELETE FROM envios_notificaciones 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Limpiar registros de auditoría antiguos
DELETE FROM registros_auditoria 
WHERE created_at < NOW() - INTERVAL '1 year';