import Link from "next/link"

import styles from "./index.module.css"
import Home from "../home"

export default function PageIndex() {
    return (
        <>
            <div>
                <Home/>
            </div>
                <div className={styles.container}>
                <p>Ovdje će se prikazati razni izvještaji polica</p>
                <br/>
                <Link href="/home">Nazad</Link>
            </div>
        </>
    )
}