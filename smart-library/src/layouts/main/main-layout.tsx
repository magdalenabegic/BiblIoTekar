import Link from "next/link";

import ImgLogoTirkiz from "./assets/logo.svg";
import ImgAdmin from "./assets/admin.svg";
import ImgBarChart from "./assets/bar-chart.svg";
import ImgPolica from "./assets/polica.svg";
import ImgKnjige from "./assets/knjige.svg";
import ImgPending from "./assets/pending.svg";
import Image from "next/image";
import { cn } from "~/utils/css";
import { poppins } from "~/utils/font";

const img = (obj: { src: string; width: number; height: number }) => ({
  src: obj.src,
  width: obj.width,
  height: obj.height,
});

const Navbar = () => {
  return (
    <aside className="flex flex-col items-center bg-gray-100 px-4">
      <Link href="/">
        <div className="mt-12 flex items-start text-2xl">
          <Image {...img(ImgLogoTirkiz as never)} alt="logoTirkiz" className="w-8 h-8"/>
          <b>Bibl
            <span style={{ color: 'var(--pretty-green)' }}>IoT</span>
            ekar
          </b>
        </div>
      </Link>

      <div className="mt-32 flex flex-col gap-10 font-medium">
        <div className="flex gap-2">
          <Image {...img(ImgAdmin as never)} alt="admin" />
          Admin
        </div>

        <Link href="/reports">
          <div className="grid grid-cols-[minmax(0,1.5rem),minmax(0,1fr)] gap-2">
            <Image {...img(ImgBarChart as never)} alt="barChart" />
            Izvještaji
          </div>
        </Link>

        <Link href="/locations">
          <div className="grid grid-cols-[minmax(0,1.5rem),minmax(0,1fr)] gap-2">
            <Image {...img(ImgPolica as never)} alt="polica" />
            Pregled lokacija
          </div>
        </Link>

      <Link href="/pending">
        <div className="grid grid-cols-[minmax(0,1.5rem),minmax(0,1fr)] gap-2">
          <Image {...img(ImgPending as never)} alt="knjige" />
          Pending
        </div>
      </Link>

      </div>
    </aside>
  );
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className={cn(
          poppins.className,
          poppins.variable,
          "grid flex-1 grid-cols-[minmax(0,326px),minmax(0,1fr)] gap-2",
        )}
      >
        <Navbar />

        <main className="flex flex-col">{children}</main>
      </div>
    </>
  );
}
