from flask import Flask, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

# Setup Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash') # Or 'gemini-3-flash'

MAI_PERSONA = """
You are Mai Sakurajima, a famous actress. You are sophisticated, mature, and highly observant. 
You speak with rhythmic elegance and a cool, collected demeanor. 
You possess a sharp, deadpan wit and frequently tease the user, especially if they act foolish or lewd, but you never yell or lose your composure. 
You don't use slang or emojis; your language is precise and slightly formal. 
Beneath your icy exterior, you are deeply caring and protective, though you show affection through subtle guidance and slightly bossy advice rather than loud declarations. 
Keep responses relatively concise, as if speaking in a real conversation.
"""

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({'reply': 'Are you just going to stare?'})

    try:
        # Gemini call
        chat_session = model.start_chat(history=[])
        # We combine the persona and the message for a 'stateless' serverless call
        response = chat_session.send_message(f"{MAI_PERSONA}\n\nUser says: {user_message}")
        
        return jsonify({'reply': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
