import requests, uuid
base='http://127.0.0.1:8000'
print('openapi', requests.get(base+'/openapi.json').status_code)
email=f'testuser_{uuid.uuid4().hex[:8]}@example.com'
pw='Password123!'
name=f'user_{uuid.uuid4().hex[:6]}'
r=requests.post(base+'/auth/register', json={'name':name,'email':email,'password':pw,'role':'user'})
print('register', r.status_code, r.text)
lr=requests.post(base+'/auth/login', data={'username':email, 'password':pw})
print('login', lr.status_code, lr.text)
if lr.status_code != 200:
    raise SystemExit(1)
token=lr.json().get('access_token','')
print('token length', len(token))
headers={'Authorization':f'Bearer {token}'}
comp={'name':'TestCo','email':f'{uuid.uuid4().hex[:8]}@co.com','phone':f'555{uuid.uuid4().hex[:7]}','location':'Test'}
cr=requests.post(base+'/company', json=comp, headers=headers)
print('create', cr.status_code, cr.text)
print('create request headers', cr.request.headers)
if cr.status_code == 201:
    cc=cr.json()
    ur=requests.put(base+f"/company/{cc['id']}", json={'name':'Updated Co','email':cc['email'],'phone':cc['phone'],'location':'Updated City'}, headers=headers)
    print('update', ur.status_code, ur.text)
    print('update request headers', ur.request.headers)
