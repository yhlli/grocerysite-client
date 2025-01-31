import { useState } from "react";
import { address } from "../Header";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleForgotPassword(ev) {
        ev.preventDefault();
        const response = await fetch(`${address}/forgot-password`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok){
            setMessage('Password reset email sent. Please check your inbox.');
            setError('');
        }else{
            const errorData = await response.json();
            setError(errorData.message || 'Error sending password reset email');
        }
    }
    return (
        <>
            <form className="loginDiv" onSubmit={handleForgotPassword}>
                <h1>Forgot Password</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={ev => setEmail(ev.target.value.toLowerCase())}
                    required
                />
                
                <button className="loginSubmit">Submit</button>
                {message && <p className="success" style={{ color: 'lightgreen' }}>{message}</p>}
                {error && <p className="error" style={{ color: '#FA5F55' }}>{error}</p>}
                <p>
                    Remember your password? <Link style={{ 
                        textDecoration: 'none',
                        color: 'lightblue' }} to="/login">Login</Link>
                </p>
            </form>
        </>
    );
}