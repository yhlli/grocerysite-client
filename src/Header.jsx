import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export const address = 'http://localhost:5173'

export default function Header(){
    const {userInfo, setUserInfo} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProfile = async()=>fetch(`${address}/profile`).then(
            response=>{
                if (response.status===401){

                } else if (response){

                }else{
                    response.json().then(
                        userInfo=>{
                            setUserInfo(userInfo);
                        }
                    )
                }
            }
        )
    },[]);
    return(
        <header>
            <Link to={'/'} className="logo">Groceries</Link>
            {userInfo === null || userInfo === undefined ? (
                <>
                
                </>
            ) : (
                <>
                
                </>
            )}
            <Link to={'/login'} className="loginButton">Login</Link>
        </header>
    )
}