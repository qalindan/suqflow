describe('SuqFlow API: Checkout Engine', () => {
  const API_URL = 'http://localhost:3000/api';
  let cashierCookie: string;
  let testCustomerId: string;

  // 1. Setup: Authenticate before running any tests
  beforeAll(async () => {
    const cashierId = process.env.CASHIER_ID || '7f3ad614-6bd4-4ad2-a57d-8ae4e9d2cf08';
    console.log("CASHIER_ID:", cashierId);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: cashierId, // Ensure this is set in your .env.local
        pin_code: "0000" // DB PIN is 0000
      })
    });
    if (!loginRes.ok) {
        console.error("LOGIN FAILED:", await loginRes.text());
    }
    cashierCookie = loginRes.headers.get('set-cookie') || '';
    
    // Quick setup: Create a dummy customer for the split payment test
    const custRes = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({ name: "Jest Test Customer", phone: "0900000000" }) 
    });
    const customer = await custRes.json();
    testCustomerId = customer.id;

    // Start a work session
    await fetch(`${API_URL}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({ opening_balance: 0 })
    });
  }, 30000);

  // 2. The Test Case
  it('should successfully route a SPLIT payment (TC-SUQ-POS-011)', async () => {
    const productId = process.env.PRODUCT_ID || 'b8cb2431-1e29-4ee6-ae3e-22b5acd9c812';
    const splitCheckout = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cashierCookie },
      body: JSON.stringify({
        items: [{ product_id: productId, quantity: 1 }],
        payment_method: "SPLIT",
        cash_amount: 100,
        credit_amount: 100,
        customer_id: testCustomerId
      })
    });

    const data = await splitCheckout.json();

    // Professional Assertions
    expect(splitCheckout.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.payment_method).toBe('LIQ'); // The DB schema doesn't have SPLIT, so it routes the credit portion as LIQ
    expect(data.total_amount).toBe(200);
  }, 30000);
});
