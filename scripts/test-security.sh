#!/bin/bash

# Security Features Test Script
# This script tests the implemented security features

echo "🔒 Testing NestJS Template API Security Features"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000"
HEALTH_ENDPOINT="$API_URL/v1/health"
DETAILED_HEALTH_ENDPOINT="$API_URL/v1/health/detailed"
LIVENESS_ENDPOINT="$API_URL/v1/health/liveness"
READINESS_ENDPOINT="$API_URL/v1/health/readiness"

# Function to check if server is running
check_server() {
    echo -e "${YELLOW}Checking if server is running...${NC}"
    if curl -s --connect-timeout 5 "$HEALTH_ENDPOINT" > /dev/null; then
        echo -e "${GREEN}✓ Server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Server is not running. Please start the server with 'npm run start:dev'${NC}"
        return 1
    fi
}

# Test basic health check
test_basic_health() {
    echo -e "\n${YELLOW}Testing basic health check...${NC}"
    response=$(curl -s -w "%{http_code}" "$HEALTH_ENDPOINT")
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Basic health check passed (HTTP $http_code)${NC}"
    else
        echo -e "${RED}✗ Basic health check failed (HTTP $http_code)${NC}"
    fi
}

# Test detailed health check
test_detailed_health() {
    echo -e "\n${YELLOW}Testing detailed health check...${NC}"
    response=$(curl -s -w "%{http_code}" "$DETAILED_HEALTH_ENDPOINT")
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Detailed health check passed (HTTP $http_code)${NC}"
    else
        echo -e "${RED}✗ Detailed health check failed (HTTP $http_code)${NC}"
    fi
}

# Test liveness probe
test_liveness() {
    echo -e "\n${YELLOW}Testing liveness probe...${NC}"
    response=$(curl -s -w "%{http_code}" "$LIVENESS_ENDPOINT")
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Liveness probe passed (HTTP $http_code)${NC}"
    else
        echo -e "${RED}✗ Liveness probe failed (HTTP $http_code)${NC}"
    fi
}

# Test readiness probe
test_readiness() {
    echo -e "\n${YELLOW}Testing readiness probe...${NC}"
    response=$(curl -s -w "%{http_code}" "$READINESS_ENDPOINT")
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Readiness probe passed (HTTP $http_code)${NC}"
    else
        echo -e "${RED}✗ Readiness probe failed (HTTP $http_code)${NC}"
    fi
}

# Test security headers
test_security_headers() {
    echo -e "\n${YELLOW}Testing security headers...${NC}"
    
    # Test for security headers
    headers=$(curl -s -I "$HEALTH_ENDPOINT")
    
    if echo "$headers" | grep -q "X-Content-Type-Options"; then
        echo -e "${GREEN}✓ X-Content-Type-Options header present${NC}"
    else
        echo -e "${RED}✗ X-Content-Type-Options header missing${NC}"
    fi
    
    if echo "$headers" | grep -q "X-Frame-Options"; then
        echo -e "${GREEN}✓ X-Frame-Options header present${NC}"
    else
        echo -e "${RED}✗ X-Frame-Options header missing${NC}"
    fi
    
    if echo "$headers" | grep -q "Content-Security-Policy"; then
        echo -e "${GREEN}✓ Content-Security-Policy header present${NC}"
    else
        echo -e "${RED}✗ Content-Security-Policy header missing${NC}"
    fi
}

# Test rate limiting (basic test)
test_rate_limiting() {
    echo -e "\n${YELLOW}Testing rate limiting (making 10 quick requests)...${NC}"
    
    success_count=0
    rate_limited_count=0
    
    for i in {1..10}; do
        response=$(curl -s -w "%{http_code}" "$HEALTH_ENDPOINT")
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            ((success_count++))
        elif [ "$http_code" = "429" ]; then
            ((rate_limited_count++))
        fi
        
        # Small delay to avoid overwhelming
        sleep 0.1
    done
    
    echo -e "${GREEN}✓ Successful requests: $success_count${NC}"
    if [ "$rate_limited_count" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Rate limited requests: $rate_limited_count${NC}"
    else
        echo -e "${GREEN}✓ No rate limiting triggered (within limits)${NC}"
    fi
}

# Test CORS headers
test_cors() {
    echo -e "\n${YELLOW}Testing CORS configuration...${NC}"
    
    headers=$(curl -s -I -H "Origin: http://localhost:3000" "$HEALTH_ENDPOINT")
    
    if echo "$headers" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✓ CORS headers present${NC}"
    else
        echo -e "${RED}✗ CORS headers missing${NC}"
    fi
}

# Main execution
main() {
    if ! check_server; then
        exit 1
    fi
    
    test_basic_health
    test_detailed_health
    test_liveness
    test_readiness
    test_security_headers
    test_cors
    test_rate_limiting
    
    echo -e "\n${GREEN}🎉 Security testing completed!${NC}"
    echo -e "${YELLOW}Note: Some tests may show warnings in development mode.${NC}"
    echo -e "${YELLOW}For production testing, ensure NODE_ENV=production is set.${NC}"
}

# Run tests
main
