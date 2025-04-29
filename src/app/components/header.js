'use client'
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css'
import { usePathname } from 'next/navigation';
import '../globals.css';
const Header = () => {
  const pathname = usePathname();
    return (
        <ul className="nav">
          <li className='logo'>
            <Link className="nav-link" href="/dashboard" aria-current={pathname === '/dashboard' ? 'page' : undefined}>
              <img src='\jellyfish.png' width={40} height={40} />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/tasklists" aria-current={pathname === '/tasklists' ? 'page' : undefined}>My Task Lists</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/groups" aria-current={pathname === '/groups' ? 'page' : undefined}>My Groups</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/create" aria-current={pathname === '/create' ? 'page' : undefined}>Create</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/account">Account</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="#">Settings</Link>
          </li>
        </ul>

        
    );
  };
  export default Header;