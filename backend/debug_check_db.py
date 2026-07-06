from database import SessionLocal
from models.job import Job

if __name__ == '__main__':
    try:
        db = SessionLocal()
        jobs = db.query(Job).all()
        print(f"Found {len(jobs)} jobs")
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        try:
            db.close()
        except:
            pass
