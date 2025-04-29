import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kes12359',
  database: 'task_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//The most recently created list
const recentList = async (userId) => {
  try {
      const query =
          'SELECT * from individual_list WHERE User_ID = ? ORDER BY IndList_ID DESC LIMIT 1';
      const [rows] = await pool.execute(query, [userId]);
      if (rows.length > 0) {
          return rows[0];
      } else {
          return null;
      }
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch data.');
  }
};

//The tasks within the recent list
const recentListTasks = async (IndList_ID) => {
  try {
      const query = 'SELECT il.IndList_ID, il.IndList_Name, il.IndList_Status, it.IndTask_ID, it.IndTask_Name, it.IndTask_Content, it.IndTask_Status FROM individual_list il LEFT JOIN individual_link ilt ON il.IndList_ID = ilt.IndList_ID LEFT JOIN individual_task it ON ilt.IndTask_ID = it.IndTask_ID WHERE il.IndList_ID = ?';

      const [rows] = await pool.execute(query, [IndList_ID]); 
      return rows;
  } catch (error) {
      console.error("Error fetching data", error);
      throw new Error("Failed to fetch data.");
  }
};

//The most recent group
const recentGroup = async (userId) => {
  try {
      const memberQuery = 'SELECT 1 FROM group_members WHERE User_ID = ? LIMIT 1';
      const [memberRows] = await pool.execute(memberQuery, [userId]);
      if (memberRows.length > 0) {

      const query = 'SELECT g.* FROM `group` g JOIN group_members gm ON g.Group_ID = gm.Group_ID WHERE gm.User_ID = ? ORDER BY g.Group_ID DESC LIMIT 1';
      
       const [rows] = await pool.execute(query, [userId]);
          if (rows.length > 0) {
              return rows[0];
          } else {
              return null;
          }
      } else {
          return null;
      }
  } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch data.');
  }
};

//Getting group members
const getGroupMembers = async (groupId) => {
  try {
      const query = 'SELECT a.Account_Username FROM account a JOIN user u ON a.Account_ID = u.Account_ID JOIN group_members gm ON u.User_ID = gm.User_ID WHERE gm.Group_ID = ?';
      const [rows] = await pool.execute(query, [groupId]);
      return rows;
  } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch data.');
  }
};

//Getting the Lists and Tasks of the group
const getGroupListsAndTasks = async (groupId) => {
  try {
    const query = `SELECT gl.GrpList_ID, gl.GrpList_Name, gl.GrpList_Status, JSON_ARRAYAGG( JSON_OBJECT( 'GrpTask_ID', gt.GrpTask_ID, 'GrpTask_Name', gt.GrpTask_Name, 'GrpTask_Content', gt.GrpTask_Content, 'GrpTask_Status', gt.GrpTask_Status ) ) AS tasks FROM group_list gl LEFT JOIN group_link glk ON gl.GrpList_ID = glk.GrpList_ID LEFT JOIN group_task gt ON glk.GrpTask_ID = gt.GrpTask_ID WHERE gl.Group_ID = ? GROUP BY gl.GrpList_ID, gl.GrpList_Name, gl.GrpList_Status ORDER BY gl.GrpList_ID`;
    
    const [rows] = await pool.execute(query, [groupId]);
    return rows;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch group lists and tasks.');
  }
};

//Getting the group name
const getGroupInfo = async (groupId) => {
  try {
    const query = 'SELECT Group_ID, Group_Name FROM `group` WHERE Group_ID = ?';
    
    const [rows] = await pool.execute(query, [groupId]);
    return rows;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch group information.');
  }
};

//Showing Lists
const showLists = async (userId) => {
    try {
      const query = 'SELECT * FROM individual_list WHERE User_ID = ?';

      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch lists.');
    }
  };

  //Showing Groups
  const showGroups = async (userId) => {
    try {
      const query = 
        'SELECT g.Group_ID, g.Group_Name FROM `group` g JOIN group_members gm ON g.Group_ID = gm.Group_ID WHERE gm.User_ID = ?' ;
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch groups.');
    }
  };

  //Showing Members
  const showMembers = async (groupId) => {
    try {
      const query = 'SELECT * FROM group_members WHERE Group_ID = ?';
      const [rows] = await pool.execute(query, [groupId]);
      return rows;
    } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch data.');
    }
  };

  //Getting user information
  const getUserDetails = async (userId) => {
    try {
      const query1 = 'SELECT * FROM user WHERE User_ID = ?';
      const [rows1] = await pool.execute(query1, [userId]);
      const query2 = 'SELECT * FROM account a INNER JOIN user u ON a.Account_ID = u.Account_ID WHERE u.User_ID = ?'
      const [rows2] = await pool.execute(query2, [userId]);
      return rows1, rows2;
    } catch (error) {
      console.error('Database Error', error);
      throw new Error('Failed to fetch data.');
    }
  };



  export {recentList, recentListTasks, recentGroup, getGroupMembers, getGroupListsAndTasks, showLists, showGroups, showMembers, getUserDetails, getGroupInfo};
