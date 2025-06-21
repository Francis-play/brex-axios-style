import { createBrexAxiosStyleClient } from '../src';
(async () => {
  const api = createBrexAxiosStyleClient({ baseUrl: 'https://jsonplaceholder.typicode.com' });
  const res = await api.get('/posts/1');
  console.log(res.data);
})();
