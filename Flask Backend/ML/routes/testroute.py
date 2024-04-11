from ML import app
@app.route("/")
def hello_world():
    return {'firstName':"ML Project",'lastName':"To Do"}