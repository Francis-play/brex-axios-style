import { createBrexAxiosStyleClient } from './src';

type Post = {
  id: number;
  title: string;
  body: string;
};

const api = createBrexAxiosStyleClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  throwOnError: true,
});

async function test() {
  try {
    const posts = await api.get<Post[]>('/posts');
    console.log(posts[0]);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
