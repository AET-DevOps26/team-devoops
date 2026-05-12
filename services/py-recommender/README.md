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

To run the service in development mode, execute:

```sh
flask --app app run
```

## Endpoints

| Endpoint | Description | 
| :------: | :---------- |
| /hello | Returns a "Hello World" paragraph created by a LLM |
