import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { address } from "../Header";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function resetPassword(ev){
        ev.preventDefault();
        if (password !== confirmPassword){
            setError('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch(`${address}/reset-password`, {
                method: 'POST',
                body: JSON.stringify({ token, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                localStorage.removeItem('tokens');
                alert('Successfully reset password.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Failed to reset password: ', error);
            alert('An error occurred. Please try again.');
        }
    }
    return(
        <>
        <p style={{ fontSize: '2rem', textAlign: 'center' }}>Reset your password</p>
        <form className="loginDiv" onSubmit={resetPassword}>
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={ev=>setPassword(ev.target.value)} 
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)}
            />
            {error && (
                <>
                <p className="error" style={{ color: 'orange', textAlign: 'center' }}>{error}</p>
                </>
            )}
            <button className="loginSubmit">Submit</button>
        </form>
        </>
    );
}