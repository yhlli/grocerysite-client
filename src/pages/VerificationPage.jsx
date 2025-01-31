import { useParams } from "react-router-dom"

export default function VerificationPage(){
    const verified = useParams();
    return(
        <>
        {verified ? (
            <>
            <p style={{ fontSize: '2rem', textAlign: 'center', color: 'lightgreen'}}>User verified!</p>
            </>
        ) : (
            <>
            <p>Failed to verify</p>
            </>
        )}
        </>
    )
}