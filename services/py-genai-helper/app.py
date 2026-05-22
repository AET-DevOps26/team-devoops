from flask import Flask, request

<<<<<<< HEAD
from service import generate_rag_response, hello
=======
from service import hello, generate_rag_response
>>>>>>> c89ebcb (Created a simple RAG based endpoint that searches a demo vector store.)

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
<<<<<<< HEAD

=======
    
>>>>>>> c89ebcb (Created a simple RAG based endpoint that searches a demo vector store.)
    response = generate_rag_response(question)
    return {"response": response}, 200
