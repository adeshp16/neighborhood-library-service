from datetime import datetime, timezone
from app.models import Borrowing

FINE_PER_DAY = 5 # $5 per day fine

def is_overdue(borrowing: Borrowing) -> bool:
    return (
        borrowing.returned_at is None
        and borrowing.due_date < datetime.now(timezone.utc)
    )

def calculate_fine(borrowing: Borrowing) -> int:

    if not is_overdue(borrowing):
        return 0
    
    end_date = borrowing.returned_at or datetime.now(timezone.utc)
    overdue_days = (end_date.date() - borrowing.due_date.date()).days

    return overdue_days * FINE_PER_DAY