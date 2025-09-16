# Deployment Guide - Subdomain Multi-Tenancy

This application supports subdomain-based multi-tenancy where each school gets its own subdomain.

## Netlify Deployment

### Environment Setup

1. **Main Domain Configuration**: 
   - Set `NEXT_PUBLIC_MAIN_DOMAIN` in your Netlify environment variables
   - For example: `lustrous-malasada-aaed22.netlify.app`

2. **Subdomain Structure**:
   - Main site: `lustrous-malasada-aaed22.netlify.app` (Super Admin)
   - School subdomains: `test.lustrous-malasada-aaed22.netlify.app`, `demo.lustrous-malasada-aaed22.netlify.app`

### Netlify Configuration

The `netlify.toml` file is configured to:
- Handle subdomain routing automatically
- Set environment variables for the main domain
- Route all traffic through Next.js functions

### Testing Subdomains

Once deployed to Netlify:

1. **Super Admin Access**: Visit your main Netlify URL (e.g., `https://compasse.netlify.app`)
2. **School Access**: Visit subdomains (e.g., `https://test.compasse.netlify.app`)

### Adding New Schools

1. Create a new school in the super admin panel
2. Set the school's subdomain (e.g., "test")
3. The school will be accessible at `test.yoursite.netlify.app`

### Development

For local development:
- Use `localhost:3000` for super admin
- Use URL parameters for school testing: `localhost:3000?school=test`

### Environment Variables

Set these in your Netlify dashboard:

```
NEXT_PUBLIC_MAIN_DOMAIN=your-site.netlify.app
NODE_ENV=production
```

## Custom Domain Setup

If you want to use a custom domain later:

1. Configure your custom domain in Netlify
2. Update `NEXT_PUBLIC_MAIN_DOMAIN` to your custom domain
3. Set up wildcard DNS records for subdomains: `*.yourdomain.com`
