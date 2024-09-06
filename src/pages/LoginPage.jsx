import { useContext, useState } from "react"
import { address } from "../Header";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev){
        ev.preventDefault();
        const response = await fetch(`${address}/login`, {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'}
        })
        if (response.ok){
            const {accessToken, refreshToken} = await response.json();
            localStorage.setItem('tokens', JSON.stringify({accessToken,refreshToken}));
            setUserInfo()
            setRedirect(true);
        } else {
            alert('Login failed')
        }
    }
    if (redirect){
        return <Navigate to={'/'} />
    }
    return(
        <>
            <form className="loginDiv" onSubmit={login}>
                <h1>Login</h1>
                <input type="text" placeholder="Username" value={username} onChange={ev=>setUsername(ev.target.value.toLowerCase())} />
                <input type="password" placeholder="Password" value={password} onChange={ev=>setPassword(ev.target.value)} />
                <button className="loginSubmit">Submit</button>
            </form>
        </>
    )
}