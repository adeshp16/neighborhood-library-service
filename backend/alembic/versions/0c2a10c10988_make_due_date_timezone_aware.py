"""make due_date timezone aware

Revision ID: 0c2a10c10988
Revises: f31aed3b1de3
Create Date: 2026-01-29 23:36:58.508556

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0c2a10c10988'
down_revision: Union[str, Sequence[str], None] = 'f31aed3b1de3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "borrowings",
        "due_date",
        type_=sa.DateTime(timezone=True),
        existing_type=sa.DateTime(),
        nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        "borrowings",
        "due_date",
        type_=sa.DateTime(),
        existing_type=sa.DateTime(timezone=True),
        nullable=False
    )
