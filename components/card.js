import styles from './card.module.css'
import TwitterButton from '../components/twitterButton'

export default function Card({title, description, university}) {
    return (
        <div className={styles.card}>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>{university}</p>
            <TwitterButton title={title} />
        </div>
    )
}