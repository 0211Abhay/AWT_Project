# Aiven MySQL Database Setup Guide

## Critical Step: Configure Network Access Control

The connection timeout errors you're experiencing are most likely due to Aiven's network security rules blocking connections from Render's IP addresses.

### Step 1: Log in to Aiven Console

1. Go to https://console.aiven.io/
2. Log in with your credentials
3. Select your MySQL service (`mysql-162602f9-estatemate-2307`)

### Step 2: Configure Network Access Control

1. Navigate to the **Security** tab
2. Click on **Network Access Control**
3. Add the following Render IP ranges to the allowlist:
   - `35.236.87.24/29`
   - `3.101.124.69/32`
   - `35.245.187.255/32`
   - `35.236.54.224/29`

4. Make sure to **Apply** the changes

### Step 3: Temporary Testing Approach

If you're still experiencing connection issues, you can temporarily allow all IPs for testing:

1. In the Network Access Control panel, add `0.0.0.0/0` to allow all IPs
2. Test your connection
3. **Important**: After confirming it works, restrict access to only Render's IP ranges for security

## Verify Connection

After updating the network access rules, restart your Render web service to test the connection.

## Database Connection Details

For reference, here are your database connection details:

- Host: `mysql-162602f9-estatemate-2307.g.aivencloud.com`
- Port: `18887`
- Database: `defaultdb`
- User: `avnadmin`
- SSL Mode: `REQUIRED`

## Next Steps After Connection Success

Once your Render service successfully connects to Aiven:

1. Your tables will be automatically created by Sequelize
2. Your frontend should communicate with your backend
3. Your application should be fully functional
