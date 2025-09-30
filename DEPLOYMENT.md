# Deployment Guide - Subdomain Multi-Tenancy

This application supports subdomain-based multi-tenancy where each school gets its own subdomain.

## Netlify Deployment

### Environment Setup

1. **Main Domain Configuration**: 
   - Set `NEXT_PUBLIC_MAIN_DOMAIN` in your Netlify environment variables
   - For example: `theqcare.org`

2. **Subdomain Structure**:
   - Main site: `theqcare.org` (Super Admin)
   - School subdomains: `demo.theqcare.org`, `test.theqcare.org`

### Netlify Configuration

The `netlify.toml` file is configured to:
- Handle subdomain routing automatically
- Set environment variables for the main domain
- Route all traffic through Next.js functions

### Testing Subdomains

Once deployed to Netlify:

1. **Super Admin Access**: Visit your main domain URL (e.g., `https://theqcare.org`)
2. **School Access**: Visit subdomains (e.g., `https://demo.theqcare.org`)

### Adding New Schools

1. Create a new school in the super admin panel
2. Set the school's subdomain (e.g., "test")
3. The school will be accessible at `test.theqcare.org`

### Development

For local development:
- Use `localhost:3000` for super admin
- Use URL parameters for school testing: `localhost:3000?school=test`

### Environment Variables

Set these in your Netlify dashboard:

\`\`\`
NEXT_PUBLIC_MAIN_DOMAIN=theqcare.org
NODE_ENV=production
\`\`\`

## Custom Domain Setup

If you want to use a custom domain later:

1. Configure your custom domain in Netlify
2. Update `NEXT_PUBLIC_MAIN_DOMAIN` to your custom domain
3. Set up wildcard DNS records for subdomains: `*.yourdomain.com`
