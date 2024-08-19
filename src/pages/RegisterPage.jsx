import { useState } from "react";

export default function RegisterPage(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    async function register(ev){
        ev.preventDefault();
        
    }
    return(
        <>
            <form className="loginDiv" onSubmit={register}>
                <h1>Register</h1>
                <input type="text" placeholder="Username" value={username} onChange={ev=>setUsername(ev.target.value.toLowerCase())} />
                <input type="text" placeholder="Password" value={password} onChange={ev=>setPassword(ev.target.value)} />
                <button className="loginSubmit">Submit</button>
            </form>
        </>
    )
}