#!/bin/bash

# Script de respaldo diario para el Sistema de Gestión de Horarios - UNT
# Uso: ./respaldo-diario.sh [directorio_respaldo]

set -e

# Configuración
DB_NAME="${DB_NAME:-unt_horarios}"
DB_USER="${DB_USER:-unt_admin}"
DB_PASSWORD="${DB_PASSWORD:-unt_secret_2024}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

BACKUP_DIR="${1:-./backups}"
FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/respaldo_${DB_NAME}_${FECHA}.sql.gz"

# Crear directorio de respaldos si no existe
mkdir -p "$BACKUP_DIR"

echo "📦 Iniciando respaldo de base de datos..."
echo "📅 Fecha: $(date)"
echo "💾 Base de datos: $DB_NAME"
echo "📁 Archivo: $BACKUP_FILE"

# Realizar el respaldo
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --format=custom \
  | gzip > "$BACKUP_FILE"

# Verificar que el archivo se creó correctamente
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  echo "✅ Respaldo completado exitosamente"
  echo "📊 Tamaño: $(du -h "$BACKUP_FILE" | cut -f1)"
  
  # Crear enlace simbólico al último respaldo
  ln -sf "$BACKUP_FILE" "${BACKUP_DIR}/ultimo_respaldo.sql.gz"
  
  # Limpiar respaldos antiguos (más de 30 días)
  find "$BACKUP_DIR" -name "respaldo_*.sql.gz" -type f -mtime +30 -delete
  echo "🧹 Respaldo antiguos limpiados"
else
  echo "❌ Error: No se pudo crear el archivo de respaldo"
  exit 1
fi

echo "🏁 Proceso de respaldo finalizado"