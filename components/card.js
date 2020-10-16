import styles from './card.module.css'
import TwitterButton from '../components/twitterButton'

export default function Card({title, description}) {
    return (
        <div className={styles.card}>
            <h3>{title}</h3>
            <p>{description}</p>
            <TwitterButton title={title} />
        </div>
    )
}