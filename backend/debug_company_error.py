import requests, uuid
base = 'http://127.0.0.1:8000'
email = f'testuser_{uuid.uuid4().hex[:8]}@example.com'
pw = 'Password123!'
name = f'user_{uuid.uuid4().hex[:6]}'
r = requests.post(base+'/auth/register', json={'name': name, 'email': email, 'password': pw, 'role': 'user'})
print('register', r.status_code, r.text)
assert r.status_code == 200
lr = requests.post(base+'/auth/login', data={'username': email, 'password': pw})
print('login', lr.status_code, lr.text)
assert lr.status_code == 200
token = lr.json().get('access_token', '')
headers = {'Authorization': f'Bearer {token}'}
comp = {'name': 'TestCo', 'email': f'{uuid.uuid4().hex[:8]}@co.com', 'phone': f'555{uuid.uuid4().hex[:7]}', 'location': 'Test'}
cr = requests.post(base+'/company', json=comp, headers=headers)
print('create status', cr.status_code)
try:
    print('create json', cr.json())
except Exception:
    print('create text', cr.text)
print('create url', cr.url)
print('create request headers', cr.request.headers)
