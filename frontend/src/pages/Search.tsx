import { useParams } from "react-router-dom";

export default function Search() {
    const params = useParams();
    
    return (
        <>
            <h1>{params.query}</h1>
        </>
    )
}