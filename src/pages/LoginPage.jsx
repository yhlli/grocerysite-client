import { useContext, useState } from "react"
import { address } from "../Header";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    const [error, setError] = useState('');
    const [notverified, setNotverified] = useState(false);
    const [email, setEmail] = useState('');

    async function login(ev){
        ev.preventDefault();
        const response = await fetch(`${address}/login`, {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'}
        })
        if (response.ok){
            const {accessToken, refreshToken, id, username} = await response.json();
            localStorage.setItem('tokens', JSON.stringify({accessToken,refreshToken}));
            setUserInfo({id,username})
            setRedirect(true);
        } else {
            const errorData = await response.json();
            if (errorData.message === 'Email not verified'){
                setError('Please verify your email before logging in.');
                setNotverified(true);
            } else{
                setError('Invalid credentials');
            }
            
        }
    }

    async function resendVerification(ev){
        ev.preventDefault();
        const response = await fetch(`${address}/resend-verification`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok){
            alert('Verification email sent.');
        } else{
            alert('Failed to resend verification email.');
        }
    }

    if (redirect){
        return <Navigate to={'/'} />
    }
    return(
        <>
            <form className="loginDiv" onSubmit={login}>
                <h1>Login</h1>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={ev=>setUsername(ev.target.value.toLowerCase())}
                 />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={ev=>setPassword(ev.target.value)} 
                />
                <button className="loginSubmit">Submit</button>
                {error && (
                    <>
                    <p className="error" style={{ color: 'orange' }}>{error}</p>
                    {notverified && (
                        <>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            value={email} 
                            onChange={ev=>setEmail(ev.target.value.toLowerCase())}
                        />
                        <button type="button" className="loginSubmit" onClick={resendVerification}>Resend Verification</button>
                        </>
                    )}
                    </>
                )}
                
                <p>
                    Forgot your password? <Link style={{ 
                        textDecoration: 'none',
                        color: 'lightblue' }} to={'/forgot-password'}>Reset password</Link>
                </p>
            </form>
        </>
    )
}