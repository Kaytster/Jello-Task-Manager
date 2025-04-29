import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/create.css'
import '../globals.css';

export default function Create() {
    return (
      <>
          <Header />
          <main>
            <br/>
            <br/>
            <div className="card">
              <div className="card-title">
                <h1>What do you want to create?</h1>
              </div>
            </div>
            <div className="card-value">
              <Link href={"/createlist"}>
                <button type="submit" className="list">Task List</button>
              </Link>
                <p id="brk"></p>
              <Link href={"/creategroup"}>
                <button type="submit" className="group">Group</button>
              </Link>
            </div>
          </main>
          <Footer />
      </>
    );
  }