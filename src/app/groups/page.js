'use server'
import Header from "../components/header.js";
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';
import '../styles/tasklists.css';
import { cookies } from "next/headers";
import Link from "next/link.js";

import { showGroups, getGroupMembers } from "../lib/db/showData.js"; 

//getting the groups for the specified User ID (from the cookie)
async function getUserGroups(userId) {
  const groups = await showGroups(userId);
  const groupsWithMembers = await Promise.all(groups.map(async (group) => {
    console.log("About to fetch members for Group ID:", group.Group_ID); 
    const members = await getGroupMembers(group.Group_ID); 
    return { ...group, members }; 
  }));
  return groupsWithMembers;
}

export default async function GroupList() {
    const cookieStore = cookies();
    const userIdString = cookieStore.get('userId')?.value;
  
    if (!userIdString) {
      return <div>Please log in!</div>;
    }
  
    const userId = parseInt(userIdString, 10);
  
    const groupsWithMembers = await getUserGroups(userId);
  
    return (
      <div>
        <Header />
        <main>
          <br />
          <br />
          <div className="row">
            {groupsWithMembers.map((group) => (
              <div className="card" key={group.Group_ID} style={{ marginRight: '80px', marginBottom: '20px' }}>
                <div className="card-title">
                  <h1>{group.Group_Name}</h1>
                </div>
                <div className="card-body">
                  <h3>Members:</h3>
                  <ul style={{listStyle:'none'}}>
                  {group.members && group.members.map((member) => {
                    console.log("Inside group.members map, member object is:", member);
                    return <li key={member.Account_Username}>
                      <img
                          src={`/${member.Account_Username}.png`} 
                          alt={`Profile picture of user ${member.User_ID}`}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                      />
                      {member.Account_Username}
                      </li>;
                  })}
                  </ul>
                  <Link href={`/groups/viewgroups/${group.Group_ID}`}> 
                    <button style={{marginRight: '30px'}}>View Group</button>
                  </Link>
                  <Link href={`/creategroup/editgroup/${group.Group_ID}`}> 
                    <button>Edit Group</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }