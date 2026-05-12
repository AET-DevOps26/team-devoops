from flask import Flask

app = Flask("genai-service")

@app.route("/hello")
def hello_world():
    return "<p>Hello, World!</p>"