import { Outlet } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import "./Layout.css";

export default function Layout() {
    return(
        <div className="layout-container">
          <Header />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
    )
}