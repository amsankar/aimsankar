// API Base URL
const API_URL = 'http://localhost:5000/api';

// State management
let assets = [];
let categories = [];
let locations = [];
let maintenance = [];
let gadgets = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadAssets();
    loadGadgets();
    loadCategories();
    loadLocations();
    loadMaintenance();
    populateFormSelects();
});

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Load/refresh data
    if (tabName === 'assets') {
        loadAssets();
    } else if (tabName === 'gadgets') {
        loadGadgets();
    } else if (tabName === 'maintenance') {
        loadMaintenance();
    } else if (tabName === 'categories') {
        loadCategories();
    } else if (tabName === 'locations') {
        loadLocations();
    } else if (tabName === 'dashboard') {
        loadDashboardStats();
    }
}

// Dashboard Functions
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/dashboard-stats`);
        const stats = await response.json();

        document.getElementById('totalAssets').textContent = stats.total_assets || 0;
        document.getElementById('activeAssets').textContent = stats.active_assets || 0;
        document.getElementById('inactiveAssets').textContent = stats.inactive_assets || 0;
        document.getElementById('maintenanceRecords').textContent = stats.total_maintenance_records || 0;
        document.getElementById('totalGadgets').textContent = stats.total_gadgets || 0;
        document.getElementById('gadgetsQuantity').textContent = stats.total_gadgets_quantity || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Assets Functions
async function loadAssets() {
    try {
        const response = await fetch(`${API_URL}/assets`);
        assets = await response.json();
        displayAssets(assets);
    } catch (error) {
        console.error('Error loading assets:', error);
        showError('Failed to load assets');
    }
}

function displayAssets(assetsList) {
    const tbody = document.getElementById('assetsList');
    
    if (assetsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No assets found</td></tr>';
        return;
    }

    tbody.innerHTML = assetsList.map(asset => `
        <tr>
            <td>${asset.id || 'N/A'}</td>
            <td>${asset.name || 'N/A'}</td>
            <td>${asset.category || 'N/A'}</td>
            <td>${asset.location || 'N/A'}</td>
            <td><span class="status-badge ${asset.status ? asset.status.toLowerCase() : ''}">${asset.status || 'N/A'}</span></td>
            <td>${asset.purchase_cost ? '$' + parseFloat(asset.purchase_cost).toFixed(2) : 'N/A'}</td>
            <td>${asset.created_date || 'N/A'}</td>
            <td>
                <button class="btn btn-edit" onclick="editAsset('${asset.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteAsset('${asset.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterAssets() {
    const searchTerm = document.getElementById('assetSearch').value.toLowerCase();
    const filtered = assets.filter(asset =>
        (asset.name && asset.name.toLowerCase().includes(searchTerm)) ||
        (asset.id && asset.id.toLowerCase().includes(searchTerm)) ||
        (asset.category && asset.category.toLowerCase().includes(searchTerm))
    );
    displayAssets(filtered);
}

function showAssetForm() {
    document.getElementById('assetId').value = '';
    document.getElementById('assetForm').reset();
    document.getElementById('assetModalTitle').textContent = 'Add Asset';
    document.getElementById('assetModal').classList.add('show');
}

function editAsset(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    document.getElementById('assetId').value = asset.id;
    document.getElementById('assetName').value = asset.name || '';
    document.getElementById('assetCategory').value = asset.category || '';
    document.getElementById('assetLocation').value = asset.location || '';
    document.getElementById('assetPurchaseDate').value = asset.purchase_date || '';
    document.getElementById('assetPurchaseCost').value = asset.purchase_cost || '';
    document.getElementById('assetStatus').value = asset.status || 'Active';
    document.getElementById('assetDescription').value = asset.description || '';

    document.getElementById('assetModalTitle').textContent = 'Edit Asset';
    document.getElementById('assetModal').classList.add('show');
}

async function saveAsset(event) {
    event.preventDefault();

    const assetId = document.getElementById('assetId').value;
    const assetData = {
        name: document.getElementById('assetName').value,
        category: document.getElementById('assetCategory').value,
        location: document.getElementById('assetLocation').value,
        purchase_date: document.getElementById('assetPurchaseDate').value,
        purchase_cost: document.getElementById('assetPurchaseCost').value,
        status: document.getElementById('assetStatus').value,
        description: document.getElementById('assetDescription').value
    };

    try {
        let response;
        if (assetId) {
            response = await fetch(`${API_URL}/assets/${assetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assetData)
            });
        } else {
            response = await fetch(`${API_URL}/assets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assetData)
            });
        }

        if (response.ok) {
            showSuccess(assetId ? 'Asset updated successfully' : 'Asset created successfully');
            closeAssetModal();
            loadAssets();
            loadDashboardStats();
        } else {
            showError('Failed to save asset');
        }
    } catch (error) {
        console.error('Error saving asset:', error);
        showError('Error saving asset');
    }
}

async function deleteAsset(assetId) {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
        const response = await fetch(`${API_URL}/assets/${assetId}`, { method: 'DELETE' });
        if (response.ok) {
            showSuccess('Asset deleted successfully');
            loadAssets();
            loadDashboardStats();
        } else {
            showError('Failed to delete asset');
        }
    } catch (error) {
        console.error('Error deleting asset:', error);
        showError('Error deleting asset');
    }
}

function closeAssetModal() {
    document.getElementById('assetModal').classList.remove('show');
}

// Gadgets Functions
async function loadGadgets() {
    try {
        const response = await fetch(`${API_URL}/gadgets`);
        gadgets = await response.json();
        displayGadgets(gadgets);
    } catch (error) {
        console.error('Error loading gadgets:', error);
        showError('Failed to load gadgets');
    }
}

function displayGadgets(gadgetsList) {
    const tbody = document.getElementById('gadgetsList');
    
    if (gadgetsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No gadgets found</td></tr>';
        return;
    }

    tbody.innerHTML = gadgetsList.map(gadget => `
        <tr>
            <td>${gadget.id || 'N/A'}</td>
            <td>${gadget.name || 'N/A'}</td>
            <td>${gadget.category || 'N/A'}</td>
            <td>${gadget.quantity || 0}</td>
            <td>${gadget.location || 'N/A'}</td>
            <td>${gadget.unit_cost ? '$' + parseFloat(gadget.unit_cost).toFixed(2) : 'N/A'}</td>
            <td>${gadget.total_cost ? '$' + parseFloat(gadget.total_cost).toFixed(2) : 'N/A'}</td>
            <td><span class="status-badge ${gadget.status ? gadget.status.toLowerCase() : ''}">${gadget.status || 'N/A'}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editGadget('${gadget.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteGadget('${gadget.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterGadgets() {
    const searchTerm = document.getElementById('gadgetSearch').value.toLowerCase();
    const filtered = gadgets.filter(gadget =>
        (gadget.name && gadget.name.toLowerCase().includes(searchTerm)) ||
        (gadget.id && gadget.id.toLowerCase().includes(searchTerm)) ||
        (gadget.category && gadget.category.toLowerCase().includes(searchTerm))
    );
    displayGadgets(filtered);
}

function showGadgetForm() {
    document.getElementById('gadgetId').value = '';
    document.getElementById('gadgetForm').reset();
    document.getElementById('gadgetModal').classList.add('show');
}

function editGadget(gadgetId) {
    const gadget = gadgets.find(g => g.id === gadgetId);
    if (!gadget) return;

    document.getElementById('gadgetId').value = gadget.id;
    document.getElementById('gadgetName').value = gadget.name || '';
    document.getElementById('gadgetCategory').value = gadget.category || '';
    document.getElementById('gadgetQuantity').value = gadget.quantity || '';
    document.getElementById('gadgetLocation').value = gadget.location || '';
    document.getElementById('gadgetPurchaseDate').value = gadget.purchase_date || '';
    document.getElementById('gadgetUnitCost').value = gadget.unit_cost || '';
    document.getElementById('gadgetTotalCost').value = gadget.total_cost || '';
    document.getElementById('gadgetStatus').value = gadget.status || 'Active';
    document.getElementById('gadgetDescription').value = gadget.description || '';

    document.getElementById('gadgetModal').classList.add('show');
}

async function saveGadget(event) {
    event.preventDefault();

    const gadgetId = document.getElementById('gadgetId').value;
    const gadgetData = {
        name: document.getElementById('gadgetName').value,
        category: document.getElementById('gadgetCategory').value,
        quantity: document.getElementById('gadgetQuantity').value,
        location: document.getElementById('gadgetLocation').value,
        purchase_date: document.getElementById('gadgetPurchaseDate').value,
        unit_cost: document.getElementById('gadgetUnitCost').value,
        total_cost: document.getElementById('gadgetTotalCost').value,
        status: document.getElementById('gadgetStatus').value,
        description: document.getElementById('gadgetDescription').value
    };

    try {
        let response;
        if (gadgetId) {
            response = await fetch(`${API_URL}/gadgets/${gadgetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gadgetData)
            });
        } else {
            response = await fetch(`${API_URL}/gadgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gadgetData)
            });
        }

        if (response.ok) {
            showSuccess(gadgetId ? 'Gadget updated successfully' : 'Gadget created successfully');
            closeGadgetModal();
            loadGadgets();
            loadDashboardStats();
        } else {
            showError('Failed to save gadget');
        }
    } catch (error) {
        console.error('Error saving gadget:', error);
        showError('Error saving gadget');
    }
}

async function deleteGadget(gadgetId) {
    if (!confirm('Are you sure you want to delete this gadget?')) return;

    try {
        const response = await fetch(`${API_URL}/gadgets/${gadgetId}`, { method: 'DELETE' });
        if (response.ok) {
            showSuccess('Gadget deleted successfully');
            loadGadgets();
            loadDashboardStats();
        } else {
            showError('Failed to delete gadget');
        }
    } catch (error) {
        console.error('Error deleting gadget:', error);
        showError('Error deleting gadget');
    }
}

function closeGadgetModal() {
    document.getElementById('gadgetModal').classList.remove('show');
}

// Maintenance Functions
async function loadMaintenance() {
    try {
        const response = await fetch(`${API_URL}/maintenance`);
        maintenance = await response.json();
        displayMaintenance(maintenance);
    } catch (error) {
        console.error('Error loading maintenance:', error);
        showError('Failed to load maintenance records');
    }
}

function displayMaintenance(maintenanceList) {
    const tbody = document.getElementById('maintenanceList');
    
    if (maintenanceList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No maintenance records found</td></tr>';
        return;
    }

    tbody.innerHTML = maintenanceList.map(record => `
        <tr>
            <td>${record.id || 'N/A'}</td>
            <td>${record.asset_id || 'N/A'}</td>
            <td>${record.date || 'N/A'}</td>
            <td>${record.type || 'N/A'}</td>
            <td>${record.cost ? '$' + parseFloat(record.cost).toFixed(2) : 'N/A'}</td>
            <td>${record.notes || 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteMaintenance('${record.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showMaintenanceForm() {
    document.getElementById('maintenanceId').value = '';
    document.getElementById('maintenanceForm').reset();
    document.getElementById('maintenanceDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('maintenanceModal').classList.add('show');
}

async function saveMaintenance(event) {
    event.preventDefault();

    const maintenanceData = {
        asset_id: document.getElementById('maintenanceAssetId').value,
        date: document.getElementById('maintenanceDate').value,
        type: document.getElementById('maintenanceType').value,
        cost: document.getElementById('maintenanceCost').value,
        notes: document.getElementById('maintenanceNotes').value
    };

    try {
        const response = await fetch(`${API_URL}/maintenance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(maintenanceData)
        });

        if (response.ok) {
            showSuccess('Maintenance record created successfully');
            closeMaintenanceModal();
            loadMaintenance();
            loadDashboardStats();
        } else {
            showError('Failed to save maintenance record');
        }
    } catch (error) {
        console.error('Error saving maintenance record:', error);
        showError('Error saving maintenance record');
    }
}

async function deleteMaintenance(maintenanceId) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
        const response = await fetch(`${API_URL}/maintenance/${maintenanceId}`, { method: 'DELETE' });
        if (response.ok) {
            showSuccess('Maintenance record deleted successfully');
            loadMaintenance();
            loadDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting maintenance record:', error);
    }
}

function closeMaintenanceModal() {
    document.getElementById('maintenanceModal').classList.remove('show');
}

// Categories Functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('Failed to load categories');
    }
}

function displayCategories(categoriesList) {
    const tbody = document.getElementById('categoriesList');
    
    if (categoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
        return;
    }

    tbody.innerHTML = categoriesList.map(category => `
        <tr>
            <td>${category.id || 'N/A'}</td>
            <td>${category.name || 'N/A'}</td>
            <td>${category.description || 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteCategory('${category.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showCategoryForm() {
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.add('show');
}

async function saveCategory(event) {
    event.preventDefault();

    const categoryData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };

    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            showSuccess('Category created successfully');
            closeCategoryModal();
            loadCategories();
        } else {
            showError('Failed to save category');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showError('Error saving category');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, { method: 'DELETE' });
        if (response.ok) {
            showSuccess('Category deleted successfully');
            loadCategories();
        }
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

// Locations Functions
async function loadLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        locations = await response.json();
        displayLocations(locations);
    } catch (error) {
        console.error('Error loading locations:', error);
        showError('Failed to load locations');
    }
}

function displayLocations(locationsList) {
    const tbody = document.getElementById('locationsList');
    
    if (locationsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No locations found</td></tr>';
        return;
    }

    tbody.innerHTML = locationsList.map(location => `
        <tr>
            <td>${location.id || 'N/A'}</td>
            <td>${location.name || 'N/A'}</td>
            <td>${location.address || 'N/A'}</td>
            <td>${location.city || 'N/A'}</td>
            <td>${location.state || 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteLocation('${location.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showLocationForm() {
    document.getElementById('locationId').value = '';
    document.getElementById('locationForm').reset();
    document.getElementById('locationModal').classList.add('show');
}

async function saveLocation(event) {
    event.preventDefault();

    const locationData = {
        name: document.getElementById('locationName').value,
        address: document.getElementById('locationAddress').value,
        city: document.getElementById('locationCity').value,
        state: document.getElementById('locationState').value
    };

    try {
        const response = await fetch(`${API_URL}/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData)
        });

        if (response.ok) {
            showSuccess('Location created successfully');
            closeLocationModal();
            loadLocations();
        } else {
            showError('Failed to save location');
        }
    } catch (error) {
        console.error('Error saving location:', error);
        showError('Error saving location');
    }
}

async function deleteLocation(locationId) {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
        const response = await fetch(`${API_URL}/locations/${locationId}`, { method: 'DELETE' });
        if (response.ok) {
            showSuccess('Location deleted successfully');
            loadLocations();
        }
    } catch (error) {
        console.error('Error deleting location:', error);
    }
}

function closeLocationModal() {
    document.getElementById('locationModal').classList.remove('show');
}

// Populate form selects
async function populateFormSelects() {
    try {
        // Load categories
        const catResponse = await fetch(`${API_URL}/categories`);
        const catData = await catResponse.json();
        const categorySelect = document.getElementById('assetCategory');
        categorySelect.innerHTML = catData.map(cat => 
            `<option value="${cat.name}">${cat.name}</option>`
        ).join('');

        // Load locations
        const locResponse = await fetch(`${API_URL}/locations`);
        const locData = await locResponse.json();
        const locationSelect = document.getElementById('assetLocation');
        locationSelect.innerHTML = locData.map(loc => 
            `<option value="${loc.name}">${loc.name}</option>`
        ).join('');

        // Load locations for gadget form
        const gadgetLocationSelect = document.getElementById('gadgetLocation');
        gadgetLocationSelect.innerHTML = locData.map(loc => 
            `<option value="${loc.name}">${loc.name}</option>`
        ).join('');

        // Load assets for maintenance form
        const assetResponse = await fetch(`${API_URL}/assets`);
        const assetData = await assetResponse.json();
        const assetSelect = document.getElementById('maintenanceAssetId');
        assetSelect.innerHTML = assetData.map(asset => 
            `<option value="${asset.id}">${asset.name}</option>`
        ).join('');
    } catch (error) {
        console.error('Error populating form selects:', error);
    }
}

// Message display
function showSuccess(message) {
    console.log('Success:', message);
    // You can enhance this with toast notifications or modal messages
}

function showError(message) {
    console.error('Error:', message);
    // You can enhance this with toast notifications or modal messages
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}
