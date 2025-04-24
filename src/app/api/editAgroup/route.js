import { execute, addMemberToGroup } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const requestData = await req.json(); 

    const { action } = requestData;

    if (action === 'addMember') {
      const { userid, groupId } = requestData;
      if (!userid || !groupId) {
        return NextResponse.json({ message: 'User ID and Group ID are needed', status: 400 });
      }
      try {
        const success = await addMemberToGroup(userid, groupId);
        if (success) {
          return NextResponse.json({ message: 'Member added successfully!', status: 201 });
        } else {
          return NextResponse.json({ message: 'Failed to add a member to the group.', status: 500 });
        }
      } catch (error) {
        console.error('Error adding member', error);
        return NextResponse.json({ message: 'Something went wrong', status: 500 });
      }
    } else if (action === 'addList') {
      const { name: grpname, status: grpstatus, groupId } = requestData;
      if (!grpname || !groupId) {
        return NextResponse.json({ message: 'List name and Group ID are needed', status: 400 });
      }
      try {
        const insertGrpListQuery = 'INSERT INTO group_list (GrpList_Name, GrpList_Status, Group_ID) VALUES (?, ?, ?)';

        const [result] = await execute(insertGrpListQuery, [grpname, grpstatus, groupId]);

        if (result && result.insertId) {
          return NextResponse.json({ message: 'List created successfully!', listId: result.insertId, status: 201 });
        } else {
          return NextResponse.json({ message: 'Failed to create a list in the database.', status: 500 });
        }
      } catch (error) {
        console.error('Database error creating list', error);
      }
    } else {
      return NextResponse.json({ message: 'Unknown action', status: 400 });
    }
  } catch (error) {
    console.error('Error', error);
  }
}