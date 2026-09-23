const API_URL = 'http://localhost:3000/api';

// Your credentials and the product ID from your successful Phase 3 test
const OWNER_ID = process.env.OWNER_ID || "YOUR_OWNER_ID";
const PIN = process.env.PIN || "YOUR_PIN";
const COCA_COLA_ID = "f261df1a-d300-44a5-ac2c-b14bcc1597e6"; 

async function runTests() {
  console.log("--- SUQFLOW PHASE 4: CHECKOUT & TILL TEST SUITE ---\n");

  try {
    // [INIT] Login to get the session cookie
    console.log("[INIT] Logging in to retrieve session cookie...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: OWNER_ID, pin_code: PIN })
    });
    
    const cookie = loginRes.headers.get('set-cookie');
    if (!cookie) throw new Error("Authentication failed. No cookie returned.");
    console.log("✅ Successfully authenticated.\n");

    // [TEST A] Perform a Cash Checkout
    console.log("[TEST A] Processing a CASH checkout for 2 Coca-Colas...");
    const checkoutRes = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({
        items: [{ product_id: COCA_COLA_ID, quantity: 2 }],
        payment_method: "CASH"
      })
    });
    
    const checkoutData = await checkoutRes.json();
    console.log(`Status: ${checkoutRes.status}`);
    console.log("Response:", checkoutData);
    if (checkoutRes.ok) {
        console.log("✅ Test A Passed: Checkout successful.\n");
    } else {
        console.log("❌ Test A Failed.\n");
    }

    // [TEST B] Log an Operational Expense
    console.log("[TEST B] Logging a 50 Birr Shop Lunch expense...");
    const expenseRes = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({
        amount: 50,
        category: "LUNCH",
        description: "Staff lunch"
      })
    });
    
    const expenseData = await expenseRes.json();
    console.log(`Status: ${expenseRes.status}`);
    console.log("Response:", expenseData);
    if (expenseRes.ok) {
        console.log("✅ Test B Passed: Expense logged successfully.\n");
    } else {
        console.log("❌ Test B Failed.\n");
    }

    console.log("--- TEST SUITE FINISHED ---");

  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

runTests();
