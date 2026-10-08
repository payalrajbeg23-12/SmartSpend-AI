from pydantic import BaseModel


class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str
    category: str
    date: str


class Transaction(TransactionCreate):
    id: int


class SummaryStats(BaseModel):
    income: float
    expense: float
    balance: float


class DashboardData(BaseModel):
    summary: SummaryStats
    categories: dict[str, float]
    monthly: dict[str, dict[str, float]]
    transactions: list[Transaction]
