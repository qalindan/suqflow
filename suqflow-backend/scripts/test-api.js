const baseUrl = 'http://localhost:3000/api'

// We will store the extracted session cookie here
let sessionCookie = ''

async function runTests() {
  console.log('--- SUQFLOW INVENTORY API TEST SUITE ---')

  // 1. Authenticate (Login as OWNER)
  console.log('\n[INIT] Logging in as OWNER to retrieve session cookie...')
  
  // NOTE: In our previous script, the owner was seeded with just a PIN. 
  // If you haven't updated your DB to give the owner an email/password, 
  // you might need to adjust this login to use the Cashier POS style login for the Owner ID:
  // body: JSON.stringify({ user_id: 'your-owner-id-from-db', pin_code: '1234' })
  // 
  // For this test, I am assuming you have an Owner with an email setup!
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: '25df5ca2-6664-4177-bd0b-36465dd57fde',
      pin_code: '1234'
    })
  })

  if (!loginRes.ok) {
    console.error('❌ Login failed! Make sure you have an Owner user seeded with this email/password (or update the script to use your specific Owner ID and PIN).')
    const err = await loginRes.json()
    console.error(err)
    return
  }

  // Extract the 'set-cookie' header to use in subsequent requests
  const setCookieHeader = loginRes.headers.get('set-cookie')
  if (setCookieHeader) {
    // Basic extraction of the session cookie string
    sessionCookie = setCookieHeader.split(';')[0]
    console.log('✅ Successfully authenticated and captured session cookie.')
  } else {
    console.error('❌ Failed to capture session cookie.')
    return
  }

  // Define standard headers including the cookie
  const headers = {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie
  }

  // TEST A: Validation Error (Empty Payload)
  console.log('\n[TEST A] Sending empty payload...')
  const resA = await fetch(`${baseUrl}/inventory`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  })
  const dataA = await resA.json()
  console.log(`Status: ${resA.status}`)
  console.log('Response:', dataA)
  if (resA.status === 400 && dataA.error === 'Missing required fields') {
    console.log('✅ Test A Passed: Correctly caught missing fields.')
  } else {
    console.log('❌ Test A Failed.')
  }

  // TEST B: Margin Protection
  console.log('\n[TEST B] Sending payload with retail_price < wholesale_cost...')
  const payloadB = {
    name: 'Coca Cola 300ml Test B',
    category: 'Beverage',
    wholesale_cost: 40,
    retail_price: 35, // Lower than wholesale
    uom: 'Piece',
    current_stock: 50
  }
  const resB = await fetch(`${baseUrl}/inventory`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payloadB)
  })
  const dataB = await resB.json()
  console.log(`Status: ${resB.status}`)
  console.log('Response:', dataB)
  if (resB.status === 400 && dataB.error.toLowerCase().includes('retail price')) {
    console.log('✅ Test B Passed: Margin protection blocked the negative margin.')
  } else {
    console.log('❌ Test B Failed.')
  }

  // TEST C: Happy Path
  console.log('\n[TEST C] Sending valid product payload...')
  const payloadC = {
    name: 'Coca Cola 300ml Valid',
    category: 'Beverage',
    wholesale_cost: 35,
    retail_price: 40, 
    uom: 'Piece',
    current_stock: 50
  }
  const resC = await fetch(`${baseUrl}/inventory`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payloadC)
  })
  const dataC = await resC.json()
  console.log(`Status: ${resC.status}`)
  console.log('Response:', dataC)
  if (resC.status === 201 && dataC.name === 'Coca Cola 300ml Valid') {
    console.log('✅ Test C Passed: Product successfully created.')
  } else {
    console.log('❌ Test C Failed.')
  }

  // TEST D: Duplicate Handling
  console.log('\n[TEST D] Sending the exact same product payload again to trigger duplicate error...')
  const resD = await fetch(`${baseUrl}/inventory`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payloadC) // Re-sending payload C
  })
  const dataD = await resD.json()
  console.log(`Status: ${resD.status}`)
  console.log('Response:', dataD)
  if (resD.status === 409) {
    console.log('✅ Test D Passed: Correctly caught duplicate product name constraint.')
  } else {
    console.log('❌ Test D Failed.')
  }

  console.log('\n--- TEST SUITE FINISHED ---')
}

runTests()