const API_URL = 'http://localhost:3000/api';
const OWNER_ID = "25df5ca2-6664-4177-bd0b-36465dd57fde";
const PIN = "1234";

async function runLedgerTest() {
  console.log("--- SUQFLOW LEDGER API TEST ---\n");
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: OWNER_ID, pin_code: PIN })
    });
    const cookie = loginRes.headers.get('set-cookie');
    if (!cookie) throw new Error("Authentication failed.");

    console.log("[TEST] Fetching unified transaction ledger (Page 1, Limit 10)...");
    const res = await fetch(`${API_URL}/transactions?page=1&limit=10`, {
      headers: { 'Cookie': cookie }
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    
    if (res.ok) {
        console.log(`✅ Fetched ${data.data.length} ledger items. Total: ${data.pagination.total}`);
        console.log("Recent items:", data.data.slice(0, 3));
    } else {
        console.error("❌ Ledger fetch failed.", data);
    }

  } catch (error) {
    console.error("Test execution failed:", error);
  }
}
runLedgerTest();
