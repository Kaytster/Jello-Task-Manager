import { execute, createTaskAndLinkToList } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const listId = searchParams.get('listId');

    if (!listId) {
        return NextResponse.json({ message: 'No List ID' }, { status: 400 });
    }

    try {
        const query = 'SELECT it.IndTask_ID, it.IndTask_Name FROM individual_link il JOIN individual_task it ON il.IndTask_ID = it.IndTask_ID WHERE il.IndList_ID = ?';
        const [tasks] = await execute(query, [listId]);
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error('Error fetching tasks', error);
        return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req) {
    const { name, content, status, userId, listId } = await req.json();

    if (!name || !content || !userId || !listId) {
        return NextResponse.json({ message: 'Task name, content, User ID, and List ID are required' }, { status: 400 });
    }

    try {
        const success = await createTaskAndLinkToList(name, content, status, listId);

        if (success) {
            return NextResponse.json({ message: 'Task created and linked successfully' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create and link task' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating and linking task', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}