import styles from './emoji.module.css'

export default function Emoji({emoji}) {
    return (
        <p className={styles.emoji}>{emoji}</p>
    )
}