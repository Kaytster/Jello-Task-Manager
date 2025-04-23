//This function is used to update the passwords that were stored in the database before the site was created.
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function updatePasswords() {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'kes12359',
      database: 'task_management_system',
    });
  
    const [rows] = await connection.execute('SELECT Account_ID, Account_Password FROM account');
  
    for (const row of rows) {
      const hashedPassword = await bcrypt.hash(row.Account_Password, 10);
      await connection.execute('UPDATE account SET Account_Password = ? WHERE Account_ID = ?', [hashedPassword, row.Account_ID]);
    }
  
    console.log('Passwords updated!');
    connection.end();
  }
  
  updatePasswords();