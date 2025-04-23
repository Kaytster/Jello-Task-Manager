import { handleLogin } from '../lib/db/showData';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 

export async function loginFunction(username, password) {
    const userId = await handleLogin(username, password);

    if (userId) {
        cookies().set('userId', userId); 
        redirect('/dashboard'); 
    } else {
        console.log("Login failed.");
        
    }
}