import styles from './footer.module.css'
import Link from 'next/link'

export default function Footer() {
    return (
        <div className={styles.footer}>
            <Link href="https://letspingit.com">
                Por Let's Ping It
            </Link>
        </div>
    )
}