"use client";
import Link from "next/link.js";
import Header from "../../../components/header.js";
import 'bootstrap/dist/css/bootstrap.css';
import '../../../globals.css';
import '../../../styles/viewgroups.css';
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

async function fetchGroupInfo(groupId) {
  try {
    const response = await fetch(`/api/viewAgroup/${groupId}`);
    if (!response.ok) {
      console.error("Fetch error", response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch group info", error);
    return null;
  }
}

//getting the data of a specific group with the ID from the URL.
export default function ViewGroup() {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    async function loadGroupData() {
      if (groupId) {
        const data = await fetchGroupInfo(groupId);
        setGroupData(data);
      }
    }
    loadGroupData();
  }, [groupId]);

  if (!groupData) {
    return <div>Loading group information...</div>;
  }

  const handleCheckboxChange = async (event, taskId, isGroupTask) => {
    const isChecked = event.target.checked;
    const taskType = isGroupTask ? 'group' : 'individual';
  
    try {
      const response = await fetch('/api/listANDtaskStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GrplistId: GrplistId, taskId: taskId, isCompleted: isChecked, taskType: taskType }),
      });
  
      if (response.ok) {
        setGroupData(prevData => ({
          ...prevData,
          lists: prevData.lists.map(list => ({
            ...list,
            tasks: list.tasks.map(task => {
              if (isGroupTask && task.GrpTask_ID === taskId) {
                return { ...task, GrpTask_Status: isChecked ? 'Complete' : 'Incomplete' };
              } else if (!isGroupTask && task.IndTask_ID === taskId) {
                return { ...task, IndTask_Status: isChecked ? 'Complete' : 'Incomplete' };
              }
              return task;
            })
          }))
        }));
      } else {
        console.error('Failed to update the task status', response.status);
      }
    } catch (error) {
      console.error('Error updating the task', error);
    }
  };

  const accountTypeString = Cookies.get('accountType');

  //if the user is a group admin, they can check tasks as complete or incomplete, else they will just see the tasks.
  if (accountTypeString == 'Group Admin') {
    return (
      <>
        <Header />
        <main>
          <br />
          <br />
          <div className="row">
            {groupData.lists && groupData.lists.map((list) => (
              <div className="card" key={list.GrpList_ID} style={{ marginRight: '25px', marginBottom: '20px' }}>
                <div className="card-title">
                  <h1>{list.GrpList_Name}</h1>
                  {list.GrpList_Status && <h3>{list.GrpList_Status}</h3>}
                </div>
                <div className="card-body">
                  {list.tasks && list.tasks.map((task) => (
                    <div key={task.GrpTask_ID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px'}}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: '10px' }}
                          checked={task.GrpTask_Status === 'Complete'}
                          onChange={(event) => handleCheckboxChange(event, task.GrpTask_ID, true)}
                        />
                        <p style={{ color: '#FE107E', fontSize: '20px' }}>{task.GrpTask_Name}</p>
                      </div>
                      {task.GrpTask_Content && <p style={{ marginLeft: '30px' }}>{task.GrpTask_Content}</p>}
                    </div>
                  ))}
                  <Link href={`/createtask/${list.GrpList_ID}`}>
                    <button>Add Task</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
        </>
    );
  } else {
    return (
      <>
        <Header />
        <main>
          <br />
          <br />
          <div className="row">
            {groupData.lists && groupData.lists.map((list) => (
              <div className="card" key={list.GrpList_ID} style={{ marginRight: '25px', marginBottom: '20px' }}>
                <div className="card-title">
                  <h1>{list.GrpList_Name}</h1>
                  {list.GrpList_Status && <h3>{list.GrpList_Status}</h3>}
                </div>
                <div className="card-body">
                  {list.tasks && list.tasks.map((task) => (
                    <div key={task.GrpTask_ID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px'}}>
                      <p style={{ color: '#FE107E', fontSize: '20px' }}>{task.GrpTask_Name}</p>
                      {task.GrpTask_Content && <p style={{ marginLeft: '0' }}>{task.GrpTask_Content}</p>}
                    </div>
                  ))}
                  <Link href={`/createtask/${list.GrpList_ID}`}>
                    <button>Add Task</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
        </>
    );
  }
}