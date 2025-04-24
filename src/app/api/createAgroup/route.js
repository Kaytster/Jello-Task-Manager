import { execute } from '../../lib/db';
import { NextResponse } from 'next/server'; 

export async function POST(req, res) { 
    const { name, userId } = await req.json();

    if (!name || !userId) {
        return NextResponse.json({ message: 'Group Name is required' }, { status: 400 });
    }

    try {
        const insertGroupQuery = 'INSERT INTO `group` (Group_Name) VALUES (?)';

        const [result] = await execute(insertGroupQuery, [name]);

        if (result && result.insertId) {
            return NextResponse.json({ message: 'List created successfully', listId: result.insertId }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create a group in the database' }, { status: 500 });
        }
    } catch (error) {
        console.error('Database error creating a group', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}