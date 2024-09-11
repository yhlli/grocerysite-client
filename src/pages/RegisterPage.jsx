import { useState } from "react";
import { address } from "../Header";
import { Navigate } from "react-router-dom";

export default function RegisterPage(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);

    async function register(ev){
        ev.preventDefault();
        const response = await fetch(`${address}/register`, {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'}
        })
        if (response.status === 200){
            alert('Registration successful');
            setRedirect(true);
        } else {
            alert('Registration failed')
        }
    }
    if (redirect){
        return <Navigate to={'/login'} />
    }
    return(
        <>
            <form className="loginDiv" onSubmit={register}>
                <h1>Register</h1>
                <input type="text" placeholder="Username" value={username} onChange={ev=>setUsername(ev.target.value.toLowerCase())} />
                <input type="password" placeholder="Password" value={password} onChange={ev=>setPassword(ev.target.value)} />
                <button className="loginSubmit">Submit</button>
            </form>
        </>
    )
}