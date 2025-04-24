import { execute, createGrpTaskAndLinkToGrpList } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const GrplistId = searchParams.get('GrplistId');

    if (!GrplistId) {
        return NextResponse.json({ message: 'No List ID' }, { status: 400 });
    }

    try {
        const query = 'SELECT gt.GrpTask_ID, gt.GrpTask_Name FROM group_link gli JOIN group_task gt ON gli.GrpTask_ID = gt.GrpTask_ID WHERE gl.GrpList_ID = ?';
        const [tasks] = await execute(query, [GrplistId]);
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error('Error fetching tasks', error);
        return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req) {
    const { name, content, status, groupId, GrplistId } = await req.json();

    if (!name || !content || !groupId || !GrplistId) {
        return NextResponse.json({ message: 'Task name, content, Group ID, and List ID are required' }, { status: 400 });
    }

    try {
        const success = await createTaskAndLinkToList(name, content, status, GrplistId);

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