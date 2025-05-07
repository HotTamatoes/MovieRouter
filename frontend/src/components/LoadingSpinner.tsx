import './LoadingSpinner.css'
import reel from '../assets/reel.png'

export default function LoadingSpinner() {
    return <div className="spinner">
        <img src={reel} alt="Loading..." className='spinner-img' />
    </div>
}