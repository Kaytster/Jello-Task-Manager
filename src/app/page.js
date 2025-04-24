'use client'
import Header from "./components/header";
import 'bootstrap/dist/css/bootstrap.css'
import './globals.css';
import './styles/landing.css';
import Link from "next/link";

export default function Home() {

  return (
    <>
        <Header />
        <main>
          <br/>
          <br/>
            <div className="row">
              <section className="card" style={{marginRight: '80px'}}>
                <div className="card-body">
                  <div className="card-title">
                    <h1>Welcome to Jello</h1>
                  </div>
                  <div className="card-value">
                    <p>With our Task Manager, you can easily keep your tasks organized with a list 
                    and share your tasks with others to work together.</p>
                    <p>With a Group Admin account, you can create groups for maximum collaboration.</p>
                    <p>To get started:</p>
                  </div>
                  <div id="introbuttons">
                  <Link href="/signup">
                    <button type="submit" className="signup">Sign Up</button>
                  </Link>
                    <p id="brk"></p>
                  <Link href="/login">
                    <button type="submit" className="login">Login</button>
                  </Link>
                  </div>
                </div>
              </section>
              <section className="card">
              <img 
                  src={`/example.jpg`} 
                  alt={`Profile picture of user`}
                  style={{ width: '100%', height: '300px',}} 
                  />
              </section>
            </div>
        </main>
      </>
  );
}
