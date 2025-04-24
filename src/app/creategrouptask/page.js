import Header from "../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/creategrouptask.css'

export default function CreateGroupTask() {
    return (
      <>
          <Header />
          <main>
            <br />
            <br />
            <div id='form'>
                <form>
                    <h2>Create a Task </h2>
                    <div className="mb-3">
                        <label className="form-label"><b>Name</b></label>
                        <input type="taskname" className="form-control" id="InputTaskName"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><b>Content</b></label>
                        <input type="taskcontent" className="form-control" id="InputTaskContent"/>
                    </div>
                    <button type="submit" className="btn-primary">Create</button> 
                </form>
            </div>
          </main>
          </>
    );
  }