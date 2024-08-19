import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <>
            <main>
                <div className="layout-container">
                    <Header />
                    <Outlet />
                </div>
            </main>
        </>
        
    );
}