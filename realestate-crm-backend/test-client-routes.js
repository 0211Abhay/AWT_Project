const axios = require('axios');

const BASE_URL = 'https://estatemate-2207.onrender.com';

const clientRoutes = [
    { method: 'GET', path: '/api/client/getAllClient' },
    { method: 'GET', path: '/api/client/getClientName/1' },
    { method: 'GET', path: '/api/client/getOneClient/1' },
    { method: 'POST', path: '/api/client/createClient', data: {
        broker_id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St'
    }}
];

async function testClientRoutes() {
    console.log('Testing Client API Routes...\n');
    
    for (const route of clientRoutes) {
        try {
            console.log(`Testing ${route.method} ${route.path}...`);
            const response = await axios({
                method: route.method,
                url: `${BASE_URL}${route.path}`,
                data: route.data, // Add request body if present
                validateStatus: false // Don't throw on non-2xx responses
            });
            
            console.log(`Status: ${response.status}`);
            if (response.status === 404) {
                console.log('Route not found. Full URL:', `${BASE_URL}${route.path}`);
            } else {
                console.log(`Response: ${JSON.stringify(response.data, null, 2)}`);
            }
            console.log('\n');
        } catch (error) {
            console.error(`Error testing ${route.path}:`, error.message);
            if (error.response) {
                console.log('Error response:', error.response.data);
            }
            console.log('\n');
        }
    }
}

testClientRoutes();
