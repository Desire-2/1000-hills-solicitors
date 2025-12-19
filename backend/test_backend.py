#!/usr/bin/env python3
"""
Test script to verify backend configuration and CORS setup.
Run this after starting the backend server.
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_health():
    """Test health check endpoint."""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✓ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_index():
    """Test index endpoint."""
    print("\nTesting index endpoint...")
    try:
        response = requests.get(BASE_URL)
        data = response.json()
        print(f"✓ Index: {response.status_code}")
        print(f"  Message: {data.get('message')}")
        print(f"  Version: {data.get('version')}")
        return True
    except Exception as e:
        print(f"✗ Index failed: {e}")
        return False

def test_cors():
    """Test CORS headers."""
    print("\nTesting CORS configuration...")
    try:
        # Simulate preflight request from frontend
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type,authorization'
        }
        response = requests.options(f"{BASE_URL}/auth/login", headers=headers)
        
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        cors_methods = response.headers.get('Access-Control-Allow-Methods')
        cors_headers = response.headers.get('Access-Control-Allow-Headers')
        
        if cors_origin:
            print(f"✓ CORS configured")
            print(f"  Allow-Origin: {cors_origin}")
            print(f"  Allow-Methods: {cors_methods}")
            print(f"  Allow-Headers: {cors_headers}")
            return True
        else:
            print(f"✗ CORS not properly configured")
            return False
    except Exception as e:
        print(f"✗ CORS test failed: {e}")
        return False

def test_register():
    """Test user registration."""
    print("\nTesting user registration...")
    try:
        data = {
            "email": "testuser@test.com",
            "password": "testpass123",
            "name": "Test User"
        }
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code in [201, 409]:  # 409 if user already exists
            print(f"✓ Register endpoint working: {response.status_code}")
            if response.status_code == 201:
                print(f"  New user created")
            else:
                print(f"  User already exists (expected)")
            return True
        else:
            print(f"✗ Register failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"✗ Register test failed: {e}")
        return False

def test_login():
    """Test user login."""
    print("\nTesting user login...")
    try:
        data = {
            "email": "testuser@test.com",
            "password": "testpass123"
        }
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'access_token' in result:
                print(f"✓ Login successful")
                print(f"  Token received: {result['access_token'][:20]}...")
                return result['access_token']
            else:
                print(f"✗ Login response missing token")
                return None
        else:
            print(f"✗ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"✗ Login test failed: {e}")
        return None

def test_protected_route(token):
    """Test protected route with JWT token."""
    print("\nTesting protected route...")
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            user = response.json()
            print(f"✓ Protected route accessible")
            print(f"  User: {user.get('name')} ({user.get('email')})")
            print(f"  Role: {user.get('role')}")
            return True
        else:
            print(f"✗ Protected route failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Protected route test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("=" * 50)
    print("Backend Configuration Test Suite")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Index Endpoint", test_index()))
    results.append(("CORS Configuration", test_cors()))
    results.append(("User Registration", test_register()))
    
    token = test_login()
    results.append(("User Login", token is not None))
    
    if token:
        results.append(("Protected Route", test_protected_route(token)))
    else:
        results.append(("Protected Route", False))
    
    # Print summary
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is configured correctly.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check configuration.")
        return 1

if __name__ == "__main__":
    exit(main())
