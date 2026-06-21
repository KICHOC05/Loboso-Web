# Instrucciones para Docker - Proyecto Loboso

## Construcción de la imagen Docker

### Opción 1: Usar el Dockerfile directamente
```bash
docker build -t loboso:latest .
```

### Opción 2: Especificar plataforma (para sistemas ARM64)
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t loboso:latest .
```

## Ejecución del contenedor

### Opción 1: Sin Docker Compose
```bash
docker run -p 8080:8080 loboso:latest
```

### Opción 2: Con variables de entorno
```bash
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=production \
  loboso:latest
```

### Opción 3: Usando Docker Compose (Recomendado para desarrollo)
```bash
docker-compose up -d
```

## Verificar que la aplicación está funcionando
```bash
curl http://localhost:8080
```

## Detener el contenedor
```bash
docker stop <container_id>
```

## Ver logs
```bash
docker logs <container_id>
```

## Características del Dockerfile

✅ **Multi-stage build**: Reduce el tamaño final de la imagen (~70-90%)
✅ **Usuario no root**: Mejora la seguridad (usuario 'spring')
✅ **Health check**: Verifica automáticamente el estado de la aplicación
✅ **Optimización de memoria**: JVM configurada con -Xmx512m -Xms256m
✅ **Alpine Linux**: Imagen base pequeña y segura
✅ **Maven wrapper**: Usa el mvnw local, sin dependencias externas

## Variables de entorno recomendadas para producción

```
SPRING_PROFILES_ACTIVE=production
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
JAVA_OPTS=-Xmx1024m -Xms512m
```

## Tamaño aproximado de la imagen
- Imagen builder: ~300-400 MB (no se incluye en la imagen final)
- Imagen runtime: ~200-250 MB

## Seguridad
- La imagen incluye solo el runtime (JRE), no las herramientas de compilación
- Ejecuta con usuario no-root para máxima seguridad
- Health checks integrados para monitoreo automático
