---
title: Architecture
sidebar_position: 1
pagination_next: null
pagination_prev: null
---
Deep-dive architectural docs with system design, observability pipelines, data flow, and infrastructure patterns.

<div className="card margin-bottom--lg">
  <div className="card__body">
    <div style={{display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap"}}>
      <img
        src="/img/ArchTelemetry data pipeline flowchart.png"
        alt="Prometheus & OpenTelemetry interoperability"
        style={{width: "260px", borderRadius: "8px"}}
      />
      <div style={{minWidth: "260px", flex: 1}}>
        <h3 style={{marginTop: 0}}>Prometheus ↔ OpenTelemetry interoperability</h3>
        <p style={{marginBottom: "8px"}}>
          <strong>LFX Mentorship Submission (CNCF – Prometheus, 2026 Term 1)</strong>:
          <em> Improve docs for Prometheus &amp; OpenTelemetry interoperability (2026 Term 1)</em>.
        </p>
        <p style={{marginBottom: "12px"}}>
          Deep-dive documentation on native histograms, OTLP transformation, collector pipelines, and validation workflows.
        </p>

        <a
          className="button button--primary"
          href="/architecture/prometheus-otel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the full doc →
        </a>
      </div>
    </div>
  </div>
</div>