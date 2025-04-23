import { execute } from '../../lib/db';
import { NextResponse } from 'next/server'; 

export async function POST(req, res) { 
    console.log('API createAlist POST handler invoked');
    const { name, userId } = await req.json();

    if (!name || !userId) {
        return NextResponse.json({ message: 'List name and User ID are required' }, { status: 400 });
    }

    try {
        const insertGroupQuery = 'INSERT INTO `group` (Group_Name) VALUES (?)';

        const [result] = await execute(insertGroupQuery, [name]);

        if (result && result.insertId) {
            return NextResponse.json({ message: 'List created successfully', listId: result.insertId }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create list in the database' }, { status: 500 });
        }
    } catch (error) {
        console.error('Database error creating list', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}