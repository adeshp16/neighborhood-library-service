from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db


print("🔥 members router module imported")

# Router Definition
# Groups all /members APIs
router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get(
        "",
        response_model=list[schemas.MemberRead],
        status_code=status.HTTP_200_OK

)
def get_all_members(db:Session = Depends(get_db)):
    """
        Retrieve all the members from the database
    """
    existing_members_list =db.query(models.Member).all()

    return existing_members_list

@router.post(
        "",
        response_model=schemas.MemberRead,
        status_code=status.HTTP_201_CREATED

)
def create_member(
        member: schemas.MemberCreate,
        db: Session = Depends(get_db)
):
    # Check if email exists
    if member.email:
        existing_member = (
            db.query(models.Member)
            .filter(models.Member.email == member.email)
            .first()
        )

        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create Member ORM object
    db_member = models.Member(
        name=member.name,
        email=member.email,
        phone=member.phone
    )

    # save to DB
    db.add(db_member)
    db.commit()
    db.refresh(db_member)

    return db_member

@router.put(
        "/{member_id}",
        response_model=schemas.MemberRead,
        status_code=status.HTTP_200_OK

)
def update_member(
        member_id : int,
        member_update: schemas.MemberUpdate,
        db: Session = Depends(get_db)
):
    
    # Fetch the member from DB to update
    db_member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {member_id} was not found."
        )
    

    update_data = member_update.model_dump(exclude_unset=True)

    # If email is being updated check for duplicate records, emailid should be unique.
    if "email" in update_data and update_data["email"]:
        existing_emailid = (
            db.query(models.Member)
            .filter(models.Member.email == update_data["email"])
            .filter(models.Member.id != member_id)
            .first()
        )
        if existing_emailid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Emailid provided {update_data['email']} is already registered to another member."
            )
        
    # Update only the fields provided
    for key, value in update_data.items():
        setattr(db_member, key, value)

    db.commit()
    db.refresh(db_member)
    return db_member


@router.delete(
        "/{member_id}",
        status_code=status.HTTP_204_NO_CONTENT

)
def delete_member(
        member_id: int, 
        db: Session = Depends(get_db)
    ):

    """
    Delete a member
    """

    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f" Member with id {member_id} not found."
        )
    
    if member.borrowings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete member with borrowings"
        )

    db.delete(member)
    db.commit()
    return None # 204 No Content should return empty response