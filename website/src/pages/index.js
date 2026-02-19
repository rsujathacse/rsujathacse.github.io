import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
<div style={{ maxWidth: "860px", margin: "20px auto 0", lineHeight: 1.6 }}>
  <p style={{ marginBottom: "14px", fontSize: "18px", textAlign: "left" }}>
    I’m a Senior Technical Writer with 10+ years of experience building
    developer-first documentation across cloud, APIs, and AI/ML workflows. I
    partner with engineering and product teams to ship clear, task-driven
    docs—reference guides, conceptual explainers, and architecture
    narratives—that reduce support load and help users succeed faster.
  </p>

  {/* ✅ MAIN CONTENT // <p style={{ margin: 0, fontSize: "16px", opacity: 0.95 }}>
    <strong>Tech stack:</strong> Docs-as-Code tools | Markdown-based authoring | Version control workflows (Git) | API documentation (REST, OpenAPI/Swagger) | Developer tooling & API testing | Visual design tools | SEO, GEO optimization frameworks | AI-assisted doc workflows
  </p> //*/}
</div> 


        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Search & AI Technical Documentation"
      description="Developer-focused documentation on search systems, vector databases, and Retrieval-Augmented Generation (RAG).">
      <HomepageHeader />
      <main className="container margin-vert--lg">
  <p>
    <strong>Tech stack:</strong> Docs-as-Code tools 
    | Markdown-based authoring 
    | Version control workflows (Git) | API documentation (REST, OpenAPI/Swagger) | Developer tooling & API testing | Visual design tools | SEO, GEO optimization frameworks | AI-assisted doc workflows
  </p>
</main>

    </Layout>
  );
}
