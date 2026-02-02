from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db


print("🔥 books router module imported")

# Router Definition
# Groups all /books APIs
router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

# Get all books in the database
@router.get(
        "",
        response_model=list[schemas.BookRead],
        status_code=status.HTTP_200_OK
)
def get_all_books(db: Session = Depends(get_db)):
    return db.query(models.Book).all()

# Create a new book and persist to db
@router.post(
        "",
        response_model=schemas.BookRead,
        status_code=status.HTTP_201_CREATED
)
def create_book(
        book: schemas.BookCreate,
        db: Session = Depends(get_db)
):
    # Check for duplicate ISBN
    if book.isbn:
        existing_book = db.query(models.Book).filter(models.Book.isbn == book.isbn).first()
        if existing_book:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Book ISBN already exists."
            )
    
    # exclude_none=True : Prevents overwriting defaults with None
    # Useful when DB has defaults (e.g., copies_available=0)
    db_book = models.Book(**book.model_dump(exclude_none=True))

    db.add(db_book)
    db.commit()
    db.refresh(db_book)

    return db_book


# Update a book
@router.put(
        "/{book_id}",
        response_model=schemas.BookRead,
        status_code=status.HTTP_200_OK
)
def update_book(
        book_id : int,
        book_update: schemas.BookUpdate,
        db: Session = Depends(get_db)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found"
        )
    
    update_book_data = book_update.model_dump(exclude_unset=True)

    # check duplicate ISBN if isbn is updated
    if "isbn" in update_book_data and update_book_data["isbn"]:
        
        existing_isbn = db.query(models.Book).filter(
            models.Book.isbn == update_book_data["isbn"],
            models.Book.id != book_id
        ).first()
        if existing_isbn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"ISBN {update_book_data['isbn']} already exists"
            )
    
    #update the found book with input data
    for key, val in update_book_data.items():
        setattr(db_book, key, val)

    db.commit()
    db.refresh(db_book)
    return db_book


# Delete a book
@router.delete(
        "/{book_id}",
        status_code=status.HTTP_204_NO_CONTENT
)
def delete_book(
        book_id: int, 
        db: Session = Depends(get_db)
    ):

    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book id with {book_id} was not found in the database."
        )
    
    book_borrowings_count = db.query(models.Borrowing).filter(models.Borrowing.book_id == book_id).count()
    if book_borrowings_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete book as borrowings exists for it."
        )
    
    # delete the found book
    db.delete(db_book)
    db.commit()
    return None
