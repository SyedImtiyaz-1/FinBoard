# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

### Step 1: Push to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: Finance Dashboard"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/finance-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variables

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following variable:
   - **Name**: `REACT_APP_FINNHUB_API_KEY`
   - **Value**: Your Finnhub API key
   - **Environment**: Production, Preview, Development

3. Redeploy your project

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## 🌐 Deploy to Other Platforms

### Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/finance-dashboard",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```
3. Deploy: `npm run deploy`

### AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload `build/` folder to S3 bucket
3. Configure CloudFront distribution
4. Add environment variables via Lambda@Edge

## 🔧 Environment Variables

### Required Variables

- `REACT_APP_FINNHUB_API_KEY`: Your Finnhub API key

### Optional Variables

- `REACT_APP_ALPHA_VANTAGE_API_KEY`: Alpha Vantage API key
- `REACT_APP_POLYGON_API_KEY`: Polygon API key

### Getting API Keys

#### Finnhub API Key
1. Go to [finnhub.io](https://finnhub.io)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to environment variables

## 📝 Build Configuration

### Vercel Configuration

The `vercel.json` file is already configured for optimal deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Build Optimization

The project is optimized for production builds:

- **Code Splitting**: Automatic code splitting for better performance
- **Tree Shaking**: Unused code is removed
- **Minification**: JavaScript and CSS are minified
- **Compression**: Assets are compressed for faster loading

## 🚨 Troubleshooting

### Build Failures

1. **Check Node.js version**: Ensure you're using Node.js 14+
2. **Clear cache**: `npm run build -- --reset-cache`
3. **Check dependencies**: `npm install`
4. **Check environment variables**: Ensure all required variables are set

### Runtime Errors

1. **Check browser console**: Look for JavaScript errors
2. **Verify API keys**: Ensure API keys are correct
3. **Check CORS**: Some APIs may not work in production
4. **Network issues**: Check if APIs are accessible

### Performance Issues

1. **Optimize images**: Use WebP format
2. **Enable compression**: Configure server compression
3. **Use CDN**: Serve static assets from CDN
4. **Monitor bundle size**: Keep dependencies minimal

## 📊 Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor performance metrics
3. Track user interactions
4. Monitor error rates

### Custom Analytics

Add Google Analytics or other tracking:

```javascript
// In src/index.tsx
import ReactGA from 'react-ga';

ReactGA.initialize('GA_TRACKING_ID');
```

## 🔒 Security

### Environment Variables

- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate API keys regularly
- Use least privilege principle

### API Security

- Validate API responses
- Handle errors gracefully
- Rate limit API calls
- Monitor for abuse

## 🎉 Success!

Your Finance Dashboard is now deployed and ready to use! 

- **URL**: Your Vercel deployment URL
- **Features**: All dashboard features working
- **APIs**: Finnhub integration active
- **Performance**: Optimized for production

---

**Need help?** Check the [README.md](README.md) for usage instructions or open an issue on GitHub.
