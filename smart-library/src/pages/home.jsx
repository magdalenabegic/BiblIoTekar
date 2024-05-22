import Image from 'next/image';
import Link from "next/link";

import styles from "./index.module.css";

import logoTirkiz from "../../public/logoTirkiz.svg";
import admin from "../../public/admin.svg";
import barChart from "../../public/barChart.svg";
import polica from "../../public/polica.svg";
import knjige from "../../public/knjige.svg";

const Home = () => {
  return (
    <div className={styles.desktop1}>
      <div className={styles.desktop1Child} />
      <div className={styles.smartlibraryWrapper}>
        <Image src={logoTirkiz} className={styles.logoTirkiz} alt="logoTirkiz" />
        <b className={styles.smartlibrary}>SmartLibrary</b>
      </div>

      <div className={styles.admin}>
        <Image src={admin} alt="admin" />
        Admin
      </div>
      <Link href="/reports">
        <div className={styles.izvjestaji}>
            <Image src={barChart} alt="barChart" />
            Izvještaji
        </div>
      </Link>
      <Link href="/shelves">
        <div className={styles.pregledPolica}>  
            <Image src={polica} alt="polica" />
            Pregled polica
        </div>
      </Link>
      <div className={styles.izvanPolice}>
        <Image src={knjige} alt="knjige" />
        Izvan police
      </div>
    </div>
  );
};

export default Home;
