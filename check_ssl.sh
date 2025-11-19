#!/bin/bash

# SSL Subdomain Diagnostic Script
# This script checks SSL configuration for subdomains

echo "🔒 SSL Subdomain Diagnostic Tool"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain to check (update if different)
MAIN_DOMAIN="theqcare.org"
SUBDOMAIN="demo.theqcare.org"

echo "Checking domain: $MAIN_DOMAIN"
echo "Checking subdomain: $SUBDOMAIN"
echo ""

# Function to check DNS resolution
check_dns() {
    echo "📡 DNS Resolution Check"
    echo "----------------------"
    
    # Check main domain
    echo -n "Main domain ($MAIN_DOMAIN): "
    if nslookup $MAIN_DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Resolves${NC}"
        nslookup $MAIN_DOMAIN | grep -A 2 "Name:" | head -3
    else
        echo -e "${RED}✗ Does not resolve${NC}"
    fi
    
    echo ""
    echo -n "Subdomain ($SUBDOMAIN): "
    if nslookup $SUBDOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Resolves${NC}"
        nslookup $SUBDOMAIN | grep -A 2 "Name:" | head -3
    else
        echo -e "${RED}✗ Does not resolve${NC}"
        echo -e "${YELLOW}⚠ Wildcard DNS record (*) may be missing in Cloudflare${NC}"
    fi
    echo ""
}

# Function to check SSL certificate
check_ssl() {
    echo "🔐 SSL Certificate Check"
    echo "----------------------"
    
    # Check main domain SSL
    echo -n "Main domain SSL ($MAIN_DOMAIN): "
    if echo | openssl s_client -servername $MAIN_DOMAIN -connect $MAIN_DOMAIN:443 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✓ Valid certificate${NC}"
    else
        echo -e "${RED}✗ Certificate error${NC}"
    fi
    
    # Check subdomain SSL
    echo -n "Subdomain SSL ($SUBDOMAIN): "
    if echo | openssl s_client -servername $SUBDOMAIN -connect $SUBDOMAIN:443 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✓ Valid certificate${NC}"
    else
        echo -e "${RED}✗ Certificate error${NC}"
        echo -e "${YELLOW}⚠ Possible issues:${NC}"
        echo "   - Cloudflare SSL mode not set to 'Full'"
        echo "   - Universal SSL not active"
        echo "   - Wildcard DNS record missing"
    fi
    echo ""
}

# Function to check certificate details
check_cert_details() {
    echo "📜 Certificate Details"
    echo "----------------------"
    
    echo "Subdomain certificate subject alternative names:"
    echo | openssl s_client -servername $SUBDOMAIN -connect $SUBDOMAIN:443 2>/dev/null | \
        openssl x509 -noout -text 2>/dev/null | \
        grep -A 1 "Subject Alternative Name" || echo -e "${YELLOW}⚠ Could not retrieve certificate details${NC}"
    echo ""
}

# Function to check HTTPS connection
check_https() {
    echo "🌐 HTTPS Connection Check"
    echo "----------------------"
    
    # Check main domain
    echo -n "Main domain HTTPS: "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I https://$MAIN_DOMAIN 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✓ Accessible (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}✗ Not accessible (HTTP $HTTP_CODE)${NC}"
    fi
    
    # Check subdomain
    echo -n "Subdomain HTTPS: "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I https://$SUBDOMAIN 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✓ Accessible (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}✗ Not accessible (HTTP $HTTP_CODE)${NC}"
        if [ "$HTTP_CODE" = "000" ]; then
            echo -e "${YELLOW}⚠ SSL handshake failed - check Cloudflare SSL mode${NC}"
        fi
    fi
    echo ""
}

# Function to check Cloudflare IPs
check_cloudflare() {
    echo "☁️  Cloudflare Detection"
    echo "----------------------"
    
    MAIN_IP=$(nslookup $MAIN_DOMAIN 2>/dev/null | grep -A 1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
    SUB_IP=$(nslookup $SUBDOMAIN 2>/dev/null | grep -A 1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
    
    if [ ! -z "$MAIN_IP" ]; then
        echo -n "Main domain IP: $MAIN_IP "
        # Cloudflare IP ranges: 104.16.0.0/12, 172.64.0.0/13, 173.245.48.0/20, etc.
        if [[ $MAIN_IP == 104.* ]] || [[ $MAIN_IP == 172.* ]] || [[ $MAIN_IP == 173.* ]]; then
            echo -e "${GREEN}✓ (Cloudflare)${NC}"
        else
            echo -e "${YELLOW}⚠ (May not be proxied through Cloudflare)${NC}"
        fi
    fi
    
    if [ ! -z "$SUB_IP" ]; then
        echo -n "Subdomain IP: $SUB_IP "
        if [[ $SUB_IP == 104.* ]] || [[ $SUB_IP == 172.* ]] || [[ $SUB_IP == 173.* ]]; then
            echo -e "${GREEN}✓ (Cloudflare)${NC}"
        else
            echo -e "${YELLOW}⚠ (May not be proxied through Cloudflare)${NC}"
        fi
    fi
    echo ""
}

# Run all checks
check_dns
check_cloudflare
check_ssl
check_cert_details
check_https

# Summary
echo "📋 Summary & Recommendations"
echo "----------------------"
echo ""
echo "If you see SSL errors, check:"
echo "1. Cloudflare SSL/TLS → Encryption mode = 'Full'"
echo "2. Cloudflare SSL/TLS → Edge Certificates → Universal SSL = Active"
echo "3. Cloudflare DNS → Wildcard record (*) exists and is Proxied"
echo "4. Netlify → Domain management → *.theqcare.org alias exists"
echo "5. Wait 15-20 minutes after making changes"
echo ""
echo "For detailed fixes, see: SSL_SUBDOMAIN_FIX.md"
echo ""

