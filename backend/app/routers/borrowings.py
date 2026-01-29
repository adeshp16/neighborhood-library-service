from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from datetime import datetime, timezone, timedelta
from app.services.borrowing_service import calculate_fine

print("🔥 borrowings router module imported")

BORROW_DAYS = 14

# Router Definition
# Groups all /borrowings APIs
router = APIRouter(
    prefix="/borrowings",
    tags=["Borrowings"]
)

# Get all borrowings
@router.get(
        "",
        response_model=list[schemas.BorrowingRead],
        status_code=status.HTTP_200_OK
)
def get_all_borrowings(db: Session = Depends(get_db)):
    return db.query(models.Borrowing).all()

# Get borrowings for a member id
@router.get(
        "/member/{member_id}",
        response_model=list[schemas.BorrowingRead],
        status_code=status.HTTP_200_OK
)
def get_active_borrowings_for_member(
        member_id: int,
        db: Session = Depends(get_db)
):
    
    """
    Get all the books currently borrowed by a specific member
    (i.e., borrowings were returned_at is NULL)
    """

    # Ensure the member exists
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} not found"
        )
    
    borrowings = (
        db.query(models.Borrowing)
        .filter(models.Borrowing.member_id == member_id)
        .filter(models.Borrowing.returned_at.is_(None))
        .all()
    )

    return borrowings

# Create Borrowing of book
@router.post(
        "",
        response_model=schemas.BorrowingRead,
        status_code=status.HTTP_201_CREATED
)
def create_borrowing(
    borrowing: schemas.BorrowingCreate,
    db: Session = Depends(get_db)
):
    # Check if book exists
    to_be_borrowed_book = db.query(models.Book).filter(models.Book.id == borrowing.book_id).first()
    if not to_be_borrowed_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {borrowing.book_id} not found in the inventory"
        )
    
    # Check availability
    if to_be_borrowed_book.copies_available <= 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Copies available for borrowing"
        )

    # Now check if member exists
    db_member = db.query(models.Member).filter(models.Member.id == borrowing.member_id).first()
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {borrowing.member_id} was not found in the database"
        )
    
    # Set due date
    now = datetime.now(timezone.utc)

    # Creating borrowing record now
    #db_borrowing = models.Borrowing(**borrowing.model_dump(exclude_none=True))
    db_borrowing = models.Borrowing(
        book_id=borrowing.book_id,
        member_id=borrowing.member_id,
        borrowed_at=now,
        due_date=now + timedelta(days=BORROW_DAYS)
    )

    # Decrement copies for the book in inventory
    to_be_borrowed_book.copies_available -= 1

    db.add(db_borrowing)
    db.commit()
    db.refresh(db_borrowing)

    return db_borrowing




# Return Borrowing(e.g mark returned)
@router.put(
        "/{borrowing_id}/return",
        response_model=schemas.BorrowingRead,
        status_code=status.HTTP_200_OK
)
def return_borrowing(
    borrowing_id: int,
    db: Session = Depends(get_db)
):
    """
        Mark the borrowed booked as returned
    """
    db_borrowing = db.query(models.Borrowing).filter(models.Borrowing.id == borrowing_id).first()
    if not db_borrowing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrowing with id {borrowing_id} not found in the database"
        )
    
    if db_borrowing.returned_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book already returned"
        )
    #update_data = borrowing_update.model_dump(exclude_unset=True, exclude_none=True)

    # for key, val in update_data.items():
    #     setattr(db_borrowing, key, val)

    # Mark the returned time (server-conrolled)
    db_borrowing.returned_at = datetime.now(timezone.utc)

    # Increase available copies count
    db_borrowing.book.copies_available += 1

    db.commit()
    db.refresh(db_borrowing)
    return db_borrowing


# API for finding overdue books
@router.get(
    "/overdue"
)
def list_overdue_books(db: Session= Depends(get_db)):

    overdue = (
        db.query(models.Borrowing)
        .filter(
            models.Borrowing.returned_at.is_(None),
            models.Borrowing.due_date < datetime.now(timezone.utc)
        ).all()
    )

    return [
        {
            "borrowing_id": b.id,
            "book_id": b.book_id,
            "member_id": b.member_id,
            "due_date": b.due_date,
            "fine": calculate_fine(b)
        }
        for b in overdue
    ]