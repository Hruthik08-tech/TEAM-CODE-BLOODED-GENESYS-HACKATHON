
const loginPayload = {
  email: 'greenharvest@test.com',
  password: 'Test@1234'
};

async function run() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });

    if (!loginRes.ok) {
      console.error('Login failed:', await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token acquired.');

    // 2. Search for Supply ID 1 (Wheat) - Should match based on category or name
    console.log('Triggering search for Supply ID 1 (FORCE REFRESH)...');
    const searchRes = await fetch('http://localhost:3000/api/supply/1/search?force=true', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Search Status:', searchRes.status);
    const searchJson = await searchRes.json();
    console.log(`Found ${searchJson.results.length} matches.`);
    if (searchJson.results.length > 0) {
        console.log('First match:', searchJson.results[0]);
    } else {
        console.log('No matches found.');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
