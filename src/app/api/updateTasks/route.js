import { execute } from "@/app/lib/db";
export async function POST(request) {
    try {
        const { IndTask_ID, IndTask_Name, IndTask_Content } = await request.json();

        if (!IndTask_ID) {
            return new Response(JSON.stringify({ message: 'Task ID is required to update.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await execute(
            'UPDATE individual_task SET IndTask_Name = ?, IndTask_Content = ? WHERE IndTask_ID = ?',
            [IndTask_Name, IndTask_Content, parseInt(IndTask_ID, 10)] 
        );

        if (result.affectedRows > 0) {
            return new Response(JSON.stringify({ message: 'Task updated successfully!' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ message: 'Task not found' }), {
                status: 404, 
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Error updating task', error);
        return new Response(JSON.stringify({ message: 'Internal server error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}