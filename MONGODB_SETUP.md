# MongoDB Atlas Configuration for Production

## Prerequisites

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 is free and sufficient for development)

## Setup Steps

### 1. Create Database

1. Login to MongoDB Atlas
2. Create a new project: "KAMI-EXTENSION"
3. Create a new cluster (M0 free tier is recommended for production)
4. Wait for cluster to be created (~2-5 minutes)

### 2. Create Database User

1. Go to Database Access
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Assign "Read and write to any database" permission
6. Click "Create User"

### 3. Configure Network Access

1. Go to Network Access
2. Click "Add IP Address"
3. For Vercel deployment, select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 4. Get Connection String

1. Go to Database → Connect
2. Choose "Connect your application"
3. Select driver: Node.js
4. Copy the connection string

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<app-name>
```

Replace `<username>` and `<password>` with your actual credentials.

## Environment Variables

### In Vercel Dashboard:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Environments: Production, Preview, Development

### Example:

```
MONGODB_URI=mongodb+srv://kami-user:securepassword@kami-extension.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=KAMI-EXTENSION
```

## Security Notes

- Never commit .env files to version control
- Rotate database passwords regularly
- Use strong passwords for MongoDB users
- Consider IP restrictions for production (whitelist Vercel IPs)
- Enable MongoDB authentication
- Enable TLS/SSL encryption (automatic with mongodb+srv://)

## MongoDB Atlas Free Tier Limitations

- 512 MB storage
- Shared RAM
- No automatic backups (upgrade for backups)
- Limited to one cluster

For production with more users, consider:
- M10 or higher cluster ($9+/month)
- Automated backups
- Point-in-time recovery
- Enhanced security features

## Monitoring

Check your MongoDB Atlas Dashboard for:
- Connection count
- Storage usage
- Query performance
- Error logs
- Slow queries

## Troubleshooting

### Connection Issues:
- Verify MONGODB_URI is correct
- Check network access (IP whitelist)
- Verify database user credentials
- Check cluster status

### Performance Issues:
- Add indexes to frequently queried fields
- Use `explain()` to analyze slow queries
- Consider scaling up cluster if needed
- Optimize your queries

## Data Migration

When deploying to production:

1. Export data from local SQLite (if any)
2. Import to MongoDB using MongoDB Compass or CLI:
```bash
mongorestore --uri="MONGODB_URI" ./backup
```

3. Or use MongoDB Atlas Data Import/Export tool

## Backup Strategy

- MongoDB Atlas free tier: Manual snapshots
- Paid tiers: Automated backups
- Consider exporting data regularly:
```bash
mongodump --uri="MONGODB_URI" --out=./backup
```