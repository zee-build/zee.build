import { NextResponse } from "next/server";
import { ZB_DATA, skillScores } from "@/lib/os-data";

export async function GET() {
  const D = ZB_DATA;

  const experienceHTML = D.experience
    .map(
      (e) => `
      <div class="role">
        <div class="role-header">
          <strong>${e.role}</strong> @ ${e.co}
          <span class="when">${e.when}</span>
        </div>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  const educationHTML = D.education
    .map(
      (e) => `
      <div class="role">
        <div class="role-header">
          <strong>${e.what}</strong> · ${e.where}
          <span class="when">${e.when}</span>
        </div>
      </div>`
    )
    .join("");

  const skillsHTML = Object.entries(skillScores)
    .map(
      ([k, v]) => `
      <div class="skill-row">
        <span class="skill-name">${k}</span>
        <div class="skill-bar"><div class="skill-fill" style="width:${v}%"></div></div>
        <span class="skill-pct">${v}%</span>
      </div>`
    )
    .join("");

  const certsHTML = D.certifications.map((c) => `<li>${c}</li>`).join("");

  const researchHTML = D.research
    .map((r) => `<div class="role"><strong>${r.title}</strong><br/><span class="dim">${r.venue}</span></div>`)
    .join("");

  const extraHTML = D.extra.map((e) => `<li>${e}</li>`).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${D.identity.name} — Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 40px 48px;
      max-width: 800px;
      margin: 0 auto;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 0.6in; size: A4; }
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
    .subtitle { font-size: 12px; color: #555; margin-bottom: 4px; }
    .contact { font-size: 10px; color: #666; margin-bottom: 20px; }
    .contact a { color: #333; text-decoration: none; }
    h2 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #C9A84C;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 4px;
      margin: 18px 0 10px;
    }
    .role { margin-bottom: 12px; }
    .role-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    .when { font-size: 10px; color: #888; white-space: nowrap; }
    ul { padding-left: 16px; margin-top: 4px; }
    li { margin-bottom: 3px; color: #333; }
    .skill-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .skill-name { min-width: 120px; font-size: 10px; }
    .skill-bar {
      flex: 1;
      height: 6px;
      background: #eee;
      border-radius: 3px;
      overflow: hidden;
    }
    .skill-fill {
      height: 100%;
      background: #C9A84C;
      border-radius: 3px;
    }
    .skill-pct { font-size: 9px; color: #888; min-width: 28px; text-align: right; }
    .dim { color: #888; font-size: 10px; }
    .two-col { columns: 2; column-gap: 24px; }
    .two-col li { break-inside: avoid; }
  </style>
</head>
<body>
  <h1>${D.identity.name}</h1>
  <div class="subtitle">${D.identity.title}</div>
  <div class="contact">
    ${D.identity.location} · ${D.identity.email} · ${D.identity.phone}<br/>
    <a href="https://${D.identity.linkedin}">${D.identity.linkedin}</a> · 
    <a href="https://${D.identity.github}">${D.identity.github}</a>
  </div>

  <h2>Experience</h2>
  ${experienceHTML}

  <h2>Education</h2>
  ${educationHTML}

  <h2>Skills</h2>
  ${skillsHTML}

  <h2>Certifications</h2>
  <ul class="two-col">${certsHTML}</ul>

  <h2>Research</h2>
  ${researchHTML}

  <h2>Volunteering</h2>
  <ul class="two-col">${extraHTML}</ul>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
