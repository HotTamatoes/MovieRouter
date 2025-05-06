import { useState, useEffect } from "react";

export default function Genres() {
    const [refresh, setRefresh] = useState(false);
    const [backendData, setBackendData] = useState('');

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://localhost:8080/api/test")
            setBackendData(await res.text())
        }
        getData()
        return
    }, [refresh])

    return (
    <>
        <button onClick={() => setRefresh(!refresh)}>Reload</button>
        <p >
            Message: {backendData}
        </p>
    </>
    )
}
