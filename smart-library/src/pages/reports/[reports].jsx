import Link from "next/link"

import styles from "./reports.module.css"
import Home from "../home"
export const getServerSideProps = async (context) => {
    return {
        props: {
            name: context.params.reports
        }
    }
}

export default function PageIndex({ name }) {
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