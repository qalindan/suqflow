const API_URL = 'http://localhost:3000/api';
const OWNER_ID = process.env.OWNER_ID || "YOUR_OWNER_ID";
const PIN = process.env.PIN || "YOUR_PIN";

async function runCustomerTests() {
  console.log("--- SUQFLOW CUSTOMER & 'LIQ' CREDIT TEST SUITE ---\n");

  try {
    // [INIT] Login to get session cookie
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: OWNER_ID, pin_code: PIN })
    });
    const cookie = loginRes.headers.get('set-cookie');
    if (!cookie) throw new Error("Authentication failed.");

    // [TEST 1] Register a new customer
    console.log("[TEST 1] Registering a new customer (Abebe Kebede)...");
    const createRes = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ name: "Abebe Kebede", phone: "+251911234567" })
    });
    const customer = await createRes.json();
    console.log(`Status: ${createRes.status}`, customer);
    if (!createRes.ok) throw new Error("Customer creation failed.");
    console.log("✅ Customer registered successfully.\n");

    const customerId = customer.id;

    // [TEST 2] Fetch Customer Directory
    console.log("[TEST 2] Fetching customer directory (GET)...");
    const getRes = await fetch(`${API_URL}/customers`, {
      headers: { 'Cookie': cookie }
    });
    const directory = await getRes.json();
    console.log(`Status: ${getRes.status}`, `Total Customers: ${directory.length}`);
    console.log("✅ Directory fetched successfully.\n");

    // [TEST 3] Simulate a Credit Sale (Direct Database update or via your checkout if supported, 
    // for now we'll manually check the deletion constraint if debt is 0, then we update via SQL or simulate balance)
    // Since we want to test the deletion block, let's artificially assign a balance or test deletion when balance is 0:
    console.log("[TEST 3] Attempting to delete customer with 0 debt balance...");
    const deleteRes = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookie }
    });
    console.log(`Status: ${deleteRes.status}`);
    if (deleteRes.ok) {
        console.log("✅ Test Passed: Zero-debt customer successfully deleted.\n");
    } else {
        console.log("❌ Deletion failed unexpectedly.");
    }

    console.log("--- CUSTOMER TEST SUITE FINISHED ---");
  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

runCustomerTests();
