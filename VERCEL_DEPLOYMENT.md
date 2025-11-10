# Vercel Deployment Guide

This guide will walk you through deploying your Elderly Care App to Vercel step by step.

## Prerequisites

- A GitHub account
- A Vercel account (you can sign up for free at [vercel.com](https://vercel.com))
- Git installed on your machine

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

First, make sure all your files are committed to Git:

```bash
# Add all files to git
git add .

# Commit your changes
git commit -m "Prepare for Vercel deployment"
```

### Step 2: Push to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
# If you haven't initialized git yet
git init

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended for first-time)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository from the list
   - Click "Import"

3. **Configure Project Settings**
   - Vercel will auto-detect your Vite project
   - Verify these settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build` (should be auto-detected)
     - **Output Directory**: `dist` (should be auto-detected)
     - **Install Command**: `npm install` (should be auto-detected)
   - Click "Deploy"

4. **Wait for Deployment**
   - Vercel will install dependencies and build your project
   - This usually takes 1-3 minutes
   - You'll see a success message with your deployment URL

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? **Yes**
     - Which scope? (Select your account)
     - Link to existing project? **No** (for first deployment)
     - Project name? (Press Enter for default)
     - Directory? (Press Enter for current directory)
     - Override settings? **No**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Step 4: Verify Deployment

1. After deployment completes, Vercel will provide you with:
   - A production URL (e.g., `your-app.vercel.app`)
   - A preview URL for each deployment

2. Visit your production URL to verify everything works correctly

3. Test your app:
   - Check that all pages load correctly
   - Test navigation
   - Verify all assets (images, styles) load properly

## Configuration Files

The following files have been configured for Vercel:

- **`vercel.json`**: Contains deployment configuration including SPA routing rules
- **`vite.config.ts`**: Updated to output build files to `dist` directory

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy every push to the `main` branch (production)
- Create preview deployments for pull requests
- Rebuild on every commit

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)

### 404 Errors on Routes

- The `vercel.json` file includes rewrite rules for SPA routing
- If you still see 404s, verify the `rewrites` section in `vercel.json`

### Assets Not Loading

- Ensure asset paths are relative (not absolute)
- Check that images are in the `src/assets` folder
- Verify build output includes all assets

## Environment Variables (If Needed)

If your app needs environment variables:

1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy your project

## Support

For more help:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

