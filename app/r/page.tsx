import type { Metadata } from "next";
import styles from "./links.module.css";
import { RESOURCES, isLive } from "@/lib/resources";

// Rebuilt hourly so a blueprint appears once its post is live
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ZeeBuild — links",
  description: "Every blueprint from @zee.build posts, the free blackout check, and how to work with Zee.",
};

// The Instagram bio link. Newest post first, so whatever someone just saw is at the top.
export default function LinkInBio() {
  const items = RESOURCES.filter((r) => isLive(r)).sort((a, b) => (b.posted ?? "").localeCompare(a.posted ?? ""));
  const [latest, ...rest] = items;
  return (
    <main className={styles.page}>
      <header className={styles.profile}>
        <div className={styles.mark}>zb</div>
        <h1 className={styles.name}>ZeeBuild</h1>
        <p className={styles.handle}>@zee.build · Dubai</p>
        <p className={styles.tag}>AI + fintech automation, explained so you can actually use it.</p>
      </header>

      {latest && (
        <a href={`/r/${latest.slug}`} className={styles.latest}>
          <span className={styles.badge}>FROM THE LATEST POST</span>
          {latest.thumb && <img src={latest.thumb} alt="" className={styles.latestImg} />}
          <span className={styles.latestTitle}>{latest.title}</span>
          <span className={styles.latestCta}>Get the free blueprint →</span>
        </a>
      )}

      <a href="/whatif" className={styles.row}>
        <img src="/posts/whatif/ep01-cover.jpg" alt="" className={styles.thumb} />
        <span className={styles.rowText}>
          <span className={styles.rowKicker}>SERIES · WHAT IF</span>
          <span className={styles.rowTitle}>Would your business survive the blackout? Free 60-second check</span>
        </span>
      </a>

      {rest.map((r) => (
        <a key={r.slug} href={`/r/${r.slug}`} className={styles.row}>
          {r.thumb ? <img src={r.thumb} alt="" className={styles.thumb} /> : <span className={styles.thumbBlank}>zb</span>}
          <span className={styles.rowText}>
            <span className={styles.rowKicker}>BLUEPRINT</span>
            <span className={styles.rowTitle}>{r.title}</span>
          </span>
        </a>
      ))}

      <a href="mailto:hello@zeebuild.com?subject=Automate%20my%20business" className={styles.contact}>
        Want this built for your business? Email Zee →
      </a>

      <footer className={styles.footer}>zeebuild.com</footer>
    </main>
  );
}
