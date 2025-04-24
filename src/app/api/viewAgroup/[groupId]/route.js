import { getGroupInfo, getGroupListsAndTasks } from '@/app/lib/db/showData';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const groupId = params.groupId;

  if (!groupId) {
    return NextResponse.json({ error: 'No Group ID' }, { status: 400 });
  }

  try {
    const groupInfo = await getGroupInfo(parseInt(groupId, 10));
    const lists = await getGroupListsAndTasks(parseInt(groupId, 10));

    return NextResponse.json({ groupInfo: groupInfo[0] || null, lists: lists });
  } catch (error) {
    console.error("API error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}