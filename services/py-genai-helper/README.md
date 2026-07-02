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
API key required. Configure it via the `.env` file (see `.env.example`):

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

In the docker-compose stack this is wired up automatically: the `ollama` service pulls both models
on startup (`infra/ollama/entrypoint_ollama.sh`), and `py-genai-helper` runs with
`LLM_PROVIDER=ollama` and `OLLAMA_BASE_URL=http://ollama:11434`.

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
| /rag-response | POST; answers `question` from the PDF knowledge base. Optional `uselocal` (`true`/`false`) forces the local Ollama model or OpenAI for that request; omitted means `LLM_PROVIDER` decides |
