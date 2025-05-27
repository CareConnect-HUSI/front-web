# front-web


## Descripción

CareConnect es un sistema para gestionar visitas domiciliarias del Hospital Universitario San Ignacio. El front-end web (Módulo Administrativo) permite a los administradores planificar visitas, gestionar enfermeras, pacientes e inventarios, integrándose con APIs de optimización de rutas, geocodificación y la app móvil.

## Funcionalidades

- Gestión de enfermeras: registro, actualización y consulta.
- Administración de pacientes: creación y edición con geocodificación.
- Planificación de visitas: asignación optimizada de rutas.
- Control de inventarios: seguimiento de insumos médicos.
- Interfaz responsiva para uso administrativo.

## Tecnologías

- **Framework**: React 18.2.0
- **Estilos**: Tailwind CSS 3.3.0
- **Peticiones HTTP**: Axios 1.4.0
- **Dependencias CDN**:
  - React: `https://cdn.jsdelivr.net/npm/react@18.2.0`
  - Axios: `https://cdn.jsdelivr.net/npm/axios@1.4.0`

## Requisitos

- Node.js 16.x+
- npm 8.x+
- Backend de CareConnect activo
- Archivo `.env` con:

  ```
  VITE_API_BASE_URL=http://localhost:8080/api
  ```

## Instalación

1. Clonar repositorio:

   ```bash
   git clone https://github.com/careconnect/web-frontend.git
   cd web-frontend
   ```
2. Instalar dependencias:

   ```bash
   npm install
   ```
3. Iniciar servidor de desarrollo:

   ```bash
   ng serve
   ```

## Uso

- **Acceso**: Inicia sesión con credenciales administrativas.
- **Funciones**:
  - Gestiona enfermeras y pacientes.
  - Planifica visitas con rutas optimizadas.
  - Actualiza inventarios según visitas.
- **Errores**: Notificaciones para fallos (400, 401, 404).

## Autores

- Juan David González
- Lina María Salamanca
- Laura Alexandra Rodríguez
- Axel Nicolás Caro

**Pontificia Universidad Javeriana**\
**Mayo 26, 2025**