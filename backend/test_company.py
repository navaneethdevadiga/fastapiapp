import requests
base = 'http://127.0.0.1:8000'
print('OPENAPI', requests.get(base + '/openapi.json').status_code)
reg = {
    'name': 'CompanyTestUser',
    'email': 'companytest3@example.com',
    'password': 'Test12345!',
    'role': 'admin'
}
r = requests.post(base + '/auth/register', json=reg)
print('REGISTER', r.status_code, r.text)
if r.status_code != 200:
    raise SystemExit(1)
lr = requests.post(base + '/auth/login', data={'username': reg['email'], 'password': reg['password']}, headers={'Content-Type': 'application/x-www-form-urlencoded'})
print('LOGIN', lr.status_code, lr.text)
if lr.status_code != 200:
    raise SystemExit(2)
token = lr.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
company = {'name': 'NewCo', 'email': 'newco@example.com', 'phone': '1234567', 'location': 'City'}
cr = requests.post(base + '/company', json=company, headers=headers)
print('CREATE', cr.status_code, cr.text)
if cr.status_code == 201:
    cid = cr.json()['id']
    upd = {'name': 'NewCo2', 'email': 'newco2@example.com', 'phone': '7654321', 'location': 'City2'}
    ur = requests.put(base + f'/company/{cid}', json=upd, headers=headers)
    print('UPDATE', ur.status_code, ur.text)
