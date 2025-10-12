import './RightMenu.css'
import Login from './login/Login'
import Cart from './cart/Cart'

export default function RightMenu() {
    return (
        <div className="rightmenu-container">
            <Cart></Cart>
            <Login></Login>
        </div>
    );
}