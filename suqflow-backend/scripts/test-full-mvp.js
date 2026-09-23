const API_URL = 'http://localhost:3000/api';
const OWNER_ID = process.env.OWNER_ID || "25df5ca2-6664-4177-bd0b-36465dd57fde";
const PIN = process.env.PIN || "1234";

async function fetchJSON(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, headers: res.headers, data };
}

async function runMVP() {
  console.log("=== SUQFLOW: FULL MVP VALIDATION RUN ===\n");
  try {
    // 1. Authenticate
    console.log("[1] Authenticating Owner...");
    const login = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ user_id: OWNER_ID, pin_code: PIN }) });
    if (!login.ok) throw new Error("Auth failed");
    const cookie = login.headers.get('set-cookie');
    console.log("✅ Authenticated.\n");

    // 2. Open Session
    console.log("[2] Opening Shift with 500 Birr...");
    let session = await fetchJSON('/session/start', { method: 'POST', headers: { Cookie: cookie }, body: JSON.stringify({ opening_balance: 500 }) });
    if (session.status === 400 && session.data.error.includes('exists')) {
      console.log("⚠️ Session already active, closing it first...");
      await fetchJSON('/session/close', { method: 'POST', headers: { Cookie: cookie } });
      session = await fetchJSON('/session/start', { method: 'POST', headers: { Cookie: cookie }, body: JSON.stringify({ opening_balance: 500 }) });
    }
    console.log("✅ Session Active.\n");

    // Fetch a product to sell
    const invRes = await fetchJSON('/inventory', { headers: { Cookie: cookie } });
    const product = invRes.data.find(p => p.is_active && p.current_stock > 2);
    if (!product) throw new Error("No available product with stock > 2");

    // 3. Process CASH Sale
    console.log(`[3] Processing CASH Sale: 2x ${product.name}...`);
    const cashSale = await fetchJSON('/checkout', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ payment_method: 'CASH', items: [{ product_id: product.id, quantity: 2 }] })
    });
    console.log(cashSale.ok ? "✅ Cash Sale Processed" : "❌ Cash Sale Failed", cashSale.data);

    // 4. Register Customer & Process LIQ Sale
    console.log("\n[4] Registering Customer & Processing LIQ Credit Sale...");
    const customer = await fetchJSON('/customers', {
      method: 'POST', headers: { Cookie: cookie }, body: JSON.stringify({ name: "MVP Test Client", phone: "+251999999999" })
    });
    const liqSale = await fetchJSON('/checkout', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ payment_method: 'LIQ', customer_id: customer.data.id, items: [{ product_id: product.id, quantity: 1 }] })
    });
    console.log(liqSale.ok ? "✅ Credit Sale Processed" : "❌ Credit Sale Failed");

    // 5. Log Expense
    console.log("\n[5] Logging 200 Birr Operational Expense...");
    const exp = await fetchJSON('/expenses', {
      method: 'POST', headers: { Cookie: cookie }, body: JSON.stringify({ amount: 200, category: 'SUPPLIES', title: 'Cleaning supplies' })
    });
    console.log(exp.ok ? "✅ Expense Logged" : "❌ Expense Failed");

    // 6. Notifications
    console.log("\n[6] Fetching System Notifications...");
    const notifs = await fetchJSON('/notifications', { headers: { Cookie: cookie } });
    console.log(`✅ Fetched ${notifs.data.notifications.length} notifications.`);

    // 7. Analytics
    console.log("\n[7] Generating Analytics Telemetry (Today)...");
    const analytics = await fetchJSON('/analytics/summary?period=today', { headers: { Cookie: cookie } });
    console.log("✅ Gross Revenue:", analytics.data.metrics.gross_revenue);
    console.log("✅ Net Profit:", analytics.data.metrics.net_profit);

    // 8. Close Shift
    console.log("\n[8] Closing Shift and Locking Till...");
    const close = await fetchJSON('/session/close', { method: 'POST', headers: { Cookie: cookie } });
    console.log(close.ok ? `✅ Shift Closed. Final Expected Cash: ${close.data.current_balance} Birr` : "❌ Shift Close Failed");
    
    const expectedFinal = 500 + (product.retail_price * 2) - 200;
    if (close.data.current_balance === expectedFinal) {
      console.log(`🎉 TILL MATCHES PERFECTLY! (Started 500 + ${product.retail_price * 2} Sale - 200 Exp = ${expectedFinal})`);
    } else {
      console.log(`⚠️ Math mismatch: Expected ${expectedFinal}, got ${close.data.current_balance}`);
    }

    console.log("\n=== FULL MVP TEST COMPLETE ===");

  } catch (error) {
    console.error("Critical Failure:", error);
  }
}
runMVP();
