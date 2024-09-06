import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

//export const address = 'http://localhost:8080'
export const address = 'https://grocerysite-server.onrender.com'

export default function Header(){
    const {setUserInfo,userInfo} = useContext(UserContext);
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [country, setCountry] = useState('');
    const [vIp, setVIp] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const storedTokens = localStorage.getItem('tokens');
        const fetchProfile = async ()=>{
            try {
                if (storedTokens){
                    const {accessToken,refreshToken} = JSON.parse(storedTokens);
                    const response = await fetch(`${address}/profile`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'x-refresh-token': refreshToken
                        },
                        method: 'GET'
                    });
                    if (response.ok){
                        const data = await response.json();
                        setUserInfo(data);
                    } else{
                        console.log('Failed to fetch profile')
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchip = async () => await fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(res => {
                setVIp(res.ip)
                setCity(res.city)
                setRegion(res.region_code)
                setCountry(res.country_code)
        });
        fetchProfile();
        fetchip();
    },[]);

    const logout = async ()=>{
        localStorage.removeItem('tokens');
        setUserInfo(null);
        navigate('/index');
    }

    return(
        <header>
        <Link to="/" className="logo">Luke's Blog</Link>
        <Link to="/weather" className="location">{city}, {region} {country}</Link>
        <nav>
            <ul id="menu">
            <li><Link to="/about">About</Link>
                <ul>
                <li><a href="https://github.com/yhlli" target="_blank">Github</a></li>
                <li><a href="https://www.linkedin.com/in/luke-li-398787142" target="_blank">LinkedIn</a></li>
                <li><Link to="/resume">My Resume</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/blackjack">Blackjack</Link></li>
                {userInfo !== null && <li><Link to={`${userInfo.username}/grocery`}>Grocery List</Link></li>}
                </ul>
            </li>
            {(userInfo && userInfo.username) ? (
                <>
                <li><Link to="/create">Create Post</Link></li>
                <li><Link to={`/user/${userInfo.username}`}>My Profile</Link></li>
                <li><Link onClick={() => logout()}>Logout</Link></li>
                </>
            ) : (
                <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                </>
            )}  
            </ul>
        </nav>
        </header>
    )
}