import { Link } from "react-router-dom"
export default function ErrorPage() {
    return (
    <>
        <p >
            This page does not exist.
        </p>
        <p>Go to the <Link to="/">Homepage</Link> </p>
    </>
    )
}