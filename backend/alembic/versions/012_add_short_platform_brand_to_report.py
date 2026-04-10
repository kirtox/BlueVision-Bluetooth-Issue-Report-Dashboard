"""Add short_platform_brand field to report table

Revision ID: 012
Revises: 011
Create Date: 2026-04-10 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '012'
down_revision = '011'
branch_labels = None
depends_on = None


def upgrade() -> None:
    from alembic import context
    conn = context.get_bind()

    result = conn.execute(sa.text("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name='report' AND column_name='short_platform_brand'
    """))

    if not result.fetchone():
        op.add_column('report', sa.Column('short_platform_brand', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('report', 'short_platform_brand')
