// const Home = async () => {
  //   const individual_list = await recentList();
  //   const individual_task = await recentListTasks();
  //     return (
    //       <html>
    //         <body>
    //           <Header />
    //           <main>
    //           <br/>
    //           <br/>
    //           <div className="row">
    //             <div className="col">
    //               <h1>Recent List</h1>
    //               <h3>{individual_list.IndList_Name}</h3>
    //               <table className="list">
    //                 <tbody>
    //                   {individual_list && (
      //                     <tr id="row">
      //                       <td><h4>{individual_list.IndList_Status}</h4></td>
      //                     </tr>
      //                   )}
      //                 </tbody>
      //               </table>
      
      //               <table>
      //                 {individual_task && individual_task.length > 0 ? (
        //                   <tbody>
        //                       {individual_task.map((item, index) => (
          //                         item.IndTask_ID ? (
            //                           <div key={item.IndTask_ID}>
            //                           <tr id="row">
            //                             <td id="name">{item.IndTask_Name}</td>
            //                           </tr>
            //                           <tr id="row">
            //                             <td>{item.IndTask_Content}</td>
            //                           </tr>
            //                           <tr id="row">
            //                             <td>{item.IndTask_Status}</td>
            //                           </tr>
            //                           </div>
            //                         ) : null
            //                       ))}
            //                   </tbody>
            //                 ) : (
              //                   <p>no data found</p>
              //                 )
              //               }
              //               </table>
              
              //             </div>
              //           </div>
              
              //           </main>
              //         </body>
              //       </html>
              //     );
              //   };
              
              
              // export default async function Home() {
                //     const userId = cookies().get('userId')?.value; // Get userId from cookie
                //     console.log('User ID Cookie:', userId);
                
                //     if (!userId) {
                  //         redirect('/login'); // Redirect to login if no userId
                  //         return null; // Add return statement to prevent further execution
                  //     }
                  
                  //     let individual_list = null;
                  //     let individual_task = [];
                  
                  //     try {
                    //         individual_list = await recentList(userId); // Pass userId to recentList
                    //         individual_task = individual_list ? await recentListTasks(individual_list.IndList_ID) : [];
                    //     } catch (error) {
                      //         console.error("Error fetching data:", error);
//     }

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
    let individual_task = []; // Initialize as an empty array

    if (individual_list) { // Check if individual_list exists
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
  
  // const individual_list = await recentList();
  // const individual_task = await recentListTasks();
  const cookieStore = cookies();
    const userIdString = await cookieStore.get('userId')?.value;
    console.log('1. User ID from cookie (string):', userIdString);

    if (!userIdString) {
        return <div>Please log in!</div>;
    }

    const userId = parseInt(userIdString, 10);
    console.log('2. User ID (number):', userId);

    if (isNaN(userId)) {
        return <div>Invalid user ID. Please log in again.</div>;
    }
  // const cookieStore = cookies();
  // const userId = await cookieStore.get('userId')?.value;
  // console.log('User ID from cookie:', userId); // Add this line
  // console.log('Type of userId:', typeof userId);
  // console.log('User ID string:', userId);

  if (!userId) {
    return <div>Please log in!</div>;
  }
  
  const { individual_list, individual_task, group, members, listsAndTasks } = await getUserData(parseInt(userId, 10));
  // const numericUserId = parseInt(userId, 10);
// console.log('Numeric User ID:', userId);
// const { individual_list, individual_task } = await getUserData(numericUserId);
  
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
                {/* <h3>{individual_list.IndList_Name}</h3> */}
                {individual_list ? ( // Check if individual_list is defined
                              <h3>{individual_list.IndList_Name}</h3>
                          ) : (
                              <h3>No recent list found.</h3> // Show a message if no list
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
                {group ? ( // Check if individual_list is defined
                              <h3>{group.Group_Name}</h3>
                          ) : (
                              <h3>No recent list found.</h3> // Show a message if no list
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


  