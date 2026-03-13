"""Change is_active from String to Boolean

Revision ID: 010
Revises: 009
Create Date: 2026-03-13 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '010'
down_revision = '009'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Step 1: Add a temporary boolean column
    op.add_column('user', sa.Column('is_active_temp', sa.Boolean(), nullable=True))
    
    # Step 2: Convert existing data: "Y" -> True, "N" or NULL -> False
    op.execute("UPDATE \"user\" SET is_active_temp = CASE WHEN is_active = 'Y' THEN TRUE ELSE FALSE END")
    
    # Step 3: Drop the old String column
    op.drop_column('user', 'is_active')
    
    # Step 4: Rename the temporary column to is_active
    op.alter_column('user', 'is_active_temp', new_column_name='is_active')
    
    # Step 5: Set NOT NULL constraint
    op.alter_column('user', 'is_active', nullable=False)
    
    # Step 6: Change report.comment type to Text (detected in previous attempt)
    op.alter_column('report', 'comment',
               existing_type=sa.VARCHAR(),
               type_=sa.Text(),
               existing_nullable=True)


def downgrade() -> None:
    # Step 1: Add temporary String column
    op.add_column('user', sa.Column('is_active_temp', sa.String(), nullable=True))
    
    # Step 2: Convert boolean back to String: True -> "Y", False -> "N"
    op.execute("UPDATE \"user\" SET is_active_temp = CASE WHEN is_active = TRUE THEN 'Y' ELSE 'N' END")
    
    # Step 3: Drop the boolean column
    op.drop_column('user', 'is_active')
    
    # Step 4: Rename temp column
    op.alter_column('user', 'is_active_temp', new_column_name='is_active')
    
    # Step 5: Set NOT NULL constraint
    op.alter_column('user', 'is_active', nullable=False)
    
    # Step 6: Revert report.comment type
    op.alter_column('report', 'comment',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
