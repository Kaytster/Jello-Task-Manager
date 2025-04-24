import { handleLogin } from '../lib/db';
import { cookies } from 'next/headers';

//API tutorial: https://nextjs.org/blog/building-apis-with-nextjs

export async function POST(request) {
  const { username, password } = await request.json();

  try {
    const loginResult = await handleLogin(username, password);

    if (loginResult && loginResult.userId && loginResult.accountType) {
      const { userId, accountType } = loginResult;
      const cookieStore = cookies();
      cookieStore.set('accountType', accountType, {
        //The cookie lasts for 7 days and is available on the whole site (so it can be accessed on any page)
        maxAge: 60 * 60 * 24 * 7, 
        path: '/', 
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error during login', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}