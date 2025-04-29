'use server'
import Header from "../components/header";
import Footer from "../components/footer";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/account.css';
import { cookies } from "next/headers";
import { getUserDetails } from "../lib/db/showData";

async function getUserDeets(userId) {
  const details = await getUserDetails(userId);
  const FullDetails = await Promise.all(details.map(async (Deets) => {
      return { ...Deets };
  }));
  return FullDetails;
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

    const FullDetails = await getUserDeets(userId);

  return (
    <>
        <Header />
        <main>
          <br/>
          <br/>
          <div className="row"> 
            <div className="card" style={{width:'fit-content'}}>
              <img
                  src={`/${userId}.png`} 
                  alt={`Profile picture of user`}
                  style={{ width: '300px', height: '300px', borderRadius: '50%', margin: 'auto' }} 
              />
            </div>
          {FullDetails.map((Deets) => (
              <div className="card">
                    <h2 key={Deets.User_ID}>Name: {Deets.User_Fname} {Deets.User_Lname}</h2>
                    <h2>User ID: {userId}</h2>
                    <h2 key={Deets.User_ID}>Username: {Deets.Account_Username}</h2>
                    <h2 key={Deets.User_ID}>Email: {Deets.Account_Email}</h2>
                    <h2 key={Deets.User_ID}>Account Type: {Deets.Account_Type}</h2>
              </div>
))}
            </div>
        </main>
        <Footer />
      </>
  );
}
