import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './About.css';

export default function About() {
    return (
        <>
            <ul className="aboutList">
                <li>Get to know me: </li>
                <li><a href="https://github.com/HotTamatoes"><FontAwesomeIcon icon={faGithub}/> GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/cameron-holland-swe/"><FontAwesomeIcon icon={faLinkedin}/> Linkedin</a></li>
            </ul>
        </>
    )
}