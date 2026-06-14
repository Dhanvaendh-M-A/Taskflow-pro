# 🚀 Deployment Guide - TaskFlow Pro (MongoDB Edition)

## Step-by-Step Deployment to Vercel + MongoDB Atlas

---

## Step 1: Set Up MongoDB Atlas (Database)

### Create Free Cluster
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up / Log in
3. Click **"Build a Database"**
4. Select **"FREE"** (M0 Shared Cluster)
5. Choose cloud provider (AWS recommended) and region closest to you
6. Click **"Create Deployment"**

### Create Database User
1. In the **Security Quickstart** panel:
2. Choose **Username and Password**
3. Enter username (e.g., `taskflow_user`)
4. Click **"Autogenerate Secure Password"** and **SAVE IT**
5. Click **"Create User"**

### Configure Network Access
1. Click **"Add My Current IP Address"** (for local dev)
2. For production/Vercel, add `0.0.0.0/0` (allow from anywhere)
   ⚠️ **Note**: In production, restrict to Vercel IPs for security

### Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Select **Node.js** and version **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://taskflow_user:<password>@cluster0.xxxxx.mongodb.net/taskflow_pro?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

## Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `taskflow-pro`
3. Description: "Premium AI-powered Task Management with MongoDB"
4. Make it **Public**
5. Click **Create repository**

---

## Step 3: Push Your Code

```bash
# Navigate to project
cd taskflow-pro

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "🚀 TaskFlow Pro - Premium Task Management with MongoDB"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/taskflow-pro.git

# Push to main
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`

4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://taskflow_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskflow_pro?retryWrites=true&w=majority
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-random-secret-key
   ```

   Generate secret:
   ```bash
   openssl rand -base64 32
   ```

5. Click **Deploy** 🎉

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

---

## Step 5: Configure OAuth (Optional but Recommended)

### GitHub OAuth:
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. **New OAuth App**
3. Authorization callback URL:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```
4. Copy Client ID and Secret to Vercel env vars:
   ```
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

### Google OAuth:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client**
3. Authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. Copy Client ID and Secret to Vercel env vars

---

## Step 6: MongoDB Atlas Production Settings

### Important for Production:

1. **Connection Pooling** (Already handled in code):
   ```typescript
   // lib/mongodb.ts uses global caching
   // This prevents connection exhaustion on serverless
   ```

2. **Index Optimization**:
   ```bash
   # After deployment, create indexes via MongoDB Atlas UI
   # Or run this script locally:
   npx tsx scripts/create-indexes.ts
   ```

3. **IP Allowlist** (Security):
   - Instead of `0.0.0.0/0`, add Vercel's IP ranges
   - Or use MongoDB Atlas VPC Peering (paid tiers)

4. **Monitoring**:
   - Enable **Atlas Alerts** for slow queries
   - Set up **Performance Advisor** (M10+ required)

---

## 🔧 Troubleshooting

### "MongoServerSelectionError" or Connection Timeout
- Check if IP is whitelisted in MongoDB Atlas
- Verify `MONGODB_URI` is correct in Vercel env vars
- Ensure password in URI is URL-encoded (special characters)

### "Cannot overwrite model once compiled" (Mongoose)
- This is handled in code with `mongoose.models.ModelName || mongoose.model(...)`
- If still occurring, check for duplicate imports

### Build Errors
- Make sure all dependencies are in `dependencies` not `devDependencies`
- Check Node.js version is 20+ in Vercel settings

### Auth Issues
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Ensure `NEXTAUTH_SECRET` is at least 32 characters
- Check OAuth callback URLs match exactly

---

## 📊 Performance Optimization

1. **Enable Vercel Analytics**:
   ```bash
   vercel analytics enable
   ```

2. **Enable Speed Insights**:
   - In Vercel dashboard → **Speed Insights** → **Enable**

3. **MongoDB Atlas Optimization**:
   - Use **Performance Advisor** to find missing indexes
   - Enable **Atlas Search** for full-text search (M10+)
   - Use **Connection Pooling** (already implemented)

4. **Caching**:
   - React Query caching is configured
   - Consider Redis for session caching (advanced)

---

## 🎯 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Sign up works (creates user in MongoDB)
- [ ] Sign in works
- [ ] OAuth login works (if configured)
- [ ] Tasks can be created (saved to MongoDB)
- [ ] Projects can be created
- [ ] Dashboard shows stats (MongoDB aggregations)
- [ ] Dark/light mode toggles
- [ ] Mobile view works
- [ ] MongoDB Atlas shows data in Collections
- [ ] Custom domain configured (optional)

---

## 🆓 MongoDB Atlas Free Tier (M0) Limits

| Feature | Limit |
|---------|-------|
| Storage | 512 MB |
| RAM | Shared |
| Max Connections | 500 |
| Backups | No automated backups |
| Auto-pause | After 30 days inactivity |
| Upgrade Path | M10+ anytime |

**When to upgrade:**
- Storage exceeds 512 MB
- Need automated backups
- Production workload requiring SLA
- Need VPC peering / private endpoints

---

**Your app is now live with MongoDB!** 🚀
