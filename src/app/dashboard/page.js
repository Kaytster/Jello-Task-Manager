'use server';
import { cookies } from "next/headers";
import { recentList, recentListTasks, recentGroup, getGroupMembers, getGroupListsAndTasks } from "../lib/db/showData";
import React from "react";
import Header from "../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/dashboard.css';

async function getUserData(userId) {
  const individual_list = await recentList(userId);
    let individual_task = [];

    if (individual_list) {
      individual_task = await recentListTasks(individual_list.IndList_ID);
    }

    const group = await recentGroup(userId);
      let members = [];
      let listsAndTasks = [];

    if (group) {
        members = await getGroupMembers(group.Group_ID);
        listsAndTasks = await getGroupListsAndTasks(group.Group_ID);
    }

    return { individual_list, individual_task, group, members, listsAndTasks };
}

export default async function Home() {
  
  const cookieStore = cookies();
    const userIdString = await cookieStore.get('userId')?.value;

    if (!userIdString) {
        return <div>Please log in!</div>;
    }

    const userId = parseInt(userIdString, 10);

    if (isNaN(userId)) {
        return <div>Invalid user ID. Please log in again.</div>;
    }

  if (!userId) {
    return <div>Please log in!</div>;
  }
  
  const { individual_list, individual_task, group, members, listsAndTasks } = await getUserData(parseInt(userId, 10));
  
  return (
    <>
          <Header />
          <main>
          <br/>
          <br/>
          <div className="row">
            <section className="card" style={{marginRight: '80px'}}>
              <div className="card-body">
                <div className="card-title">
                  <h1>Recent List</h1>
                </div>
                {individual_list ? ( 
                              <h3>{individual_list.IndList_Name}</h3>
                          ) : (
                              <h3>No recent list found.</h3>
                          )}
                <table className="list">
                  <tbody>
                    {individual_list && (
                      <tr id="row">
                        <td><h4>{individual_list.IndList_Status}</h4></td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <table>
                  {individual_task && individual_task.length > 0 ? (
                    <tbody>
                        {individual_task.map((item, index) => (
                          item.IndTask_ID ? (
                            <div key={item.IndTask_ID}>
                            <tr id="row">
                              <td id="name" style={{color: '#FE107E', fontSize: '20px' }}>{item.IndTask_Name}</td>
                            </tr>
                            <tr id="row">
                            {item.IndTask_Content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                            </tr>
                            </div>
                          ) : null
                        ))}
                    </tbody>
                  ) : (
                    <p>no data found</p>
                  )
                }
                </table>
              </div>
            </section>
                {/* Group */}
            <section className="card" style={{marginRight: '80px'}}>
              <div className="card-body">
                <div className="card-title">
                  <h1>Recent Group</h1>
                </div>
                {group ? (
                              <h3>{group.Group_Name}</h3>
                          ) : (
                              <h3>No recent group found.</h3>
                          )}
                <table className="Members">
                  <tbody>
                      <tr id="row">
                        <td><h4>Members:</h4></td>
                      </tr>
                      <tr id="row">
                        <td>
                          <ul>
                            {members.map((member) => (
                              <li key = {member.Account_Username}>
                                <img
                                    src={`/${member.Account_Username}.png`} 
                                    alt={`Profile picture of user ${member.User_ID}`}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} 
                                />
                                {member.Account_Username}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>                    
                  </tbody>
                </table>

                <table className="List and Task">
                    <tbody>
                        {listsAndTasks.map((item) => (
                            <div key={item.GrpTask_ID}>
                              <React.Fragment key={item.GrpList_ID}>
                                <tr id="row">
                                  <td id="name" style={{color: '#FE107E', fontSize: '20px' }}>{item.GrpList_Name}</td>
                                </tr>
                                {item.tasks && item.tasks.map((task) => (
                                <tr id="row">
                                  <td>{task.GrpTask_Name}: {task.GrpTask_Content}</td>
                                </tr>
                                ))}
                              </React.Fragment>
                            </div>
                         ))}
                         </tbody>
                </table>
              </div>
            </section>
          </div>
          </main>
          </>
    );
  };


  