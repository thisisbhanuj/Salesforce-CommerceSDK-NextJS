import styles from "./page.module.css";
import TestPage from "../testfns/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>SFCC Isomorphic SCAPI Repo</div>
      <TestPage />
    </main>
  );
}
