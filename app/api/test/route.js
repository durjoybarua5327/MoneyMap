import { db } from "../../../utils/dbConfig";
import { Budgets } from "../../../utils/schema";

export async function GET() {
  try {
    const budgets = await db.select().from(Budgets);
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database query failed" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, amount, icon, createdBy } = await request.json();
    await db.insert(Budgets).values({ name, amount, icon, createdBy });
    return new Response(JSON.stringify({ message: "Budget added!" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Insert failed" }), { status: 500 });
  }
}
