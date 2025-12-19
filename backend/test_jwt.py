#!/usr/bin/env python3
"""
Quick test to verify JWT authentication is working.
Run the backend server first, then run this script.
"""
import requests
import json

BASE_URL = "http://localhost:5001"

print("=" * 60)
print("Testing JWT Authentication")
print("=" * 60)

# Test 1: Register a test user
print("\n1. Registering test user...")
register_data = {
    "email": "jwttest@example.com",
    "password": "testpass123",
    "name": "JWT Test User"
}

try:
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    if response.status_code in [201, 409]:
        print(f"✓ Register endpoint: {response.status_code}")
    else:
        print(f"✗ Register failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"✗ Error: {e}")

# Test 2: Login
print("\n2. Logging in...")
login_data = {
    "email": "jwttest@example.com",
    "password": "testpass123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        result = response.json()
        token = result.get('access_token')
        print(f"✓ Login successful")
        print(f"  Token: {token[:30]}...")
        
        # Test 3: Access protected route
        print("\n3. Testing /auth/me with token...")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"  Status Code: {me_response.status_code}")
        
        if me_response.status_code == 200:
            user_data = me_response.json()
            print(f"✓ /auth/me successful")
            print(f"  User: {user_data.get('name')} ({user_data.get('email')})")
            print(f"  Role: {user_data.get('role')}")
        else:
            print(f"✗ /auth/me failed")
            print(f"  Response: {me_response.text}")
            
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)
