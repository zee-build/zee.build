import styles from "./whatif.module.css";

// The one page every What If reel DM links to. Each episode has its own anchor (#ep01, #ep02)
// so a reel's DM can point straight at the part it promised.

const EPISODES = [
  { id: "ep01", n: "EP 01", title: "Every bank goes dark for 60 seconds", line: "Cards hang, payroll freezes, and some businesses never notice." },
  { id: "ep02", n: "EP 02", title: "The banks don't come back", line: "A whole day offline. Most businesses freeze. A few keep taking orders." },
];

const BACKUP_PLAN = [
  {
    k: "01",
    title: "Orders that queue themselves",
    what: "When a payment can't go through, the order is logged and saved instead of lost, then charged automatically the moment payments work again.",
    feels: "Nobody refreshes. Nothing falls through the cracks.",
  },
  {
    k: "02",
    title: "Customers told before they ask",
    what: "The second something goes wrong, every affected customer gets one calm message: what happened, that their order is safe, and what happens next.",
    feels: "Fewer angry emails. More trust.",
  },
  {
    k: "03",
    title: "Invoices and follow-ups on autopilot",
    what: "Invoices go out, reminders follow up, and receipts send themselves, whether you're at your desk or asleep.",
    feels: "The business keeps moving without you holding it.",
  },
];

const CHECKLIST = [
  "If card payments failed for an hour, would you still keep every order?",
  "Do customers hear from you before they have to ask?",
  "Do invoices send without someone remembering to send them?",
  "Do failed payments and tasks retry by themselves, without anyone redoing them?",
  "If you were asleep, would the business still log every order?",
  "Is there one place that shows you what's stuck right now?",
];

export default function WhatIfPage() {
  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <span><i className={styles.dot} /> <b>ZEEBUILD OS</b> · WHAT IF</span>
        <span>EP 01–02</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>YOU CAME FROM THE REEL</p>
        <h1 className={styles.h1}>
          The businesses that <span className={styles.block}>slept</span> through it.
        </h1>
        <p className={styles.lede}>
          Every episode of What If ends the same way: most businesses freeze, and a few don&apos;t even notice.
          This page is what those few built.
        </p>
      </section>

      <section className={styles.episodes}>
        {EPISODES.map((e) => (
          <a key={e.id} id={e.id} href={`#plan`} className={styles.episode}>
            <span className={styles.epNum}>{e.n}</span>
            <span className={styles.epTitle}>{e.title}</span>
            <span className={styles.epLine}>{e.line}</span>
          </a>
        ))}
      </section>

      <section id="plan" className={styles.plan}>
        <p className={styles.kicker}>THE DIFFERENCE ISN&apos;T MONEY</p>
        <h2 className={styles.h2}>
          It&apos;s <s className={styles.strike}>the boring stuff</s> <span className={styles.marker}>the backup plan.</span>
        </h2>
        <div className={styles.cards}>
          {BACKUP_PLAN.map((b) => (
            <article key={b.k} className={styles.card}>
              <span className={styles.cardNum}>{b.k}</span>
              <h3 className={styles.h3}>{b.title}</h3>
              <p>{b.what}</p>
              <p className={styles.feels}>{b.feels}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="checklist" className={styles.checklist}>
        <p className={styles.kicker}>FREE · 60-SECOND CHECK</p>
        <h2 className={styles.h2}>Would your business notice the blackout?</h2>
        <ul className={styles.checks}>
          {CHECKLIST.map((c) => (
            <li key={c}>
              <label>
                <input type="checkbox" /> <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className={styles.note}>Ticked fewer than four? That&apos;s exactly what the backup plan fixes.</p>
      </section>

      <section id="build" className={styles.cta}>
        <h2 className={styles.ctaTitle}>Want the backup plan built for your business?</h2>
        <p>Tell me what you sell and where things get stuck. I&apos;ll reply with what I&apos;d automate first.</p>
        <a className={styles.button} href="mailto:contact@zee.build?subject=What%20If%20%E2%80%94%20backup%20plan">Email Zee →</a>
        <p className={styles.small}>Or reply to the DM that sent you here.</p>
      </section>

      <footer className={styles.footer}>
        <span className={styles.mark}>zb</span> ZeeBuild <em>OS</em>
      </footer>
    </main>
  );
}
