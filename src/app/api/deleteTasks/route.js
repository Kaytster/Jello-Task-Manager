import { execute } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    const { taskIds } = await req.json();

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json({ message: 'Please select a task to delete' }, { status: 400 });
    }

    const deleteLinksQuery = 'DELETE FROM individual_link WHERE IndTask_ID IN (?)';
    await execute(deleteLinksQuery, taskIds);
    const deleteTasksQuery = 'DELETE FROM individual_task WHERE IndTask_ID IN (?)';
    const [result] = await execute(deleteTasksQuery, taskIds);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: `${result.affectedRows} task(s) deleted successfully` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No tasks found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting tasks', error);
    return NextResponse.json({ message: 'Failed to delete tasks' }, { status: 500 });
  }
}