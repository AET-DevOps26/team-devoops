# GenAI Service

## Setup

Running this service requires multiple packages to be installed. Install all packages via
```sh
pip install -r requirements.txt
```

To use remote LLM services, add the desired keys to an .env file:

```
OPENAI_API_KEY="your_openai_key_here"
ANTHROPIC_API_KEY="your_anthropic_key_here"
GOOGLE_API_KEY="your_google_key_here"
DEEPSEEK_API_KEY="your_deepseek_key_here"
HUGGINGFACEHUB_API_TOKEN="your_huggingface_token_here"
```

## Local LLM (Ollama)

The service can run against a local [Ollama](https://ollama.com) instance instead of OpenAI — no
API key required. `LLM_PROVIDER` (env, default `openai`) picks the default backend, and the
`uselocal` field on the report generation endpoints (see Endpoints below) overrides it per request:
`true` forces the entire request — chat model and RAG retrieval alike — onto Ollama, `false` forces
OpenAI, omitted uses the `LLM_PROVIDER` default.

```
LLM_PROVIDER=ollama
# Optional overrides (defaults shown):
#LLM_MODEL=qwen3:0.6b
#EMBEDDING_MODEL=nomic-embed-text
#OLLAMA_BASE_URL=http://localhost:11434
```

Pull the models once before starting the service:

```sh
ollama pull qwen3:0.6b
ollama pull nomic-embed-text
```

An `ollama` instance is wired up identically in all three environments (local docker-compose, the
Azure VM, and the Kubernetes cluster) via `OLLAMA_BASE_URL=http://ollama:11434` — but `LLM_PROVIDER`
itself is left at its `openai` default everywhere, so the local model is only used when a request
explicitly sets `uselocal: true`. In docker-compose, the `ollama` service pulls both models on
startup (`infra/ollama/entrypoint_ollama.sh`) and a healthcheck gates `py-genai-helper`'s startup
until they're ready.

With `LLM_PROVIDER=openai` (the default), `LLM_MODEL` and `EMBEDDING_MODEL` default to
`gpt-4.1-mini` and `text-embedding-3-large`.

To run the service in development mode, execute:

```sh
flask --app app run
```

## Endpoints

| Endpoint | Description |
| :------: | :---------- |
| /hello | Returns a "Hello World" paragraph created by a LLM |
| /reports/member/{member_id} | POST kicks off asynchronous report generation (202) — optional JSON body `{"uselocal": true\|false}` overrides the LLM provider for this report; GET lists the member's report summaries |
| /reports/team/{team_id} | POST kicks off asynchronous report generation (202) — same optional `uselocal` override; GET lists the team's report summaries |
| /reports/{report_id} | GET returns a stored report including its text; DELETE removes it |

## Report generation

Reports are generated in a background thread from the feedback stored in the feedback service.
The feedback is fetched over that service's REST API with the requester's bearer token, so the
feedback service's own visibility rules decide which entries feed the report. The chat model
(OpenAI or Ollama, per `LLM_PROVIDER`/`uselocal` — see Local LLM above) writes the report text,
which is then persisted to the `reports` schema. Configure the feedback service location via
`FEEDBACK_SERVICE_URL` (default `http://feedback-service:8080`).

## Knowledge base (RAG)

The PDFs in `file-storage/` are chunked, embedded, and indexed with Chroma (see `rag.py`) so report
prompts can be augmented with relevant excerpts. The collection is persisted to `vector-store/<provider>/`
(one subdirectory per embedding provider, since an OpenAI-embedded collection isn't valid to query with
Ollama embeddings and vice versa) so the embedding step — a real API/model cost — only happens once
per provider rather than on every process/worker start. A manifest of the source PDFs' filenames and
modification times is stored alongside the collection; if `file-storage/` changes, the manifest no longer
matches and the collection is rebuilt automatically.
