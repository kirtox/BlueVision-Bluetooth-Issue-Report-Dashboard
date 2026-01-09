"""Add username field to api_access_log table

Revision ID: 007
Revises: 006
Create Date: 2026-01-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '007'
down_revision = '006'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add username field to api_access_log table to track which user made the API request.
    - For authenticated frontend users: stores their username
    - For Python scripts: stores "Python"
    - For unauthenticated requests: stores NULL
    """
    op.add_column('api_access_log', sa.Column('username', sa.String(), nullable=True))


def downgrade() -> None:
    """
    Remove username field from api_access_log table
    """
    op.drop_column('api_access_log', 'username')