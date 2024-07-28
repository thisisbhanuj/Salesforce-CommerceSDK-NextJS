import styles from "./page.module.css";
import TestPage from "../testfns/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.center}>SFCC Isomorphic SCAPI Repo</h1>
        <h1>Page to test Serverless Functions / API calls</h1>
      </div>
      <TestPage />
    </main>
  );
}
