import Link from "next/link"

export const getServerSideProps = async (context) => {
    return {
        props: {
            name: context.params.ime
        }
    }
}

export default function PageIndex({ name }) {
    return (
        <div>
            Bok, {name}!

            <Link href="/home">Bok home</Link>
        </div>
    )
}