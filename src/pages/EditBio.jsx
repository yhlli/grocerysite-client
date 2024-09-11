import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { address } from "../Header";


export default function EditBio(){
    const {id} = useParams();
    const [content,setContent] = useState('');
    const [redirect,setRedirect] = useState(false);

    async function addBio(ev){
        const data = new FormData();
        data.set('content', content);
        ev.preventDefault();
        const storedTokens = localStorage.getItem('tokens');
        const {accessToken,refreshToken} = JSON.parse(storedTokens);
        const response = await fetch(`${address}/user/editbio/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'POST',
            body: data,
        });
        if (response.ok){
            setRedirect(true);
        }
    }

    if (redirect){
        return <Navigate to={`/user/${id}`} />
    }

    return(
        <form onSubmit={addBio}>
            <input type="text" 
                placeholder="Bio..."
                value={content}
                onChange={ev=>{setContent(ev.target.value)}} />
            <button id="createbtn" style={{marginTop:'5px'}}>Submit</button>
        </form>
    );
}