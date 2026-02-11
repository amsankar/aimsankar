# Assets Management Dashboard

A comprehensive Python web application for managing organizational assets with a modern dashboard interface and RESTful API backend.

## Features

- **Dashboard Overview**: Displays statistics for total, active, and inactive assets along with maintenance records
- **Assets Management**: Full CRUD operations for managing organizational assets
- **Maintenance Tracking**: Record and track maintenance activities for assets
- **Category Management**: Organize assets by categories
- **Location Management**: Manage asset storage locations
- **REST API**: Complete REST API for all operations
- **CSV Data Storage**: All data stored in CSV format in `C:/data` directory
- **Responsive UI**: Modern, responsive web dashboard

## Project Structure

```
aimsankar/
├── app.py                  # Flask application with REST API endpoints
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── templates/
│   └── index.html         # Dashboard HTML interface
└── static/
    ├── css/
    │   └── style.css      # Dashboard styling
    └── js/
        └── script.js      # Frontend JavaScript logic
```

## Data Files

All data is stored in CSV format in `C:/data/`:
- `assets.csv` - Asset records
- `categories.csv` - Device categories
- `locations.csv` - Storage locations
- `maintenance.csv` - Maintenance history

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup Steps

1. **Navigate to project directory**:
   ```bash
   cd c:\work\vscws\aimsankar
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify data directory**:
   - The `C:/data/` directory is automatically created with sample CSV files
   - Ensure you have read/write permissions to `C:/data/`

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Access the dashboard**:
   - Open your web browser
   - Navigate to `http://localhost:5000`
   - You should see the Assets Management Dashboard

3. **Data is automatically loaded**:
   - Sample data from CSV files is loaded on startup
   - All CRUD operations save data back to CSV files

## API Endpoints

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/<id>` - Get specific asset
- `POST /api/assets` - Create new asset
- `PUT /api/assets/<id>` - Update asset
- `DELETE /api/assets/<id>` - Delete asset

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create new location

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `POST /api/maintenance` - Create new maintenance record

### Dashboard
- `GET /api/dashboard-stats` - Get dashboard statistics

## Usage Guide

### Dashboard Tab
- View summary statistics of your assets
- Monitor asset status at a glance

### Assets Tab
- View all assets in inventory
- Search assets by name, ID, or category
- Add new assets with details like name, category, location, purchase date, and cost
- Edit existing asset information
- Delete assets from inventory

### Maintenance Tab
- Track all maintenance activities
- Record maintenance type, date, cost, and notes
- Link maintenance records to specific assets

### Categories Tab
- Create and manage asset categories
- Organize assets by type (Computers, Equipment, Electronics, etc.)

### Locations Tab
- Define and manage storage locations
- Associate assets with specific locations

## Sample Data

The application comes with sample data in CSV files:
- 10 sample assets (laptops, printers, TVs, etc.)
- 5 asset categories
- 5 storage locations
- 10 maintenance records

All data can be modified through the web interface or by editing CSV files directly.

## Data Storage

All data is persisted in CSV format in the `C:/data/` directory:

**assets.csv fields:**
- id, name, category, location, purchase_date, purchase_cost, status, created_date, description

**categories.csv fields:**
- id, name, description

**locations.csv fields:**
- id, name, address, city, state

**maintenance.csv fields:**
- id, asset_id, date, type, cost, notes

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, modify the `app.py` file:
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Change port to 5001
```

### Data Directory Issues
Ensure `C:/data/` exists and is writable. The application creates it automatically.

### CSV File Errors
If CSV files are corrupted, delete them and restart the application to regenerate empty ones.

## Technologies Used

- **Backend**: Flask 2.3.3
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Storage**: CSV files
- **CORS**: Flask-CORS for cross-origin requests

## Future Enhancements

- Database integration (PostgreSQL, MySQL)
- Authentication and authorization
- Advanced reporting and analytics
- Asset depreciation calculations
- Barcode/QR code support
- Mobile app integration
- Email notifications for maintenance
- Data export (PDF, Excel)

## License

This project is for personal use.

## Support

For issues or questions, refer to the inline code comments and API documentation in `app.py`.
