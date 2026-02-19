import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import styles from "./experience.module.css";


const navItems = [
  { to: "/aiml/intro", label: "AI/ML Docs" },
  { to: "/docs/intro", label: "Docs" },
  { to: "/apis/intro", label: "APIs" },
  { to: "/architecture/intro", label: "Architecture" },
  { to: "/strategy/intro", label: "Content Strategy" },
];


function Section({ id, title, children }) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Role({ company, title, location, dates, bullets }) {
  return (
    <section className={styles.roleBlock}>
      <div className={styles.roleHeader}>
        <div>
          <h3 className={styles.roleTitle}>{company}</h3>
          <div className={styles.company}>{title}</div>
          <div className={styles.meta}>{location}</div>
        </div>
        <div className={styles.date}>{dates}</div>
      </div>

      <ul className={styles.bullets}>
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function Experience() {
  const [activeId, setActiveId] = useState(navItems[0].id);

  // Highlight active sidebar item based on scroll position
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const handler = () => {
      const y = window.scrollY + 140; // offset for navbar + spacing
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <Layout title="Experience" description="Experience and portfolio overview">
      <div className={styles.wrapper}>
        {/* LEFT SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>PORTFOLIO</div>
          <nav>
            <ul className={styles.navList}>
            {navItems.map((item) => (
            <li key={item.to} className={styles.navItem}>
            <a className={styles.navLink} href={item.to}>
            {item.label}
            </a>
            </li>
          ))}
          </ul>
        </nav>

        </aside>



        {/* RIGHT CONTENT */}
        <main className={styles.content}>
          <div className={styles.contentInner}>
            <h1 className={styles.pageTitle}>EXPERIENCE</h1>

            {/* 2-line objective */}
            <p className={styles.objective}>
              Accomplished Senior Technical Writer with 10+ years of experience creating clear, concise,
              and impactful documentation for technical and non-technical audiences.
            </p>

            {/* EXPERIENCE (from resume) */}
            <Role
              company="DigitalOcean"
              title="Technical Writer"
              location="Remote, India"
              dates="Jan 2024 – Present"
              bullets={[
                "Authored 70+ long-form technical articles; several rank on page 1 for competitive cloud and AI keywords and entering top signup-driven UVEC contributors.",
                "Applied cloud and AI/ML fundamentals to accurately document complex systems with data pipelines, model workflows, platform integrations.",
              ]}
            />

            <Role
              company="Freelance"
              title="Senior Technical Writer"
              location="Salem, India"
              dates="Oct 2020 – Apr 2023"
              bullets={[
                "Worked across cloud + observability fundamentals: metrics, monitoring workflows, and end-to-end telemetry data flows.",
                "Increased user satisfaction by 30% by crafting and maintaining technical documents for multiple startups.",
                "Implemented accessibility-focused content practices via technical guides and supporting technical videos (scriptwriting + editorial refinement) to improve discoverability and inclusivity.",
              ]}
            />

            <Role
              company="Capgemini Tech Services Ind Ltd"
              title="Senior Technical Writer"
              location="Hyderabad, India"
              dates="Jul 2018 – Sept 2020"
              bullets={[
                "Improved documentation quality by 30% by establishing a documentation review process and providing actionable feedback for clarity, accuracy, and consistency.",
                "Guided and mentored a team of 5 technical writers creating and maintaining comprehensive documentation aligned with product updates and user feedback.",
              ]}
            />

            <Role
              company="Fujitsu Limited"
              title="Senior Technical Writer"
              location="Chennai, India"
              dates="Aug 2017 – Jan 2018"
              bullets={[
                "Engineered a knowledge-sharing platform and curated technical resources for 50+ engineers; reduced onboarding time for new hires by 40%.",
                "Created an embedded systems glossary with practical, real-world usage examples; drove a ~40% surge in community interactions.",
              ]}
            />

            <Role
              company="L&T Infotech"
              title="Software Engineer"
              location="Chennai, India"
              dates="Nov 2014 – Aug 2017"
              bullets={[
                "Delivered 50+ sets of project documentation across multiple technical languages.",
                "Enabled a 50% increase in content team productivity by streamlining the content creation process while maintaining adherence to SOPs and style guidelines.",
              ]}
            />


          </div>
        </main>
      </div>
    </Layout>
  );
}