import { execute } from '../../lib/db';
import { showLists, recentListTasks } from '../../lib/db/showData';
import { cookies } from 'next/headers';

//using next cookies for server side
//getting the User ID
export async function GET(request) {
  try {
    const cookieStore = cookies(); 
    const userIdObject = cookieStore.get('userId'); 

    let userId = null;
    if (userIdObject) {
      userId = parseInt(userIdObject.value, 10); 
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID not found' }), { status: 401 }); 
    }

    const lists = await showLists(userId);
    const listsWithTasks = await Promise.all(
      lists.map(async (list) => {
        const tasks = await recentListTasks(list.IndList_ID);
        return { ...list, tasks };
      })
    );

    return Response.json(listsWithTasks);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}

//Updating the status of the list for individual and group.
//When all the tasks are complete, the list will be set to complete. Else it will be incomplete
export async function POST(request) {
  try {
    const { taskId, isCompleted, taskType } = await request.json(); 
    const taskStatus = isCompleted ? 'Complete' : 'Incomplete';

    let updateResult;
    let listId;

    if (taskType === 'individual') {
      const updateTaskQuery = 'UPDATE individual_task SET IndTask_Status = ? WHERE IndTask_ID = ?';
      [updateResult] = await execute(updateTaskQuery, [taskStatus, taskId]);

      if (updateResult.affectedRows > 0) {
        const getListIdQuery = 'SELECT IndList_ID FROM individual_link WHERE IndTask_ID = ?';
        const [linkResult] = await execute(getListIdQuery, [taskId]);
        listId = linkResult[0]?.IndList_ID;

        if (listId) {
          const countTotalTasksQuery = 'SELECT COUNT(*) AS total FROM individual_task it JOIN individual_link il ON it.IndTask_ID = il.IndTask_ID WHERE il.IndList_ID = ?';
          const [totalTasksResult] = await execute(countTotalTasksQuery, [listId]);
          const totalTasks = totalTasksResult[0]?.total || 0;

          const countCompletedTasksQuery = 'SELECT COUNT(*) AS completed FROM individual_task it JOIN individual_link il ON it.IndTask_ID = il.IndTask_ID WHERE il.IndList_ID = ? AND it.IndTask_Status = "Complete"';
          const [completedTasksResult] = await execute(countCompletedTasksQuery, [listId]);
          const completedTasks = completedTasksResult[0]?.completed || 0;

          if (totalTasks > 0 && totalTasks === completedTasks) {
            const updateListQuery = 'UPDATE individual_list SET IndList_Status = "Complete" WHERE IndList_ID = ?';
            await execute(updateListQuery, [listId]);
          } else if (totalTasks > 0) {
            const updateListQuery = 'UPDATE individual_list SET IndList_Status = "Incomplete" WHERE IndList_ID = ?';
            await execute(updateListQuery, [listId]);
          }
        }
        return new Response(JSON.stringify({ message: 'Individual task status updated successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Individual task not found' }), { status: 404 });
      }
    } else if (taskType === 'group') {
      const updateTaskQuery = 'UPDATE group_task SET GrpTask_Status = ? WHERE GrpTask_ID = ?';
      [updateResult] = await execute(updateTaskQuery, [taskStatus, taskId]);

      if (updateResult.affectedRows > 0) {
        const getListIdQuery = 'SELECT GrpList_ID FROM group_link WHERE GrpTask_ID = ?';
        const [linkResult] = await execute(getListIdQuery, [taskId]);
        listId = linkResult[0]?.GrpList_ID;

        if (listId) {
          const countTotalTasksQuery = 'SELECT COUNT(*) AS total FROM group_task gt JOIN group_link gl ON gt.GrpTask_ID = gl.GrpTask_ID WHERE gl.GrpList_ID = ?';
          const [totalTasksResult] = await execute(countTotalTasksQuery, [listId]);
          const totalTasks = totalTasksResult[0]?.total || 0;

          const countCompletedTasksQuery = 'SELECT COUNT(*) AS completed FROM group_task gt JOIN group_link gl ON gt.GrpTask_ID = gl.GrpTask_ID WHERE gl.GrpList_ID = ? AND gt.GrpTask_Status = "Complete"';
          const [completedTasksResult] = await execute(countCompletedTasksQuery, [listId]);
          const completedTasks = completedTasksResult[0]?.completed || 0;

          if (totalTasks > 0 && totalTasks === completedTasks) {
            const updateListQuery = 'UPDATE group_list SET GrpList_Status = "Complete" WHERE GrpList_ID = ?';
            await execute(updateListQuery, [listId]);
          } else if (totalTasks > 0) {
            const updateListQuery = 'UPDATE group_list SET GrpList_Status = "Incomplete" WHERE GrpList_ID = ?';
            await execute(updateListQuery, [listId]);
          }
        }
        return new Response(JSON.stringify({ message: 'Group task status updated successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Group task not found' }), { status: 404 });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid taskType provided' }), { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}