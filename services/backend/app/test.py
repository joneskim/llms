from app.database import SessionLocal
from app.crud import get_user_by_username_and_role

# Initialize the database session
db = SessionLocal()

try:
    # Attempt to fetch the user with the specific role
    user = get_user_by_username_and_role(db, username="teacher1", role="teacher")
    print(user)  # Print the result to see if it's None or if an error occurs

except Exception as e:
    # Print out any exceptions that occur
    print(f"Error: {e}")

finally:
    # Close the database session
    db.close()
