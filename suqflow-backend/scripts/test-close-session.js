const API_URL = 'http://localhost:3000/api';
const OWNER_ID = process.env.OWNER_ID || "YOUR_OWNER_ID";
const PIN = process.env.PIN || "YOUR_PIN";

async function testClosure() {
  console.log("--- SUQFLOW: SESSION CLOSURE TEST ---\n");
  try {
    // 1. Authenticate
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: OWNER_ID, pin_code: PIN })
    });
    const cookie = loginRes.headers.get('set-cookie');
    
    // 2. Close the Session
    console.log("[TEST] Attempting to close active WorkSession...");
    const closeRes = await fetch(`${API_URL}/session/close`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie
      }
    });
    
    const closeData = await closeRes.json();
    console.log(`Status: ${closeRes.status}`);
    console.log("Response:", closeData);
    
    if (closeRes.ok) {
        console.log(`✅ Session Closed Successfully! Expected Cash: ${closeData.current_balance} Birr`);
    } else {
        console.log("❌ Closure Failed.");
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}
testClosure();
