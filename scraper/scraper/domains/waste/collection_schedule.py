from sqlmodel import SQLModel, Field, ARRAY, Column, String
from typing import List, Literal
from uuid import UUID, uuid4
from datetime import datetime, date

Waste = Literal['Vegetale', 'Secco', 'Umido', 'VPL', 'Carta']


class CollectionSchedule(SQLModel, table=True):
	__tablename__ = 'waste_collections'
	__table_args__ = {
		'schema': 'tvtrash',
	}

	id: UUID = Field(default_factory=uuid4, primary_key=True)
	date: date
	waste: List[str] = Field(sa_column=Column(ARRAY(String)))
	created_at: datetime = Field(default_factory=datetime.now)
	updated_at: datetime = Field(default_factory=datetime.now)
	municipality_id: UUID = Field(foreign_key='municipalities.id')
