import Link from "next/link"

import styles from "./shelves.module.css"
import Home from "../home"
export const getServerSideProps = async (context) => {
    return {
        props: {
            name: context.params.shelves
        }
    }
}
 
export default function PageIndex() {
    return (
        <>
            <div>
                <Home/>
            </div>
                <div className={styles.container}>
                <p>Ovdje će biti pregled polica</p>
                <br/>
                <Link href="/home">Nazad</Link>
            </div>
        </>
    )
}