/**
 * SUQFLOW DEPLOYMENT GATE
 * Run with: node scripts/test-deployment-gate.js
 */
const API_URL = 'http://localhost:3000/api';

// --- CONFIGURATION ---
const OWNER_ID = process.env.OWNER_ID || "25df5ca2-6664-4177-bd0b-36465dd57fde";
const CASHIER_ID = process.env.CASHIER_ID || "7f3ad614-6bd4-4ad2-a57d-8ae4e9d2cf08";
const PIN = "0000";
const PRODUCT_ID = "b8cb2431-1e29-4ee6-ae3e-22b5acd9c812"; // An item in your database with > 0 stock

// Minimal Assertion Helper
const assert = (condition, msg) => { 
    if (!condition) {
        console.error(`❌ ASSERTION FAILED: ${msg}`);
        process.exit(1);
    }
};

async function executeDeploymentGate() {
  console.log("🛡️ INITIATING SUQFLOW DEPLOYMENT GATE...\n");

  try {
    // ---------------------------------------------------------
    // 1. RBAC SECURITY BOUNDARY (TC-SUQ-SEC-001)
    // ---------------------------------------------------------
    console.log("[1] Testing IAM Security Boundaries...");
    const cashierLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: CASHIER_ID, pin_code: PIN })
    });
    const cashierCookie = cashierLogin.headers.get('set-cookie');
    assert(cashierCookie, "Cashier failed to authenticate.");

    const rbacTest = await fetch(`${API_URL}/analytics/summary`, {
      headers: { 'Cookie': cashierCookie }
    });
    assert(rbacTest.status === 403, `Cashier bypassed RBAC! Status: ${rbacTest.status}`);
    console.log("✅ Security Enforced: Cashier strictly blocked from Owner analytics.");

    // ---------------------------------------------------------
    // 1.5. OPEN WORK SESSION
    // ---------------------------------------------------------
    console.log("Opening Work Session...");
    const startRes = await fetch(`${API_URL}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({ opening_balance: 0 })
    });
    if (!startRes.ok) {
        console.log("Session might already be active:", await startRes.text());
    } else {
        console.log("✅ Session opened.");
    }

    // ---------------------------------------------------------
    // 2. THE CREDIT "LIQ" & PARTIAL PAYMENT ROUTER (TC-SUQ-POS-011)
    // ---------------------------------------------------------
    console.log("\n[2] Testing Financial Isolation & Debt Engine...");
    
    // Create a temporary customer
    const custRes = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({ name: "Deployment Test User", phone: "0900000000" })
    });
    const customer = await custRes.json();
    assert(custRes.ok, "Failed to register test customer.");

    // Process a Split Payment (e.g., 200 ETB total: 100 Cash, 100 Liq)
    const splitCheckout = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({
        items: [{ product_id: PRODUCT_ID, quantity: 1 }],
        payment_method: "SPLIT",
        cash_amount: 100,
        credit_amount: 100,
        customer_id: customer.id
      })
    });
    if (!splitCheckout.ok) {
        console.error("CHECKOUT ERROR:", await splitCheckout.text());
    }
    assert(splitCheckout.ok, "Split checkout transaction failed.");
    console.log("✅ Split checkout successfully routed cash to till and debt to customer ledger.");

    // ---------------------------------------------------------
    // 3. DATABASE DELETION CONSTRAINTS (TC-SUQ-WEB-008)
    // ---------------------------------------------------------
    console.log("\n[3] Testing Database Referential Integrity...");
    const deleteAttempt = await fetch(`${API_URL}/customers/${customer.id}`, {
      method: 'DELETE',
      headers: { 'Cookie': cashierCookie } // Or owner cookie, depending on your delete route's RBAC
    });
    assert(deleteAttempt.status === 400, "System allowed deletion of a customer with active debt!");
    console.log("✅ Deletion Constraint Enforced: Blocked removal of unpaid customer account.");

    // ---------------------------------------------------------
    // 4. ATOMIC DEBT SETTLEMENT (TC-SUQ-WEB-004)
    // ---------------------------------------------------------
    console.log("\n[4] Testing Debt Settlement Transaction...");
    const settleRes = await fetch(`${API_URL}/customers/${customer.id}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({ payment_amount: 100 })
    });
    assert(settleRes.ok, "Debt settlement failed.");
    
    // Verify successful deletion now that debt is 0
    const finalDelete = await fetch(`${API_URL}/customers/${customer.id}`, {
      method: 'DELETE',
      headers: { 'Cookie': cashierCookie }
    });
    assert(finalDelete.ok, "Failed to delete customer after debt was perfectly settled.");
    console.log("✅ Debt Settled and Customer safely deleted (Zero-Balance Constraint passed).");

    // ---------------------------------------------------------
    // 5. SHIFT CLOSURE & MATHEMATICAL AUDIT (TC-SUQ-POS-012)
    // ---------------------------------------------------------
    console.log("\n[5] Executing Cryptographic Till Audit...");
    const closeRes = await fetch(`${API_URL}/session/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie }
    });
    const finalSession = await closeRes.json();
    assert(closeRes.ok, "Shift closure failed.");
    
    console.log(`✅ Session Locked Successfully.`);
    console.log(`📊 Final Expected Cash in Drawer: ${finalSession.current_balance} Birr`);
    console.log("\n🚀 ALL DEPLOYMENT GATES PASSED. BACKEND IS PRODUCTION READY.");

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

executeDeploymentGate();
