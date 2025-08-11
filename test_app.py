#!/usr/bin/env python3
"""
Test script for the Exponent Labs Executive Summary app
Tests HTML structure, CSS loading, JavaScript functionality, and JSON data
"""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

def test_file_exists(filename):
    """Test if a file exists"""
    if os.path.exists(filename):
        print(f"✅ {filename} exists")
        return True
    else:
        print(f"❌ {filename} missing")
        return False

def test_json_validity(filename):
    """Test if JSON file is valid and has expected structure"""
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
        
        print(f"✅ {filename} is valid JSON")
        
        # Check for required top-level keys
        required_keys = [
            'metadata',
            'core_theoretical_frameworks', 
            'thought_functions_and_prompts',
            'practical_software_implementations',
            'key_insights_and_lessons',
            'technical_achievements',
            'hero_banner_and_prototypes',
            'future_directions'
        ]
        
        missing_keys = [key for key in required_keys if key not in data]
        if missing_keys:
            print(f"❌ Missing required keys: {missing_keys}")
            return False
        
        print(f"✅ {filename} has all required top-level keys")
        
        # Check for metadata title
        if 'title' in data.get('metadata', {}):
            print(f"✅ Metadata title: {data['metadata']['title']}")
        else:
            print(f"❌ Missing metadata title")
            return False
            
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ {filename} is not valid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error reading {filename}: {e}")
        return False

def test_html_structure(filename):
    """Test HTML file structure and required elements"""
    try:
        with open(filename, 'r') as f:
            html = f.read()
        
        print(f"✅ {filename} is readable HTML")
        
        # Check for required elements
        required_elements = [
            '<title>',
            '<div class="container">',
            '<canvas id="threejs-canvas">',
            '<h1 id="title">',
            '<input type="text" class="search-box"',
            '<div class="nav-tabs">',
            'id="frameworks"',
            'id="thought-functions"',
            'id="implementations"',
            'id="insights"',
            'id="achievements"',
            'id="prototypes"',
            'id="future"',
            '<script src="script.js">',
            '<link rel="stylesheet" href="styles.css">',
            'three.js/r128/three.min.js',
            'gsap/3.12.2/gsap.min.js'
        ]
        
        missing_elements = []
        for element in required_elements:
            if element not in html:
                missing_elements.append(element)
        
        if missing_elements:
            print(f"❌ Missing HTML elements: {missing_elements}")
            return False
        
        print(f"✅ {filename} has all required HTML elements")
        return True
        
    except Exception as e:
        print(f"❌ Error reading {filename}: {e}")
        return False

def test_css_structure(filename):
    """Test CSS file structure"""
    try:
        with open(filename, 'r') as f:
            css = f.read()
        
        print(f"✅ {filename} is readable CSS")
        
        # Check for required CSS classes
        required_classes = [
            '.container',
            '.nav-tabs',
            '.nav-tab',
            '.tab-content',
            '.search-box',
            '.framework-grid',
            '.framework-card',
            '.section',
            '.quote',
            '.example',
            '.implementation',
            '.highlight',
            '#threejs-canvas'
        ]
        
        # Check for mobile responsiveness
        mobile_css = [
            '@media (max-width: 768px)',
            'flex-direction: column',
            'grid-template-columns: 1fr'
        ]
        
        missing_mobile = []
        for mobile_rule in mobile_css:
            if mobile_rule not in css:
                missing_mobile.append(mobile_rule)
        
        if missing_mobile:
            print(f"❌ Missing mobile CSS: {missing_mobile}")
            return False
        
        print(f"✅ {filename} has mobile responsiveness")
        
        missing_classes = []
        for css_class in required_classes:
            if css_class not in css:
                missing_classes.append(css_class)
        
        if missing_classes:
            print(f"❌ Missing CSS classes: {missing_classes}")
            return False
        
        print(f"✅ {filename} has all required CSS classes")
        return True
        
    except Exception as e:
        print(f"❌ Error reading {filename}: {e}")
        return False

def test_javascript_structure(filename):
    """Test JavaScript file structure"""
    try:
        with open(filename, 'r') as f:
            js = f.read()
        
        print(f"✅ {filename} is readable JavaScript")
        
        # Check for required functions
        required_functions = [
            'showTab(',
            'renderAllTabs(',
            'renderFrameworks(',
            'renderThoughtFunctions(',
            'renderImplementations(',
            'renderInsights(',
            'renderAchievements(',
            'renderPrototypes(',
            'renderFuture(',
            'searchAndHighlight(',
            'removeHighlights(',
            'initThreeJS(',
            'onWindowResize(',
            'initGSAPAnimations(',
            'addTouchInteraction('
        ]
        
        missing_functions = []
        for func in required_functions:
            if func not in js:
                missing_functions.append(func)
        
        if missing_functions:
            print(f"❌ Missing JavaScript functions: {missing_functions}")
            return False
        
        print(f"✅ {filename} has all required JavaScript functions")
        return True
        
    except Exception as e:
        print(f"❌ Error reading {filename}: {e}")
        return False

def test_web_server():
    """Test if we can serve the files locally"""
    try:
        # Try to start a simple HTTP server
        print("🌐 Testing web server...")
        
        # Check if Python 3 is available
        result = subprocess.run(['python3', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Python 3 available: {result.stdout.strip()}")
            
            # Check if port 8000 is already in use
            try:
                import socket
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                result = sock.connect_ex(('localhost', 8000))
                sock.close()
                
                if result == 0:
                    print("✅ Port 8000 is already in use (server likely running)")
                    print("🌐 You can test the app at: http://localhost:8000")
                    return True
                else:
                    # Try to start server in background
                    try:
                        server_process = subprocess.Popen(
                            ['python3', '-m', 'http.server', '8000'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                        
                        # Wait a moment for server to start
                        time.sleep(2)
                        
                        # Check if server is running
                        if server_process.poll() is None:
                            print("✅ HTTP server started on port 8000")
                            print("🌐 You can test the app at: http://localhost:8000")
                            
                            # Kill the server
                            server_process.terminate()
                            server_process.wait()
                            return True
                        else:
                            print("❌ HTTP server failed to start")
                            return False
                            
                    except Exception as e:
                        print(f"❌ Error starting HTTP server: {e}")
                        return False
                        
            except Exception as e:
                print(f"❌ Error checking port: {e}")
                return False
        else:
            print("❌ Python 3 not available")
            return False
            
    except Exception as e:
        print(f"❌ Error testing web server: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Exponent Labs Executive Summary App")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    # Test file existence
    files_to_test = [
        'index.html',
        'styles.css', 
        'script.js',
        'executive_summary.json'
    ]
    
    for filename in files_to_test:
        total_tests += 1
        if test_file_exists(filename):
            tests_passed += 1
    
    print("\n" + "=" * 50)
    
    # Test JSON validity
    total_tests += 1
    if test_json_validity('executive_summary.json'):
        tests_passed += 1
    
    print("\n" + "=" * 50)
    
    # Test HTML structure
    total_tests += 1
    if test_html_structure('index.html'):
        tests_passed += 1
    
    print("\n" + "=" * 50)
    
    # Test CSS structure
    total_tests += 1
    if test_css_structure('styles.css'):
        tests_passed += 1
    
    print("\n" + "=" * 50)
    
    # Test JavaScript structure
    total_tests += 1
    if test_javascript_structure('script.js'):
        tests_passed += 1
    
    print("\n" + "=" * 50)
    
    # Test web server
    total_tests += 1
    if test_web_server():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! The app should work correctly.")
        print("\n🚀 To run the app:")
        print("   python3 -m http.server 8000")
        print("   Then open http://localhost:8000 in your browser")
    else:
        print("⚠️  Some tests failed. Check the output above for issues.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
