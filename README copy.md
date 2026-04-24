# Banco - Frontend (Angular)

Este proyecto es una aplicación web desarrollada con **Angular**, que permite la gestión de cuentas bancarias.
Incluye autenticación para **administradores** y **consumidores** (usuarios regulares).

---

## Clonar y ejecutar el proyecto

### 1️ Clonar el repositorio
```bash
git clone https://github.com/LunaRendon/Frontend-Banco.git
```
### 2️ Entrar en la carpeta del proyecto
```bash
cd Frontend-Banco
```

---

### 3️ Instalar dependencias
Asegúrate de tener **Node.js** (versión 18 o superior) y **npm** instalados.

```bash
npm install
```

---

### 4️ Ejecutar el proyecto
Para iniciar el servidor de desarrollo:

```bash
ng serve
```

o, si tu Angular CLI está instalada de forma global:

```bash
npm start
```

Luego, abre tu navegador en:
```
http://localhost:4200
```

---

## Credenciales de acceso

### Administrador
- **Usuario:** `admin`  
- **Contraseña:** `admin123`

> Con esta cuenta puedes acceder al panel de administración

---

### Consumidor (usuario regular)
Si deseas ingresar como **consumidor**, primero debes **crear una cuenta**:
1. En la pantalla de inicio de sesión, selecciona la opción **"Registrarse"** o **"Crear cuenta"**.  
2. Completa el formulario de registro.  
3. Inicia sesión con las credenciales creadas.

---

## Estructura básica del proyecto

```
Gestion-de-Biblioteca-Frontend/
│
├── src/
│   ├── app/
│   │   ├── features/           # Módulos funcionales (ej. clientes, tarjetas, cuentas, etc.)
│   │   ├── core/               # Servicios, interceptores, guardias
│   │   ├── shared/             # Componentes y recursos compartidos
│   │   └── app-routing.module.ts
│   └── assets/                 # Imágenes, estilos globales, etc.
│
├── angular.json
├── package.json
└── README.md
```

---

## Requisitos previos
- **Node.js** v18 o superior  
- **Angular CLI** v17 o superior  
- **npm** (instalado junto con Node)

Para verificar versiones:
```bash
node -v
npm -v
ng version
```

---

### Desarrollado por
- Luna Isabela Rendón 
- Salomé Gil 
- Carlos Eduardo Fajardo

---

## Licencia
Proyecto desarrollado con fines académicos o demostrativos.  
Puedes modificar y distribuir libremente con atribución.
