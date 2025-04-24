import Header from "../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/creategrouplist.css'

export default function CreateGroupList() {
    return (
      <>
          <Header />
          <main>
            <br />
            <br />
            <div id='form'>
                <form>
                    <h2>Create a Task List</h2>
                    <div className="mb-3">
                        <label className="form-label"><b>Name</b></label>
                        <input type="listname" className="form-control" id="InputListName"/>
                    </div>
                    <button type="submit" className="btn-primary">Create</button> 
                </form>
            </div>
          </main>
          </>
    );
  }