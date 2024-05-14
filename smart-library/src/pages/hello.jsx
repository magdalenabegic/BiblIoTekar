import Link from "next/link"


export default function PageIndex() {
    return (
        <div>
            Bok
            <br />

            <Link href="/bok/ja/sam/andrija">Bok Andrija</Link>

            <Link href="/bok/ja/sam/Sisoje">Bok Sisoje</Link>

        </div>
    )
}