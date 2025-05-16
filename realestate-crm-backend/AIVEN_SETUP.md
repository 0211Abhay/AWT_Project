# Aiven MySQL Database Setup Guide

## Important: Website Access vs. Database Connection

**Website Access**: Your frontend website at https://estatemate2.onrender.com/ is automatically accessible to anyone on the internet. There are no IP restrictions for end users visiting your site.

**Database Connection**: The IP restrictions discussed below are ONLY for the connection between your backend server and your Aiven database. This server-to-server connection happens behind the scenes and doesn't affect who can use your website.

## Critical Step: Configure Network Access Control

The connection timeout errors you're experiencing are most likely due to Aiven's network security rules blocking connections from Render's IP addresses.

### Step 1: Log in to Aiven Console

1. Go to https://console.aiven.io/
2. Log in with your credentials
3. Select your MySQL service (`mysql-162602f9-estatemate-2307`)

### Step 2: Configure Network Access Control

1. Navigate to the **Security** tab
2. Click on **Network Access Control**
3. Add the following Render outbound IP addresses to the allowlist:
   - `100.20.92.101`
   - `44.225.181.72`
   - `44.227.217.144`

4. Make sure to **Apply** the changes

### Step 3: Recommended Approach (Quickest Solution)

For the fastest solution to get your application working:

1. In the Network Access Control panel, add `0.0.0.0/0` to allow all IPs
2. This allows your backend server to connect to your database from any IP address
3. Deploy your backend and test that everything works

**Note**: While this approach is less secure for a production database, it will get your application working immediately. You can later restrict it to just Render's specific IPs for better security.

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
