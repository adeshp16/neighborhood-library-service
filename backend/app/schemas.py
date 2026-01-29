from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

#### Pydantic schemas for Members API

class MemberBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

# Inherits everything from MemberBase
class MemberCreate(MemberBase):
    pass

# We need this as separate schema because we want to allow to partially update the members fields
class MemberUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


# Members response schema
class MemberRead(MemberBase):

    id: int
    created_at: datetime

    # This tells Pydantic how to read data when converting it into a response model.
    # FastAPI returns SQLAlchemy objects
    # However, Pydantic expects dict-like data
    # This tells Pydantic this object has attributes, not keys. 
    # # Use obj.field_name instead of obj['field_name']
    class config:
        from_attributes = True


#### Pydantic schemas for Book API

class BookCreate(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    published_year: Optional[int] = None
    copies_available: int = 1

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    published_year: Optional[int] = None
    copies_available: Optional[int] = None

# Books response schema
class BookRead(BaseModel):
    id: int
    title: str
    author: str
    isbn: Optional[str] = None
    published_year: Optional[int] = None
    copies_available: int
    created_at: Optional[datetime] = None

    # This tells Pydantic how to read data when converting it into a response model.
    # FastAPI returns SQLAlchemy objects
    # However, Pydantic expects dict-like data
    # This tells Pydantic this object has attributes, not keys. 
    # # Use obj.field_name instead of obj['field_name']
    class Config:
        from_attributes = True

## Borrowings Schema

# Borrowing Create Schema
class BorrowingCreate(BaseModel):
    book_id: int
    member_id: int

# Borrowing Update Schema
class BorrowingUpdate(BaseModel):
    returned_at: Optional[datetime] = None

# Borrowing Response Schema
class BorrowingRead(BaseModel):
    id: int
    book_id: int
    member_id: int
    borrowed_at: Optional[datetime] = None
    due_date: datetime
    returned_at: Optional[datetime] = None

    # This tells Pydantic how to read data when converting it into a response model.
    # FastAPI returns SQLAlchemy objects
    # However, Pydantic expects dict-like data
    # This tells Pydantic this object has attributes, not keys. 
    # # Use obj.field_name instead of obj['field_name']
    class Config:
        from_attributes = True
    
