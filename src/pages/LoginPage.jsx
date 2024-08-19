import { useState } from "react"

export default function LoginPage(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    async function login(ev){
        ev.preventDefault();
    }
    return(
        <>
            <form className="loginDiv" onSubmit={login}>
                <h1>Login</h1>
                <input type="text" placeholder="Username" value={username} onChange={ev=>setUsername(ev.target.value.toLowerCase())} />
                <input type="text" placeholder="Password" value={password} onChange={ev=>setPassword(ev.target.value)} />
                <button className="loginSubmit">Submit</button>
            </form>
        </>
    )
}