# brex-axios-style

**Un wrapper para [Brex](https://github.com/Breimerct/Brex) con una API similar a Axios.**  
Ideal para quienes prefieren un estilo simple (`client.get`, `client.post`, etc.) pero quieren algo moderno, ligero y con tipado en TypeScript.

---

## 🚀 Instalación

Primero instala Brex y esta librería:

```bash
npm install @breimerct/brex brex-axios-style
````

---

## 🧠 ¿Qué es esto?

Brex es una librería HTTP liviana basada en `fetch`, con soporte de interceptores y tipado fuerte.
Este wrapper (`brex-axios-style`) te permite usarlo con una **API como la de Axios**, más cómoda si vienes de ese mundo.

---

## ✅ Características

* ✅ `client.get()`, `client.post()`, `client.put()`, `client.delete()`
* ✅ Tipado genérico (`client.get<T>()`)
* ✅ Opción `throwOnError` para usar `try/catch` como en Axios
* ✅ Soporte de headers comunes (`client.defaults.headers.common`)
* 🧪 Basado en [Brex](https://github.com/Breimerct/Brex), sin dependencias

---

## ✍️ Uso básico

```ts
import { createBrexAxiosStyleClient } from 'brex-axios-style';

type Post = {
  id: number;
  title: string;
  body: string;
};

const api = createBrexAxiosStyleClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  throwOnError: true
});

async function main() {
  try {
    const posts = await api.get<Post[]>('/posts');
    console.log(posts[0]);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
  }
}

main();
```

---

## 🛡️ Manejo de errores

Por defecto, puedes elegir entre:

### 1. Modo seguro (sin `throw`):

```ts
const api = createBrexAxiosStyleClient({ baseURL: '...', throwOnError: false });
const posts = await api.get<Post[]>('/posts'); // posts puede ser undefined si hay error
```

### 2. Modo `try/catch` (como Axios):

```ts
const api = createBrexAxiosStyleClient({ baseURL: '...', throwOnError: true });

try {
  const posts = await api.get<Post[]>('/posts');
} catch (e) {
  console.error(e);
}
```

---

## 🔐 Headers globales

```ts
api.defaults.headers.common['Authorization'] = 'Bearer tu_token';
```

Estos headers se enviarán en todas las solicitudes.

---

## ✨ API completa

```ts
const client = createBrexAxiosStyleClient(config);
```

### Métodos disponibles:

* `client.get<T>(url)`
* `client.post<T>(url, body?)`
* `client.put<T>(url, body?)`
* `client.delete<T>(url)`
* `client.defaults.headers.common` → para headers globales

---

## 📦 Requisitos

* Node.js v18+ (o polyfill para `fetch`)
* TypeScript recomendado

---

## 📌 Créditos

Basado en el excelente proyecto [Brex](https://github.com/Breimerct/Brex) de [@Breimerct](https://github.com/Breimerct).

Este wrapper fue creado por @Francis-play con ❤️ para hacer la transición desde Axios más sencilla.

---

## 📬 ¿Sugerencias?

¡Pull requests y sugerencias son bienvenidas!
