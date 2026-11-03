import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "../../whatif/whatif.module.css";
import { RESOURCES, getResource } from "@/lib/resources";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getResource((await params).slug);
  return r ? { title: `${r.title} — ZeeBuild`, description: r.summary } : {};
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getResource((await params).slug);
  if (!r) notFound();
  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <span><i className={styles.dot} /> <b>ZEEBUILD OS</b> · BLUEPRINTS</span>
        <a href="/r" className={styles.barLink}>all blueprints</a>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>{r.kicker}</p>
        <h1 className={styles.h1}>{r.title}</h1>
        <p className={styles.lede}>{r.summary}</p>
      </section>

      <section className={styles.plan}>
        <div className={styles.cards}>
          {r.sections.map((s, i) => (
            <article key={s.heading} className={styles.card}>
              <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.h3}>{s.heading}</h3>
              {s.points.map((p) => <p key={p}>{p}</p>)}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Would your business notice if this broke?</h2>
        <p>Take the free 60-second check, or tell me what eats your week and I&apos;ll reply with what I&apos;d automate first.</p>
        <a className={styles.button} href="/whatif#checklist">Take the 60-second check →</a>
        <p className={styles.small}><a href={`mailto:hello@zeebuild.com?subject=Blueprint%3A%20${r.slug}`} style={{ color: "inherit" }}>or email hello@zeebuild.com</a></p>
      </section>

      <footer className={styles.footer}>
        <span className={styles.mark}>zb</span> ZeeBuild <em>OS</em>
      </footer>
    </main>
  );
}
