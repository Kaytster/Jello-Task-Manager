import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool(
  process.env.DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: 'kes12359',
  database: 'task_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//This is a test function to make sure that the database is connected properly
const showData = async () => {
  try {
      const query = "SELECT * FROM account"; 
      const [rows] = await pool.execute(query); 
      return rows;
  } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch data.");
  }
};

//Execute function
async function execute(query, params) {
  let connection;

  try {
    connection = await pool.getConnection();

    if (
      query === 'START TRANSACTION' ||
      query === 'COMMIT' ||
      query === 'ROLLBACK'
    ) {
      await connection.query(query);
    } else {
      const [rows, fields] = await connection.execute(query, params);
      return [rows, fields]; 
    }
  } catch (error) {
    console.error('Database query error', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Getting accounts
const fetchAccounts = async () => {
  try {
    const query = 'SELECT * from account';
    return await execute(query);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
};

//Verifying user credentials for logging in
const verifyUserCredentials = async (username, password) => {
  try {
    const query = 'SELECT Account_Password FROM account WHERE Account_Username = ?';
    const [rows] = await execute(query, [username]);

    if (rows.length === 0) {
      return false; 
    }

    const user = rows[0];
    return await bcrypt.compare(password, user.Account_Password);
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to verify user credentials.');
  }
};

//Function for logging in
async function handleLogin(username, password) {
  try {
    const accountQuery = 'SELECT Account_ID, Account_Password, Account_Type FROM account WHERE Account_Username = ?'; 
    const [accountRows] = await execute(accountQuery, [username]);

    if (accountRows && accountRows.length > 0) {
      const account = accountRows[0];
      const passwordMatch = await bcrypt.compare(password, account.Account_Password);

      if (passwordMatch) {
        const accountId = account.Account_ID;
        const accountType = account.Account_Type; 

        const userQuery = 'SELECT User_ID FROM user WHERE Account_ID = ?';
        const [userRows] = await execute(userQuery, [accountId]);

        if (userRows && userRows.length > 0) {
          const userId = userRows[0].User_ID;

          if (userId) {

            return { userId, accountType };
          }
        } else {
          console.error('User not found for this account');
          return null;
        }
      } else {
        console.error('Password does not match');
        return null;
      }
    } else {
      console.error('Account not found');
      return null;
    }
  } catch (error) {
    console.error('Database Error', error);
    return null;
  }
}

//Verifying account creation for signup
const verifyAccountCreation = async (
  firstname,
  lastname,
  email,
  username,
  hashedPassword,
  type
) => {
  try {
    await execute('START TRANSACTION');

    try {
      const insertAccountQuery = 'INSERT INTO Account (Account_Email, Account_Username, Account_Password, Account_Type) VALUES (?, ?, ?, ?)';

      const [result] = await execute(insertAccountQuery, [
        email,
        username,
        hashedPassword,
        type,
      ]);

      const getAccountIdQuery = 'SELECT LAST_INSERT_ID()';
      const [accountIdResult] = await execute(getAccountIdQuery);
      const accountId = accountIdResult[0]['LAST_INSERT_ID()'];

      const insertUserQuery =
        'INSERT INTO user (User_Fname, User_Lname, Account_ID) VALUES (?, ?, ?)';
        const [userResult] = await execute(insertUserQuery, [firstname, lastname, accountId]);
        const userId = userResult.insertId;
      

      await execute('COMMIT');
      return true;
    } catch (error) {
      console.error('Database error during account creation', error);
      await execute('ROLLBACK');
      return false;
    }
  } catch (error) {
    console.error('Error', error);
    return false;
  }
};

//Creating an Individual List
const createTaskList = async (listID, listName, listStatus, userID) => {
  try {
    const query = 'INSERT INTO individual_list (IndList_Name) VALUES (?)';
    await execute(query, [listName]);
    return true;
  } catch (error) {
    await execute('ROLLBACK');
    return false;
  }
};

//Verifying the creation of an Individual List
const verifyListCreation = async (
  name,
  status
) => {
  try {
    await execute('START TRANSACTION');

    try {
      const insertListQuery = 'INSERT INTO individual_list (IndList_Name, IndList_Status) VALUES (?, ?)';
      
      const [result] = await execute(insertListQuery, [
        name,
        status
      ]);

      const getListIdQuery = 'SELECT LAST_INSERT_ID()';
      const [listIdResult] = await execute(getListIdQuery);
      const listId = listIdResult[0]['LAST_INSERT_ID()'];

      const insertUserQuery =
        'INSERT INTO user (User_Fname, User_Lname, Account_ID) VALUES (?, ?, ?)';
        const [userResult] = await execute(insertUserQuery, [firstname, lastname, accountId]); 
        const userId = userResult.insertId; 

      await execute('COMMIT');
      return true;
    } catch (error) {
      console.error('Database error during list creation', error);
      await execute('ROLLBACK');
      return false;
    }
  } catch (error) {
    console.error('Error', error);
    return false;
  }
};

//Verifying the creation of an Individual Task
const verifyTaskCreation = async (
  name,
  content
) => {
  try {
    await execute('START TRANSACTION');

    try {
      const insertTaskQuery = 'INSERT INTO individual_task (IndTask_Name, IndTask_Content) VALUES (?, ?)';
      

      const [result] = await execute(insertTaskQuery, [
        name,
        content
      ]);

      const getTaskIdQuery = 'SELECT LAST_INSERT_ID()';
      const [taskIdResult] = await execute(getTaskIdQuery);
      const taskId = taskIdResult[0]['LAST_INSERT_ID()'];

      const insertUserQuery =
        'INSERT INTO user (User_Fname, User_Lname, Account_ID) VALUES (?, ?, ?)';
        const [userResult] = await execute(insertUserQuery, [firstname, lastname, accountId]); 
        const userId = userResult.insertId;  

      await execute('COMMIT');
      return true;
    } catch (error) {
      console.error('Database error during account creation', error);
      await execute('ROLLBACK');
      return false;
    }
  } catch (error) {
    console.error('Error', error);
    return false;
  }
};

//Creating an Individual Task and linking it to the correct List
const createTaskAndLinkToList = async (name, content, status, listId) => {
  try {
      await execute('START TRANSACTION');

      try {
          const insertTaskQuery = 'INSERT INTO individual_task (IndTask_Name, IndTask_Content, IndTask_Status) VALUES (?, ?, ?)';
          
          const [taskResult] = await execute(insertTaskQuery, [name, content, status]);
          const taskId = taskResult.insertId;

          const linkTaskToListQuery = 'INSERT INTO Individual_Link (IndList_ID, IndTask_ID) VALUES (?, ?)';
          
          await execute(linkTaskToListQuery, [listId, taskId]);

          await execute('COMMIT');
          return true;
      } catch (error) {
          await execute('ROLLBACK');
          console.error('Database error during task creation', error);
          return false;
      }
  } catch (error) {
      console.error('Error', error);
      return false;
  }
};

//Creating a Group
const createGroup = async (groupID, groupName) => {
  try {
    const query = 'INSERT INTO `group` (Group_Name) VALUES (?)';
    await execute(query, [groupName]);
    return true;
  } catch (error) {
    await execute('ROLLBACK');
    console.error('Database Error', error);
    return false;
  }
};

//Verifying the creation of a Group
const verifyGroupCreation = async (
  name
) => {
  try {
    await execute('START TRANSACTION');

    try {
      const insertGroupQuery = 'INSERT INTO `group` (Group_Name) VALUES (?)';

      const [result] = await execute(insertGroupQuery, [
        name
      ]);

      const getGroupIdQuery = 'SELECT LAST_INSERT_ID()';
      const [groupIdResult] = await execute(getGroupIdQuery);
      const groupId = groupIdResult[0]['LAST_INSERT_ID()'];

      await execute('COMMIT');
      return true;
    } catch (error) {
      console.error('Database error during group creation:', error);
      await execute('ROLLBACK');
      return false;
    }
  } catch (error) {
    console.error('Error', error);
    return false;
  }
};

//Adding a Member to a Group
const addMemberToGroup = async (userId, groupId) => {
  try {
    const query = 'INSERT INTO group_members (User_ID, Group_ID) VALUES (?, ?)';

    const [result] = await execute(query, [userId, groupId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database error adding a member to the group', error);
    return false;
  }
};

//Creating a Group List
const createGroupList = async (grplistID, grplistName, grplistStatus, groupId) => {
  try {
    const query = 'INSERT INTO group_list (GrpList_Name) VALUES (?)';
    await execute(query, [grplistName]);
    return true;
  } catch (error) {
    await execute('ROLLBACK');
    console.error('Database Error', error);
    return false;
  }
};

const verifyGrpListCreation = async (
  grpname,
  grpstatus
) => {
  try {
    await execute('START TRANSACTION');

    try {
      const insertGrpListQuery = 'INSERT INTO group_list (GrpList_Name, GrpList_Status) VALUES (?, ?)';
      
      const [result] = await execute(insertGrpListQuery, [
        grpname,
        grpstatus
      ]);

      const getGrpListIdQuery = 'SELECT LAST_INSERT_ID()';
      const [grpListIdResult] = await execute(getGrpListIdQuery);
      const grpListId = grpListIdResult[0]['LAST_INSERT_ID()'];

      await execute('COMMIT');
      return true;
    } catch (error) {
      console.error('Database error during List creation', error);
      await execute('ROLLBACK');
      return false;
    }
  } catch (error) {
    console.error('Error', error);
    return false;
  }
};

//Creating a Group Task and linking it to the correct List
const createGrpTaskAndLinkToGrpList = async (grpname, grpcontent, grpstatus, grplistId) => {
  try {
      await execute('START TRANSACTION');

      try {
          const insertTaskQuery = 'INSERT INTO group_task (GrpTask_Name, GrpTask_Content, GrpTask_Status) VALUES (?, ?, ?)';
          const [grpTaskResult] = await execute(insertGrpTaskQuery, [grpname, grpcontent, grpstatus]);
          const grpTaskId = grpTaskResult.insertId;

          const linkGrpTaskToGrpListQuery = 'INSERT INTO group_link (GrpList_ID, GrpTask_ID) VALUES (?, ?)'
          await execute(linkGrpTaskToGrpListQuery, [grplistId, grptaskId]);

          await execute('COMMIT');
          return true;
      } catch (error) {
          await execute('ROLLBACK');
          console.error('Database error during task creation', error);
          return false;
      }
  } catch (error) {
      console.error('Error', error);
      return false;
  }
};

export {
  showData,
  fetchAccounts,
  verifyUserCredentials,
  verifyAccountCreation,
  createTaskList,
  handleLogin,
  verifyListCreation,
  verifyTaskCreation,
  createTaskAndLinkToList,
  createGroup,
  verifyGroupCreation,
  addMemberToGroup,
  createGroupList,
  verifyGrpListCreation,
  createGrpTaskAndLinkToGrpList,
  execute
};