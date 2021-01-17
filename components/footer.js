import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
    return (
        <footer className="pt-3 my-md-5 pt-md-5 border-top">
            <div className="row text-center align-items-center">
                <div className="col-12 col-md">
                    <small className="d-block mb-3 text-muted">Let's Ping It © 2020</small>
                </div>
                <div className="col-6 col-md">
                    <h5>Sobre nosotros</h5>
                    <ul className="list-unstyled text-small">
                    <li><a className="link-secondary" href="https://letspingit.com">La organización</a></li>
                    <li><a className="link-secondary" href="https://twitter.com/victorelexpe">Víctor Elexpe</a></li>
                    <li><a className="link-secondary" href="https://twitter.com/agfaya_">Alberto García</a></li>
                    <li><a className="link-secondary" href="https://twitter.com/RuymanPadron">Ruymán Padrón</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>Contacto</h5>
                    <ul className="list-unstyled text-small">
                    <li><a className="link-secondary" href="mailto:hello@letspingit.com"><FontAwesomeIcon icon={faEnvelope} width="24"/></a></li>
                    <li><a className="link-secondary" href="https://twitter.com/letspingit"><FontAwesomeIcon icon={faTwitter} width="24"/></a></li>
                    <li><a className="link-secondary" href="https://instagram.com/letspingit"><FontAwesomeIcon icon={faInstagram} width="24"/></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}