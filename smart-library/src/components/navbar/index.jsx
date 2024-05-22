import React from 'react';
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav>
      <ul className={styles.navbar}>
        <li><a href="#">Admin</a></li>
        <li><a href="#">Pregled polica</a></li>
        <li><a href="#">Izještaji</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;