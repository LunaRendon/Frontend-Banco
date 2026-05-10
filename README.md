# 🏦 Banco Central - Frontend (Angular)

Este proyecto es una aplicación web desarrollada con **Angular 20** y **PrimeNG**, que permite la gestión completa de un sistema bancario. Incluye autenticación con roles diferenciados para **administradores** y **clientes**.

[![Ver video explicación](https://img.shields.io/badge/▶%20Ver%20Video%20Explicación-OneDrive-blue?style=for-the-badge&logo=microsoft)](https://correoitmedu-my.sharepoint.com/personal/salomegil1121193_correo_itm_edu_co/_layouts/15/stream.aspx?id=%2Fpersonal%2Fsalomegil1121193%5Fcorreo%5Fitm%5Fedu%5Fco%2FDocuments%2FEscritorio%2Fvideo%2Emp4&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E664686c0%2D88c1%2D405d%2Daaaf%2D06710f445138)

---

## 🚀 Clonar y ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/LunaRendon/Frontend-Banco.git
```

### 2. Entrar en la carpeta del proyecto

```bash
cd Frontend-Banco
```

### 3. Instalar dependencias

Asegúrate de tener **Node.js** (versión 20 o superior) y **npm** instalados.

```bash
npm install
```

### 4. Ejecutar el proyecto

```bash
ng serve
```

Luego abre tu navegador en:

```
http://localhost:4200
```

> ⚠️ El backend (FastAPI) debe estar corriendo en `http://localhost:8000` para que la aplicación funcione correctamente.

---

## 🔐 Credenciales de acceso

### Administrador
| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `admin123` |

> Con esta cuenta tienes acceso completo al sistema: bancos, clientes, cuentas, operaciones, préstamos, usuarios y usuarios de la aplicación.

### Cliente (usuario regular)

Para ingresar como cliente:

1. En la pantalla de login, haz clic en **"Crear cuenta"**
2. Ingresa tu **username**, el **ID de tu cuenta bancaria**, y una contraseña
3. Inicia sesión con las credenciales creadas

> El ID de cuenta bancaria debe existir previamente en el sistema (creado por el administrador).

---

## ✨ Funcionalidades por rol

### 👑 Administrador
- Dashboard con estadísticas globales (total clientes, cuentas, tipos de cuenta)
- Gestión completa de **Bancos** (crear, editar, eliminar)
- Gestión completa de **Clientes**
- Gestión completa de **Cuentas**
- Gestión completa de **Operaciones**
- Gestión completa de **Préstamos**
- Gestión de **Usuarios de la aplicación** (cambiar rol, estado, contraseña)
- Gestión de **Usuarios** del sistema

### 👤 Cliente
- Dashboard personalizado con su **saldo actual** y **últimas operaciones**
- Realizar operaciones desde el dashboard: **Depositar**, **Retirar**, **Transferir**
- Ver listado de **Bancos**
- Ver sus **Préstamos**
- Ver sus **Tarjetas**
- Recuperar contraseña

---

## 📁 Estructura del proyecto

```
Frontend-Banco/
│
├── src/
│   ├── app/
│   │   ├── features/               # Módulos funcionales
│   │   │   ├── auth/               # Login, Register, Forgot Password
│   │   │   ├── dashboard/          # Dashboard admin y cliente
│   │   │   ├── Banco/              # Gestión de bancos
│   │   │   ├── Cliente/            # Gestión de clientes
│   │   │   ├── Cuenta/             # Gestión de cuentas
│   │   │   ├── Operacion/          # Gestión de operaciones
│   │   │   ├── Prestamos/          # Gestión de préstamos
│   │   │   ├── Usuario/            # Gestión de usuarios
│   │   │   ├── UsuarioApp/         # Gestión de usuarios de la app
│   │   │   └── perfil/             # Perfil del usuario autenticado
│   │   ├── core/
│   │   │   ├── services/           # Servicios (AuthService, BancoService, etc.)
│   │   │   ├── guards/             # Guards de autenticación y roles
│   │   │   └── interceptors/       # Interceptor JWT
│   │   └── shared/
│   │       ├── models/             # Interfaces y modelos
│   │       └── components/         # Componentes compartidos (menú, sidebar)
│   └── assets/                     # Imágenes y recursos estáticos
│
├── angular.json
├── package.json
└── README.md
```

---

## 🛠️ Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | v20 o superior |
| Angular CLI | v20 |
| npm | incluido con Node |

Para verificar versiones instaladas:

```bash
node -v
npm -v
ng version
```

Para instalar Angular CLI globalmente:

```bash
npm install -g @angular/cli@20
```

---

## 🔗 Repositorio

[https://github.com/LunaRendon/Frontend-Banco.git](https://github.com/LunaRendon/Frontend-Banco.git)

---

## 👥 Desarrollado por

- **Luna Isabela Rendón**
- **Salomé Gil**
- **Carlos Eduardo Fajardo**

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.
Puedes modificar y distribuir libremente con atribución.
