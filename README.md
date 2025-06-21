# 🦊 brex-axios-style

Cliente HTTP ligero inspirado en **Axios**, construido sobre [`@breimerct/brex`](https://github.com/Breimerct/Brex).  
Diseñado para integrarse fácilmente con APIs, con soporte para interceptores, manejo de errores y respuestas enriquecidas.

---

## 🚀 Instalación

```bash
npm install @breimerct/brex
# Este wrapper es local. Cópialo o publícalo desde tu proyecto.
````

---

## ✨ Características

* API estilo Axios (`get`, `post`, `put`, `delete`, `patch`, `request`)
* Soporte completo de `headers`, `params`, `data`
* Interceptores de `request` y `response` (con manejo de errores)
* Respuesta estándar `{ data, status, headers }`
* Tipado completo en TypeScript

---

## 🔧 Uso básico

```ts
import { createBrexAxiosStyleClient } from './brex-axios-style';

const api = createBrexAxiosStyleClient({
  baseUrl: 'https://api.example.com',
});

// GET
const res = await api.get<{ name: string }>('/user');
console.log(res.data); // { name: 'John' }
console.log(res.status); // 200
```

---

## 🧰 Métodos disponibles

```ts
api.get<T>(url, config?)
api.post<T>(url, data?, config?)
api.put<T>(url, data?, config?)
api.patch<T>(url, data?, config?)
api.delete<T>(url, config?)
api.request<T>({ method, url, data?, params?, headers? })
```

---

## 🔁 Interceptores

### ✋ Request Interceptor

```ts
api.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: 'Bearer your_token',
    },
  };
});
```

### 📦 Response Interceptor

```ts
api.interceptors.response.use(
  (res) => {
    console.log('Interceptado:', res.status);
    return res;
  },
  (error) => {
    console.error('Error interceptado:', error.message);
    throw error;
  }
);
```

---

## 🔎 Ejemplo completo

```ts
const api = createBrexAxiosStyleClient({
  baseUrl: 'https://api.example.com',
  throwOnError: true,
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
    if (err.message.includes('401')) {
      // Redirige a login, por ejemplo
    }
    throw err;
  }
);

const response = await api.post('/login', { username: 'admin', password: '123' });
console.log(response.data);
```

---

## 📦 Tipos de respuesta

Todos los métodos devuelven:

```ts
interface AxiosResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}
```

---

## 🔧 Opciones

```ts
createBrexAxiosStyleClient({
  baseUrl: string;
  timeout?: number;
  throwOnError?: boolean; // Lanza error si BrexResponse tiene error
});
```

---

## 🧪 Testing

Puedes mockear el cliente usando herramientas como `msw`, `jest`, etc.
(Pronto ejemplos y tests automáticos).

---

## 🛠️ Requisitos

* `@breimerct/brex` como base (requerido)
* Node.js >= 18 recomendado

---

## 📄 Licencia

MIT
