import type { Metadata } from "next";
import styles from "../whatif/whatif.module.css";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Blueprints — ZeeBuild",
  description: "Every blueprint promised in a ZeeBuild post, in one place.",
};

// The Instagram bio link: every post's blueprint, newest first
export default function ResourceHub() {
  const items = [...RESOURCES].sort((a, b) => b.posted.localeCompare(a.posted));
  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <span><i className={styles.dot} /> <b>ZEEBUILD OS</b> · BLUEPRINTS</span>
        <span>@zee.build</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>FROM THE POSTS</p>
        <h1 className={styles.h1}>Every <span className={styles.block}>blueprint</span>, in one place.</h1>
        <p className={styles.lede}>Saw it on Instagram? It&apos;s here. Newest first.</p>
      </section>

      <section className={styles.episodes}>
        <a href="/whatif" className={styles.episode}>
          <span className={styles.epNum}>SERIES · WHAT IF</span>
          <span className={styles.epTitle}>The blackout check</span>
          <span className={styles.epLine}>Would your business notice if the banks went dark? 60 seconds.</span>
        </a>
        {items.map((r) => (
          <a key={r.slug} href={`/r/${r.slug}`} className={styles.episode}>
            <span className={styles.epNum}>{r.kicker}</span>
            <span className={styles.epTitle}>{r.title}</span>
            <span className={styles.epLine}>{r.summary.slice(0, 110)}…</span>
          </a>
        ))}
      </section>

      <footer className={styles.footer}>
        <span className={styles.mark}>zb</span> ZeeBuild <em>OS</em>
      </footer>
    </main>
  );
}
