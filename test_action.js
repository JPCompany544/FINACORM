const { signUpUser } = require('./lib/supabase/auth-helpers');

async function testAction() {
  const email = `test.user.action.${Date.now()}@example.com`;
  const password = 'TestSecurePassword123!';

  console.log(`Calling signUpUser with email: ${email}`);

  try {
    const result = await signUpUser({
      email,
      password,
      first_name: 'Test',
      last_name: 'User',
      phone: '+15550100',
      transaction_pin: '1234',
      origin: 'http://localhost:3000',
    });

    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Action threw error:', err);
  }
}

testAction();
