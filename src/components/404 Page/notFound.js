import React from "react";
import { Link } from "react-router-dom";
import Robot from "./cat.svg";
import styles from "./notFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <img src={Robot} alt='page not found' />
        <span>Awww the page you are looking for is not found !</span>
        <Link to='/home'>Go Back</Link>
      </div>
    </div>
  );
}
