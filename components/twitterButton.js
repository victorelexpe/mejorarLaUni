import styles from './twitterButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

export default function TwitterButton({title}) {
    return (
        <div className={styles.twitterButton}>
            <a 	href={'https://twitter.com/intent/tweet?text=' + '¡Nueva idea para ' + '&hashtags=MejorarLaUni' + "! -- " + "\n" + title + '. mejorarlauni.com/show'}
				target="_blank">
                <FontAwesomeIcon icon={faTwitter} width="24" title="Comparte en Twitter"/>
                
			</a>
        </div>
        
    )
}