import styles from './twitterButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

export default function TwitterButton({title, id}) {
    return (
        <div className={styles.twitterButton}>
            <a className="text-primary fw-bold"href={'https://twitter.com/intent/tweet?text=' + 'He añadido una nueva idea para' + '&hashtags=MejorarLaUni' + "! 👩‍🎓%10" + title + ".%10" + 'mejorarlauni.com/%23' + id + "\n ¿Qué opináis?"}
				target="_blank">
                <FontAwesomeIcon icon={faTwitter} width="24"/>
                &nbsp; Comparte en Twitter
			</a>
        </div>
        
    )
}