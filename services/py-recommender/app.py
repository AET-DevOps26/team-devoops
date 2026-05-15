from flask import Flask

from service import hello

app = Flask("genai-service")


@app.route("/hello")
def hello_world():
    hello_message = hello()
    return f"<p>{hello_message}</p>"


@app.route("/health")
def health():
    return {"status": "ok"}, 200
