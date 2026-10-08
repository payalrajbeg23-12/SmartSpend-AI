from collections import defaultdict

from fastapi import APIRouter
from backend.database import get_db
from backend.models import DashboardData

router = APIRouter()


@router.get("/dashboard", response_model=DashboardData)
def dashboard():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM transactions ORDER BY date DESC, id DESC"
    ).fetchall()
    conn.close()

    transactions = [dict(r) for r in rows]

    income = sum(r["amount"] for r in transactions if r["type"] == "income")
    expense = sum(r["amount"] for r in transactions if r["type"] == "expense")
    balance = income - expense

    categories: dict[str, float] = defaultdict(float)
    monthly: dict[str, dict[str, float]] = defaultdict(
        lambda: {"income": 0.0, "expense": 0.0}
    )

    for r in transactions:
        month = r["date"][:7]
        monthly[month][r["type"]] += r["amount"]
        if r["type"] == "expense":
            categories[r["category"]] += r["amount"]

    return DashboardData(
        summary={"income": round(income, 2), "expense": round(expense, 2), "balance": round(balance, 2)},
        categories=dict(categories),
        monthly=dict(sorted(monthly.items())),
        transactions=transactions,
    )
