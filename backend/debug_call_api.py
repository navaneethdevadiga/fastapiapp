from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

resp = client.get('/job/')
print('status', resp.status_code)
print('text:', resp.text)
if resp.status_code >= 500:
    print('Headers:', resp.headers)
    try:
        print('json:', resp.json())
    except Exception as e:
        print('json parse failed:', e)
