# Deployment Guide

## Building for Production

### Build Command
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment Options

### 1. Vercel (Recommended)

**Quick Deploy:**
```bash
npm install -g vercel
vercel
```

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

**Using Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

**Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

**Add to package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Deploy:**
```bash
npm run deploy
```

### 4. AWS S3 + CloudFront

**Build and deploy:**
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

**CloudFront Configuration:**
- Origin: S3 bucket
- Default Root Object: index.html
- Error Pages: Route all to index.html (for SPA routing)

### 5. Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build and run:**
```bash
docker build -t elderly-care-app .
docker run -p 80:80 elderly-care-app
```

## Environment Variables

### Production Environment
Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.production.com
VITE_WS_URL=wss://ws.production.com
VITE_ENVIRONMENT=production
```

### Staging Environment
Create `.env.staging`:
```env
VITE_API_BASE_URL=https://api.staging.com
VITE_WS_URL=wss://ws.staging.com
VITE_ENVIRONMENT=staging
```

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints updated for production
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured
- [ ] Build runs without errors
- [ ] All tests passing
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Monitoring and logging set up

## Performance Optimization

### 1. Code Splitting
Already handled by Vite automatically.

### 2. Image Optimization
```bash
npm install -D vite-plugin-imagemin
```

**Add to vite.config.ts:**
```typescript
import imagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: {
        plugins: [{ name: 'removeViewBox', active: false }]
      }
    })
  ]
})
```

### 3. Bundle Analysis
```bash
npm install -D rollup-plugin-visualizer
```

### 4. Compression
Enable gzip/brotli compression on your server.

## Monitoring

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/react
```

**Configure in main.tsx:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

### 2. Analytics (Google Analytics)
```bash
npm install react-ga4
```

### 3. Performance Monitoring
- Use Lighthouse CI
- Set up Real User Monitoring (RUM)
- Monitor Core Web Vitals

## Security

### Headers
Configure security headers on your server:
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

### API Security
- Use HTTPS only
- Implement API key rotation
- Add rate limiting
- Enable CORS only for specific domains
- Validate all inputs

## Rollback Strategy

### Keep Previous Builds
```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# Keep previous dist folders
mv dist dist-v1.0.0
```

### Quick Rollback
```bash
# Revert to previous version
git checkout v1.0.0
npm install
npm run build
npm run deploy
```

## CI/CD Example (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Health Checks

**Add health check endpoint:**
```typescript
// public/health.json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-11-07T00:00:00Z"
}
```

## Troubleshooting Deployment

### Build Fails
- Check Node.js version matches local dev
- Clear node_modules and reinstall
- Check for environment variable issues

### White Screen After Deploy
- Check browser console for errors
- Verify base URL in vite.config.ts
- Check routing configuration
- Ensure all assets are included

### 404 on Refresh
- Configure server to redirect all routes to index.html
- Add redirect rules (see platform-specific configs above)

---

**Last Updated**: November 7, 2024
