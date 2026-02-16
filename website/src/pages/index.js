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
          <Link
  className="button button--secondary button--lg"
  to="/docs">
  Explore Documentation →
</Link>

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
    I design developer-first documentation for search engines, vector databases,
    and AI-powered retrieval systems.
  </p>
  <p>
    This portfolio demonstrates conceptual guides, API documentation samples,
    and architecture deep dives for modern Search + AI platforms.
  </p>
</main>

    </Layout>
  );
}
