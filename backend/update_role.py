from database import SessionLocal
from models.users import User

db = SessionLocal()
user = db.query(User).filter(User.email == "sushan0500@gmail.com").first()
if user:
    user.role = "admin"
    db.commit()
    print(f"✓ Updated {user.email} role to: {user.role}")
else:
    print("✗ User not found")
db.close()
