from flask import Flask, jsonify
import requests

app = Flask(__name__)

# APIのエンドポイントとAPIキー
API_URL = "https://fortniteapi.io/v1/loot/list?lang=ja"
API_KEY = "5ad61fd1-c149947d-1bb4a885-8cb8a6db"

@app.route('/')
def index():
    # APIにリクエストを送信
    headers = {
        "Authorization": API_KEY
    }
    response = requests.get(API_URL, headers=headers)

    # レスポンスをそのまま返す
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
