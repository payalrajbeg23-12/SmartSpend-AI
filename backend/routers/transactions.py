from fastapi import APIRouter, HTTPException
from backend.database import get_db
from backend.models import Transaction, TransactionCreate

router = APIRouter()


@router.get("/transactions", response_model=list[Transaction])
def list_transactions():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM transactions ORDER BY date DESC, id DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/transactions", response_model=Transaction, status_code=201)
def add_transaction(body: TransactionCreate):
    if body.type not in ("income", "expense"):
        raise HTTPException(status_code=400, detail="Invalid transaction type")
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO transactions(description, amount, type, category, date) VALUES(?,?,?,?,?)",
        (body.description, body.amount, body.type, body.category, body.date),
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM transactions WHERE id=?", (cur.lastrowid,)
    ).fetchone()
    conn.close()
    return dict(row)


@router.delete("/transactions/{tid}")
def delete_transaction(tid: int):
    conn = get_db()
    existing = conn.execute(
        "SELECT id FROM transactions WHERE id=?", (tid,)
    ).fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")
    conn.execute("DELETE FROM transactions WHERE id=?", (tid,))
    conn.commit()
    conn.close()
    return {"message": "deleted"}
