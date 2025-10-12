import './Login.css'
import { TbLogin2 } from "react-icons/tb";

export default function Login() {
    return (
        <div className="login-container">
            <button className="login-button" title="Iniciar Sesión">
                <TbLogin2 />
            </button>
        </div>  
    )
}