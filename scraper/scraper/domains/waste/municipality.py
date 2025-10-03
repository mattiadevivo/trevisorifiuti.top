from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime


class Municipality(SQLModel, table=True):
	__tablename__ = 'municipalities'
	__table_args__ = {
		'schema': 'tvtrash',
	}

	id: UUID = Field(default_factory=uuid4, primary_key=True)
	name: str
	zone: str
	area: Optional[str] = None
	created_at: datetime = Field(default_factory=datetime.now)
	updated_at: datetime = Field(default_factory=datetime.now)
