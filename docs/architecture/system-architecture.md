# TechWise System Architecture

## Architecture Overview
TechWise is built using a clean, domain-driven structure:
- **Frontend (Next.js 16)**: Liquid Glass UI, Voice Overlay, plain language laptop spec breakdown.
- **Backend (NestJS 12)**: Modular architecture featuring:
  - `AIModule` (`AIOrchestratorService`, `IntentExtractorService`, `ResponseGeneratorService`)
  - `ToolsModule` (`ITool` adapters: Search, Compare, Details, Benchmarks, Reviews, Score)
  - `RecommendationsModule` (Deterministic constraints, scorers, trade-offs, ranking)
  - `ProductsModule`, `ReviewsModule`, `BenchmarksModule`, `CrawlerModule`, `RetrievalModule`.
