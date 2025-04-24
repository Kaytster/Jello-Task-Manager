"use client";
import { useState, useEffect } from 'react';
import Header from "../components/header.js";
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';
import '../styles/tasklists.css';
import Link from "next/link.js";
import Cookies from 'js-cookie';

export default function TaskLists() {
  const [listsWithTasks, setListsWithTasks] = useState([]);

  useEffect(() => {
    const userIdString = Cookies.get('userId');

    if (userIdString) {
      const userId = parseInt(userIdString, 10);

      if (!isNaN(userId)) {
        fetch(`/api/listANDtaskStatus?userId=${userId}`)
          .then((response) => response.json())
          .then((data) => {
            setListsWithTasks(data);
          })
          .catch((error) => {
            console.error('Something went wrong', error);
          });
      } else {
        console.error('User ID is incorrect');
      }
    }
  }, []);

  const handleCheckboxChange = async (event, taskId, isGroupTask) => { 
    const isChecked = event.target.checked;
    const taskType = isGroupTask ? 'group' : 'individual'; 

    try {
      const response = await fetch('/api/listANDtaskStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: taskId, isCompleted: isChecked, taskType: taskType }),
      });

      if (response.ok) {
        setListsWithTasks(prevLists =>
          prevLists.map(list => ({
            ...list,
            tasks: list.tasks.map(task =>
              task.IndTask_ID === taskId ? { ...task, IndTask_Status: isChecked ? 1 : 0 } : task
            ),
          }))
        );
      } else {
        console.error('Failed to update the task status', response.status);
      }
    } catch (error) {
      console.error('Error updating the task', error);
    }
  };

  return (
    <>
      <Header />
      <main>
        <br />
        <br />
        <div className="row">
          {listsWithTasks.map((list) => (
            <div className="card" key={list.IndList_ID} style={{ marginRight: '25px', marginBottom: '20px' }}>
              <div className="card-title">
                <h1>{list.IndList_Name}</h1>
                <h3>{list.IndList_Status}</h3>
              </div>
              <div className="card-body">
                <table>
                  <tbody>
                    {list.tasks && list.tasks.map((task) => (
                      <tr key={task.IndTask_ID}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <input
                                style={{ marginRight: '10px' }}
                                type="checkbox"
                                checked={task.IndTask_Status === 1 || task.IndTask_Status === 'Complete'}
                                onChange={(event) => handleCheckboxChange(event, task.IndTask_ID, false)}
                              />
                              <p style={{ color: '#FE107E', fontSize: '20px' }}>{task.IndTask_Name} </p>
                            </div>
                            <p>{task.IndTask_Content}</p>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                    <Link href={`/createtask/${list.IndList_ID}`}>
                      <button>Edit</button>
                    </Link>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
      </>
  );
}