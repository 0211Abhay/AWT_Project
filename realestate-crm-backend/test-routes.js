const axios = require('axios');

const BASE_URL = 'https://estatemate-2207.onrender.com';

const routes = [
    { method: 'GET', path: '/api' },
    { method: 'GET', path: '/api/client/getAllClient' },
    { method: 'GET', path: '/api/property' },
    { method: 'GET', path: '/api/schedule' },
    { method: 'GET', path: '/api/rental' },
    { method: 'GET', path: '/api/payment' },
    { method: 'GET', path: '/api/auth/google' }
];

async function testRoutes() {
    console.log('Testing API Routes...\n');
    
    for (const route of routes) {
        try {
            console.log(`Testing ${route.method} ${route.path}...`);
            const response = await axios({
                method: route.method,
                url: `${BASE_URL}${route.path}`,
                validateStatus: false // Don't throw on non-2xx responses
            });
            
            console.log(`Status: ${response.status}`);
            console.log(`Response: ${JSON.stringify(response.data, null, 2)}\n`);
        } catch (error) {
            console.error(`Error testing ${route.path}:`, error.message, '\n');
        }
    }
}

testRoutes();
