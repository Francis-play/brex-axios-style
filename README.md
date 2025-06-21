# 🦊 Brex Axios Style

Una pequeña librería que hace que trabajar con APIs en JavaScript o TypeScript sea tan fácil como usar [Axios](https://axios-http.com/).  
Está construida encima de [`@breimerct/brex`](https://github.com/Breimerct/Brex) y te permite hacer peticiones HTTP simples con funciones como `get`, `post`, etc.

---

## 🚀 ¿Qué es esto?

Es una forma más fácil de usar la librería `brex` original.  
Agrega cosas que muchos desarrolladores ya conocen de Axios:

- Métodos como `get`, `post`, `put`, `delete`
- Respuestas claras: `{ data, status, headers }`
- Agregar headers automáticamente (como un token)
- Interceptar errores o respuestas en un solo lugar

---

## 📦 Instalación

Primero instala la librería base:

```bash
npm install @breimerct/brex
````

Luego copia este archivo `src/index.ts` dentro de tu proyecto.

---

## ✨ Cómo se usa

### 1. Importa y crea el cliente

```ts
import { createBrexAxiosStyleClient } from './brex-axios-style';

const api = createBrexAxiosStyleClient({
  baseUrl: 'https://api.ejemplo.com',
});
```

### 2. Haz una petición

```ts
const respuesta = await api.get('/usuarios');

console.log(respuesta.data);   // los datos de la API
console.log(respuesta.status); // el código HTTP (200, 404, etc.)
console.log(respuesta.headers); // encabezados HTTP
```

---

## 🧰 Métodos disponibles

Todos devuelven una respuesta así:

```ts
{
  data: ...,     // los datos de la API
  status: 200,   // el código de respuesta
  headers: {...} // encabezados HTTP
}
```

```ts
api.get<T>(url, config?)
api.post<T>(url, data?, config?)
api.put<T>(url, data?, config?)
api.patch<T>(url, data?, config?)
api.delete<T>(url, config?)
api.request<T>({ method, url, data?, params?, headers? })
```

---

## 🔒 ¿Cómo agrego un token automáticamente?

Digamos que tienes un token de sesión y lo quieres incluir en todas las peticiones:

```ts
api.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: 'Bearer mi_token_secreto',
    },
  };
});
```

Así no tienes que repetir el token cada vez.

---

## 🔁 ¿Cómo manejo errores globalmente?

Puedes capturar errores en un solo lugar:

```ts
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.message.includes('401')) {
      alert('No estás autorizado. Redirigiendo al login...');
    }
    throw error; // vuelve a lanzar el error para quien lo necesite
  }
);
```

---

## 💡 Ejemplo completo

```ts
import { createBrexAxiosStyleClient } from './brex-axios-style';

const api = createBrexAxiosStyleClient({
  baseUrl: 'https://api.ejemplo.com',
  throwOnError: true, // lanza error si la respuesta viene con error
});

api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: 'Bearer abc123',
  };
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Algo salió mal:', err.message);
    throw err;
  }
);

// Petición real
async function cargarUsuario() {
  try {
    const res = await api.get<{ nombre: string }>('/usuario');
    console.log(res.data.nombre); // Juan
  } catch (err) {
    console.error('Error al cargar usuario');
  }
}
```

---

## 📘 ¿Qué necesitas saber para usar esta librería?

Solo conceptos básicos de:

* Cómo hacer una petición HTTP (`GET`, `POST`, etc.)
* Cómo funciona `async/await` en JavaScript
* Un poco de estructura de objetos

Si sabes usar `fetch`, esto te hará la vida más cómoda.

---

## 🛠 Requisitos

* Node.js 18+ (recomendado)
* Tener `@breimerct/brex` instalado

---

## 📄 Licencia

MIT – libre para usar y modificar.
