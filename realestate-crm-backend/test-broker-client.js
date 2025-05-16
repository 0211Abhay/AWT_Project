const axios = require('axios');

const BASE_URL = 'https://estatemate-2207.onrender.com';

async function testBrokerAndClient() {
    try {
        // 1. Create a broker first
        console.log('\nCreating broker...');
        const brokerResponse = await axios({
            method: 'POST',
            url: `${BASE_URL}/api/broker/createBroker`,
            data: {
                name: 'Test Broker',
                email: 'testbroker@example.com',
                phone: '9876543210',
                address: '456 Broker St',
                license_number: 'TEST123'
            }
        });
        console.log('Broker created:', brokerResponse.data);
        
        const brokerId = brokerResponse.data.broker.broker_id;
        
        // 2. Create a client using the new broker's ID
        console.log('\nCreating client...');
        const clientResponse = await axios({
            method: 'POST',
            url: `${BASE_URL}/api/client/createClient`,
            data: {
                broker_id: brokerId,
                name: 'Test Client',
                email: 'testclient@example.com',
                phone: '1234567890',
                address: '123 Client St'
            }
        });
        console.log('Client created:', clientResponse.data);
        
        const clientId = clientResponse.data.client.id;
        
        // 3. Test getClientName
        console.log('\nTesting getClientName...');
        const nameResponse = await axios({
            method: 'GET',
            url: `${BASE_URL}/api/client/getClientName/${clientId}`
        });
        console.log('Client name:', nameResponse.data);
        
        // 4. Test getOneClient
        console.log('\nTesting getOneClient...');
        const detailsResponse = await axios({
            method: 'GET',
            url: `${BASE_URL}/api/client/getOneClient/${clientId}`
        });
        console.log('Client details:', detailsResponse.data);
        
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testBrokerAndClient();
