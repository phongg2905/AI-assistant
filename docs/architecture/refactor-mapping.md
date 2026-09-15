# Refactor Mapping

| Old Module / File | New Architecture Destination |
| :--- | :--- |
| `backend/src/modules/pipeline` | Removed in favor of `AIOrchestratorService` + `ToolsModule` |
| `backend/src/modules/recommendation/agents/*` | Removed fake agents; replaced by deterministic domain services in `recommendations/` & thin `ITool` adapters in `tools/` |
| Monorepo workspace config | Removed (`pnpm-workspace.yaml`), single Git repository with independent `frontend/` & `backend/` |
