import os
import csv
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
DATA_DIR = r'C:/data'
ASSETS_FILE = os.path.join(DATA_DIR, 'assets.csv')
CATEGORIES_FILE = os.path.join(DATA_DIR, 'categories.csv')
LOCATIONS_FILE = os.path.join(DATA_DIR, 'locations.csv')
MAINTENANCE_FILE = os.path.join(DATA_DIR, 'maintenance.csv')
GADGETS_FILE = os.path.join(DATA_DIR, 'gadgets.csv')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)


# Helper functions
def read_csv(filename):
    """Read CSV file and return data as list of dictionaries"""
    if not os.path.exists(filename):
        return []
    
    data = []
    try:
        with open(filename, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            data = list(reader) if reader else []
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    
    return data


def write_csv(filename, data, fieldnames):
    """Write data to CSV file"""
    try:
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        return True
    except Exception as e:
        print(f"Error writing to {filename}: {e}")
        return False


def find_asset_by_id(asset_id, assets):
    """Find asset by ID"""
    for asset in assets:
        if asset['id'] == asset_id:
            return asset
    return None


def find_item_by_id(item_id, items):
    """Find item by ID"""
    for item in items:
        if item['id'] == item_id:
            return item
    return None


# Routes - Assets
@app.route('/api/assets', methods=['GET'])
def get_assets():
    """Retrieve all assets"""
    assets = read_csv(ASSETS_FILE)
    return jsonify(assets)


@app.route('/api/assets/<asset_id>', methods=['GET'])
def get_asset(asset_id):
    """Retrieve specific asset"""
    assets = read_csv(ASSETS_FILE)
    asset = find_asset_by_id(asset_id, assets)
    if asset:
        return jsonify(asset)
    return jsonify({'error': 'Asset not found'}), 404


@app.route('/api/assets', methods=['POST'])
def create_asset():
    """Create new asset"""
    try:
        data = request.get_json()
        assets = read_csv(ASSETS_FILE)
        
        # Generate ID if not provided
        if 'id' not in data:
            data['id'] = f"AST-{datetime.now().timestamp()}"
        
        # Add default values
        if 'created_date' not in data:
            data['created_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if 'status' not in data:
            data['status'] = 'Active'
        
        assets.append(data)
        
        fieldnames = ['id', 'name', 'category', 'location', 'purchase_date', 
                     'purchase_cost', 'status', 'created_date', 'description']
        
        if write_csv(ASSETS_FILE, assets, fieldnames):
            return jsonify(data), 201
        return jsonify({'error': 'Failed to create asset'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/assets/<asset_id>', methods=['PUT'])
def update_asset(asset_id):
    """Update existing asset"""
    try:
        data = request.get_json()
        assets = read_csv(ASSETS_FILE)
        asset = find_asset_by_id(asset_id, assets)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        asset.update(data)
        
        fieldnames = ['id', 'name', 'category', 'location', 'purchase_date', 
                     'purchase_cost', 'status', 'created_date', 'description']
        
        if write_csv(ASSETS_FILE, assets, fieldnames):
            return jsonify(asset), 200
        return jsonify({'error': 'Failed to update asset'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/assets/<asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    """Delete asset"""
    try:
        assets = read_csv(ASSETS_FILE)
        assets = [a for a in assets if a['id'] != asset_id]
        
        fieldnames = ['id', 'name', 'category', 'location', 'purchase_date', 
                     'purchase_cost', 'status', 'created_date', 'description']
        
        if write_csv(ASSETS_FILE, assets, fieldnames):
            return jsonify({'message': 'Asset deleted successfully'}), 200
        return jsonify({'error': 'Failed to delete asset'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Routes - Categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Retrieve all categories"""
    categories = read_csv(CATEGORIES_FILE)
    return jsonify(categories)


@app.route('/api/categories', methods=['POST'])
def create_category():
    """Create new category"""
    try:
        data = request.get_json()
        categories = read_csv(CATEGORIES_FILE)
        
        if 'id' not in data:
            data['id'] = f"CAT-{datetime.now().timestamp()}"
        
        categories.append(data)
        
        fieldnames = ['id', 'name', 'description']
        
        if write_csv(CATEGORIES_FILE, categories, fieldnames):
            return jsonify(data), 201
        return jsonify({'error': 'Failed to create category'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Routes - Locations
@app.route('/api/locations', methods=['GET'])
def get_locations():
    """Retrieve all locations"""
    locations = read_csv(LOCATIONS_FILE)
    return jsonify(locations)


@app.route('/api/locations', methods=['POST'])
def create_location():
    """Create new location"""
    try:
        data = request.get_json()
        locations = read_csv(LOCATIONS_FILE)
        
        if 'id' not in data:
            data['id'] = f"LOC-{datetime.now().timestamp()}"
        
        locations.append(data)
        
        fieldnames = ['id', 'name', 'address', 'city', 'state']
        
        if write_csv(LOCATIONS_FILE, locations, fieldnames):
            return jsonify(data), 201
        return jsonify({'error': 'Failed to create location'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Routes - Maintenance
@app.route('/api/maintenance', methods=['GET'])
def get_maintenance():
    """Retrieve all maintenance records"""
    maintenance = read_csv(MAINTENANCE_FILE)
    return jsonify(maintenance)


@app.route('/api/maintenance', methods=['POST'])
def create_maintenance():
    """Create new maintenance record"""
    try:
        data = request.get_json()
        maintenance = read_csv(MAINTENANCE_FILE)
        
        if 'id' not in data:
            data['id'] = f"MNT-{datetime.now().timestamp()}"
        
        if 'date' not in data:
            data['date'] = datetime.now().strftime('%Y-%m-%d')
        
        maintenance.append(data)
        
        fieldnames = ['id', 'asset_id', 'date', 'type', 'cost', 'notes']
        
        if write_csv(MAINTENANCE_FILE, maintenance, fieldnames):
            return jsonify(data), 201
        return jsonify({'error': 'Failed to create maintenance record'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Routes - Gadgets
@app.route('/api/gadgets', methods=['GET'])
def get_gadgets():
    """Retrieve all gadgets"""
    gadgets = read_csv(GADGETS_FILE)
    return jsonify(gadgets)


@app.route('/api/gadgets/<gadget_id>', methods=['GET'])
def get_gadget(gadget_id):
    """Retrieve specific gadget"""
    gadgets = read_csv(GADGETS_FILE)
    gadget = find_item_by_id(gadget_id, gadgets)
    if gadget:
        return jsonify(gadget)
    return jsonify({'error': 'Gadget not found'}), 404


@app.route('/api/gadgets', methods=['POST'])
def create_gadget():
    """Create new gadget"""
    try:
        data = request.get_json()
        gadgets = read_csv(GADGETS_FILE)
        
        # Generate ID if not provided
        if 'id' not in data:
            data['id'] = f"GAD-{datetime.now().timestamp()}"
        
        # Add default values
        if 'status' not in data:
            data['status'] = 'Active'
        if 'purchase_date' not in data:
            data['purchase_date'] = datetime.now().strftime('%Y-%m-%d')
        
        gadgets.append(data)
        
        fieldnames = ['id', 'name', 'category', 'quantity', 'location', 'purchase_date', 
                     'unit_cost', 'total_cost', 'status', 'description']
        
        if write_csv(GADGETS_FILE, gadgets, fieldnames):
            return jsonify(data), 201
        return jsonify({'error': 'Failed to create gadget'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/gadgets/<gadget_id>', methods=['PUT'])
def update_gadget(gadget_id):
    """Update existing gadget"""
    try:
        data = request.get_json()
        gadgets = read_csv(GADGETS_FILE)
        gadget = find_item_by_id(gadget_id, gadgets)
        
        if not gadget:
            return jsonify({'error': 'Gadget not found'}), 404
        
        gadget.update(data)
        
        fieldnames = ['id', 'name', 'category', 'quantity', 'location', 'purchase_date', 
                     'unit_cost', 'total_cost', 'status', 'description']
        
        if write_csv(GADGETS_FILE, gadgets, fieldnames):
            return jsonify(gadget), 200
        return jsonify({'error': 'Failed to update gadget'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/gadgets/<gadget_id>', methods=['DELETE'])
def delete_gadget(gadget_id):
    """Delete gadget"""
    try:
        gadgets = read_csv(GADGETS_FILE)
        gadgets = [g for g in gadgets if g['id'] != gadget_id]
        
        fieldnames = ['id', 'name', 'category', 'quantity', 'location', 'purchase_date', 
                     'unit_cost', 'total_cost', 'status', 'description']
        
        if write_csv(GADGETS_FILE, gadgets, fieldnames):
            return jsonify({'message': 'Gadget deleted successfully'}), 200
        return jsonify({'error': 'Failed to delete gadget'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Routes - Dashboard
@app.route('/')
def dashboard():
    """Serve the dashboard page"""
    return render_template('index.html')


@app.route('/api/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        assets = read_csv(ASSETS_FILE)
        gadgets = read_csv(GADGETS_FILE)
        maintenance = read_csv(MAINTENANCE_FILE)
        
        total_assets = len(assets)
        active_assets = len([a for a in assets if a.get('status') == 'Active'])
        inactive_assets = len([a for a in assets if a.get('status') == 'Inactive'])
        total_maintenance = len(maintenance)
        total_gadgets = len(gadgets)
        total_gadgets_quantity = sum([int(g.get('quantity', 0)) for g in gadgets])
        
        stats = {
            'total_assets': total_assets,
            'active_assets': active_assets,
            'inactive_assets': inactive_assets,
            'total_maintenance_records': total_maintenance,
            'total_gadgets': total_gadgets,
            'total_gadgets_quantity': total_gadgets_quantity
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
