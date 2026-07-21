from sqlalchemy import Column, Boolean, Integer, String, Text, TIMESTAMP, DateTime, func
from database import Base

class QueryHistory(Base):
    __tablename__ = "query_history"
    __table_args__ = {"schema": "optimized_supply_chain"}

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    sql_query = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())