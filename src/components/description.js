import styles from './description.module.css'

export default function Description({text}) {
    return (
        <p className={styles.description}>{text}</p>
    )
}