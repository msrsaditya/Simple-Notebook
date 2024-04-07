from flask import Flask, render_template, request
import subprocess
import signal
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.form['code']
    user_input = request.form.get('userInput')
    try:
        process = subprocess.Popen(['python', '-c', code], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate(input=user_input.encode(), timeout=5)
        return stdout.decode('utf-8')
    except subprocess.TimeoutExpired:
        process.kill()
        return 'Execution timed out'
    except Exception as e:
        return str(e)
if __name__ == '__main__':
    app.run(debug=True)
