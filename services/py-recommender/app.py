from flask import Flask, request

from service import hello, generate_rag_response

app = Flask("genai-service")


@app.route("/hello")
def hello_world():
    hello_message = hello()
    return f"<p>{hello_message}</p>"


@app.route("/health")
def health():
    return {"status": "ok"}, 200


@app.route("/rag-response", methods=["POST"])
def rag_response():
    # Get the json of the object. force=True ignores the stated MimeType
    data = request.get_json(force=True) or {}
    question = data.get("question")

    if not question:
        return {"error": "Missing required field: 'question'"}, 400
    
    response = generate_rag_response(question)
    return {"response": response}, 200
