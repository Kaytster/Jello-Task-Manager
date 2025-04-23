import bcrypt from 'bcrypt';
import { verifyAccountCreation } from '../../lib/db'; 

//bcrypt: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

export async function POST(request) {
    const { firstname, lastname, email, username, password, type} = await request.json();

    try {
        // Hashing the password to make it secure
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating the user in the database
        const success = await verifyAccountCreation(firstname, lastname, email, username, hashedPassword, type);

        //Error Handling
        if (success) {
            return new Response(JSON.stringify({ message: 'Registration is successful!' }), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ message: 'Registration has failed' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}