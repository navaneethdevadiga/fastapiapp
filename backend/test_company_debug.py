import requests
import uuid
import sys
base = 'http://127.0.0.1:8000'
uid = uuid.uuid4().hex[:8]
email = f'test{uid}@example.com'
username = f'CompanyTestUser{uid}'
phone = f'9{uid[:7]}'
print('OPENAPI', requests.get(base + '/openapi.json').status_code)
reg = {
    'name': username,
    'email': email,
    'password': 'Test12345!',
    'role': 'admin'
}
r = requests.post(base + '/auth/register', json=reg)
print('REGISTER', r.status_code, r.text)
if r.status_code != 200:
    sys.exit(1)
lr = requests.post(base + '/auth/login', data={'username': reg['email'], 'password': reg['password']}, headers={'Content-Type': 'application/x-www-form-urlencoded'})
print('LOGIN', lr.status_code, lr.text)
if lr.status_code != 200:
    sys.exit(2)
token = lr.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
company = {'name': 'NewCo', 'email': f'newco{uid}@example.com', 'phone': phone, 'location': 'City'}
cr = requests.post(base + '/company', json=company, headers=headers)
print('CREATE', cr.status_code, repr(cr.text), cr.headers.get('content-type'))
if cr.status_code == 201:
    cid = cr.json()['id']
    upd = {'name': 'NewCo2', 'email': f'newco2{uid}@example.com', 'phone': phone, 'location': 'City2'}
    ur = requests.put(base + f'/company/{cid}', json=upd, headers=headers)
    print('UPDATE', ur.status_code, repr(ur.text), ur.headers.get('content-type'))
