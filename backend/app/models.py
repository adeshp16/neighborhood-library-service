from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


# Book Model
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    #ISBN stands for International Standard Book Number
    isbn = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Returns a list of Borrowing objects related to this book
    # Example: all times this book was borrowed (past and present)
    borrowings = relationship("Borrowing", back_populates="book")

# Members model
class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())    

    # member.borrowings → all Borrowing records associated with that member
    # Gives all books this member has borrowed (current + history)
    borrowings = relationship("Borrowing", back_populates="member")

# Borrowing Model
class Borrowing(Base):
    __tablename__ = "borrowings"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    borrowed_at = Column(DateTime(timezone=True), server_default=func.now())
    returned_at = Column(DateTime(timezone=True), nullable=True)

    # Creates a Python object reference from a Borrowing record to the related Book.
    # Instead of just having the book_id integer, you can access the entire Book object.
    book = relationship("Book", back_populates="borrowings")
    # Similarly, connects the Borrowing record to the Member object.
    # Instead of just member_id, you can directly use borrowing.member.name, etc.
    member = relationship("Member", back_populates="borrowings")