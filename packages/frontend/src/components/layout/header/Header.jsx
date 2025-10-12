import './Header.css'
import Logo from './logo/Logo'
import RightMenu from './rightMenu/RightMenu';
import Searchbar from './searchbar/Searchbar';

export default function Header() {
    return (
        <header className="header">
            <Logo />
            <Searchbar />
            <RightMenu />
        </header>
    );
}