# House of Consequences – Backend v0.1
# FastAPI + SQLAlchemy + SQLite
# Yhden tiedoston miniversio (helppo jatkokehittää modulaariseksi)

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional, List
import uuid

# -------------------------------------------------------------------
# DATABASE
# -------------------------------------------------------------------

DATABASE_URL = "sqlite:///./house_of_consequences.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def gen_uuid() -> str:
    return str(uuid.uuid4())

# -------------------------------------------------------------------
# MODELS
# -------------------------------------------------------------------

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    rationale = Column(Text, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Consequence(Base):
    __tablename__ = "consequences"

    id = Column(String, primary_key=True, default=gen_uuid)
    decision_id = Column(String, ForeignKey("decisions.id"), nullable=False)
    kind = Column(String, nullable=False)  # short_term / long_term
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# -------------------------------------------------------------------
# SCHEMAS
# -------------------------------------------------------------------

class DecisionCreate(BaseModel):
    title: str
    description: str
    rationale: Optional[str] = None

class DecisionOut(DecisionCreate):
    id: str
    status: str
    created_at: str

    class Config:
        orm_mode = True

class ConsequenceCreate(BaseModel):
    kind: str
    content: str

class ConsequenceOut(ConsequenceCreate):
    id: str
    created_at: str

    class Config:
        orm_mode = True

# -------------------------------------------------------------------
# CRUD
# -------------------------------------------------------------------

def create_decision(db: Session, data: DecisionCreate) -> Decision:
    decision = Decision(**data.dict())
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision

def get_decisions(db: Session) -> List[Decision]:
    return db.query(Decision).all()

def get_decision(db: Session, decision_id: str) -> Optional[Decision]:
    return db.query(Decision).filter(Decision.id == decision_id).first()

def add_consequence(
    db: Session,
    decision_id: str,
    data: ConsequenceCreate
) -> Consequence:
    consequence = Consequence(
        decision_id=decision_id,
        **data.dict()
    )
    db.add(consequence)
    db.commit()
    db.refresh(consequence)
    return consequence

def get_consequences(db: Session, decision_id: str) -> List[Consequence]:
    return (
        db.query(Consequence)
        .filter(Consequence.decision_id == decision_id)
        .all()
    )

# -------------------------------------------------------------------
# FASTAPI APP
# -------------------------------------------------------------------

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="House of Consequences API",
    description="Long-term decision archive backend",
    version="0.1.0"
)

@app.post("/decisions", response_model=DecisionOut)
def api_create_decision(
    decision: DecisionCreate,
    db: Session = Depends(get_db)
):
    return create_decision(db, decision)

@app.get("/decisions", response_model=List[DecisionOut])
def api_list_decisions(db: Session = Depends(get_db)):
    return get_decisions(db)

@app.get("/decisions/{decision_id}", response_model=DecisionOut)
def api_get_decision(
    decision_id: str,
    db: Session = Depends(get_db)
):
    decision = get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision

@app.post(
    "/decisions/{decision_id}/consequences",
    response_model=ConsequenceOut
)
def api_add_consequence(
    decision_id: str,
    consequence: ConsequenceCreate,
    db: Session = Depends(get_db)
):
    if not get_decision(db, decision_id):
        raise HTTPException(status_code=404, detail="Decision not found")
    return add_consequence(db, decision_id, consequence)

@app.get(
    "/decisions/{decision_id}/consequences",
    response_model=List[ConsequenceOut]
)
def api_list_consequences(
    decision_id: str,
    db: Session = Depends(get_db)
):
    return get_consequences(db, decision_id)
