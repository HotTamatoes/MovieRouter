import './LoadingSpinner.css'
import reel from '../assets/Reel.png'

export default function LoadingSpinner() {
    return (
    <>
        <div className="spinner">
            <img src={reel} className='spinner-img' />
        </div>
    </>
    )
}