"""Add Auditor role support

Revision ID: 006
Revises: 005
Create Date: 2026-01-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add support for Auditor role
    This migration doesn't change the database schema since the role column already exists,
    but it documents the addition of the new Auditor role to the system.
    
    Auditor role permissions:
    - Can create reports (like User)
    - Can edit/delete all reports (like Administrator, unlike User)
    - Can export reports
    - Can edit their own profile
    - Cannot manage users (unlike Administrator)
    - Cannot view API logs (unlike Administrator)
    - Cannot manage platforms (unlike Administrator)
    """
    # No schema changes needed - the role column already supports string values
    # This migration serves as documentation for the new role
    pass


def downgrade() -> None:
    """
    Remove Auditor role support
    Note: This doesn't automatically change existing Auditor users back to another role.
    You may need to manually update user roles before running this downgrade.
    """
    # No schema changes to revert
    pass