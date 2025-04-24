import Header from "../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/members.css'

export default function CreateGroup() {
    return (
      <>
          <Header />
          <main>
            <br />
            <br />
            <div id='form'>
                <form>
                    <h2>Add Members</h2>
                    <div className="mb-3">
                        <label className="form-label"><b>First Name</b></label>
                        <input type="firstname" className="form-control" id="InputFirstName"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><b>Last Name</b></label>
                        <input type="lastname" className="form-control" id="InputLastName"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><b>User ID</b></label>
                        <input type="userid" className="form-control" id="InputUserID"/>
                    </div>
                    <button type="submit" id="small-btn">Add</button> 
                    <button type="submit" className="btn-primary">Done</button> 
                </form>
            </div>
          </main>
          </>
    );
  }