import Link from "next/link";
import { useRouter } from 'next/router';

import ImgLogoTirkiz from "./assets/logo.svg";
import ImgAdmin from "./assets/admin.svg";
import ImgBarChart from "./assets/bar-chart.svg";
import ImgPolica from "./assets/polica.svg";
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
  const router = useRouter();
  const currentPath = router.pathname;

  const currentPage = (path: string) => {
    return currentPath === path ? 'bg-pretty-green text-white rounded-full' : 'text-black';
  };

  const currentIcon = (path: string) => {
    return currentPath === path ? 'icon-white' : 'icon-black';
  };

  return (
    <aside className="flex flex-col items-center bg-gray-100 px-4">
      <Link href="/">
        <div className="mt-12 flex items-start text-3xl">
          <Image {...img(ImgLogoTirkiz as never)} alt="logoTirkiz" className="w-8 h-8"/>
          <b>Bibl
            <span style={{ color: 'var(--pretty-green)' }}>IoT</span>
            ekar
          </b>
        </div>
      </Link>

      <div className="mt-32 flex flex-col gap-10 font-medium">
        <Link href="/admin">
          <div className={`flex items-center gap-2 px-4 py-2 ${currentPage('/admin')}`}>
            <Image {...img(ImgAdmin as never)} alt="admin" className={currentIcon('/admin')} />
            Admin
          </div>
        </Link>

        <Link href="/reports">
          <div className={`flex items-center gap-2 px-4 py-2 ${currentPage('/reports')}`}>
            <Image {...img(ImgBarChart as never)} alt="barChart" className={currentIcon('/reports')} />
            Izvještaji
          </div>
        </Link>

        <Link href="/locations">
          <div className={`flex items-center gap-2 px-4 py-2 ${currentPage('/locations')}`}>
            <Image {...img(ImgPolica as never)} alt="polica" className={currentIcon('/locations')} />
            Pregled lokacija
          </div>
        </Link>

        <Link href="/pending">
          <div className={`flex items-center gap-2 px-4 py-2 ${currentPage('/pending')}`}>
            <Image {...img(ImgPending as never)} alt="knjige" className={currentIcon('/pending')} />
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
