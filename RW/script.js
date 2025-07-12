// Application State
let currentUser = null;
let isAuthMode = 'login'; // 'login' or 'signup'
let currentPage = 'landing';
let items = [];
let users = [];
let swaps = [];

// Sample Data
const sampleItems = [
    {
        id: 1,
        title: 'Vintage Denim Jacket',
        description: 'Classic vintage denim jacket in great condition. Perfect for layering!',
        category: 'outerwear',
        size: 'm',
        condition: 'good',
        points: 50,
        images: ['https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg'],
        uploader: 'Sarah M.',
        status: 'available',
        tags: ['vintage', 'denim', 'jacket']
    },
    {
        id: 2,
        title: 'Floral Summer Dress',
        description: 'Beautiful floral print dress, perfect for summer occasions.',
        category: 'dresses',
        size: 's',
        condition: 'excellent',
        points: 40,
        images: ['https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg'],
        uploader: 'Emma L.',
        status: 'available',
        tags: ['floral', 'summer', 'dress']
    },
    {
        id: 3,
        title: 'Black Leather Boots',
        description: 'Stylish black leather boots with minor wear.',
        category: 'accessories',
        size: 'm',
        condition: 'good',
        points: 60,
        images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'],
        uploader: 'Mike R.',
        status: 'available',
        tags: ['leather', 'boots', 'black']
    },
    {
        id: 4,
        title: 'Casual White T-Shirt',
        description: 'Comfortable cotton t-shirt in excellent condition.',
        category: 'tops',
        size: 'l',
        condition: 'excellent',
        points: 25,
        images: ['https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg'],
        uploader: 'Alex K.',
        status: 'available',
        tags: ['casual', 'cotton', 'white']
    },
    {
        id: 5,
        title: 'Blue Jeans',
        description: 'Classic blue jeans, slightly worn but still great.',
        category: 'bottoms',
        size: 'm',
        condition: 'good',
        points: 35,
        images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'],
        uploader: 'Lisa P.',
        status: 'available',
        tags: ['jeans', 'blue', 'casual']
    },
    {
        id: 6,
        title: 'Red Handbag',
        description: 'Elegant red handbag perfect for special occasions.',
        category: 'accessories',
        size: 'one-size',
        condition: 'excellent',
        points: 45,
        images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'],
        uploader: 'Maria S.',
        status: 'available',
        tags: ['handbag', 'red', 'elegant']
    }
];

const sampleUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        points: 150,
        memberSince: 'January 2024',
        listedItems: [1],
        swapHistory: [],
        purchases: [2, 3]
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@rewear.com',
        password: 'admin123',
        role: 'admin',
        points: 0,
        memberSince: 'December 2023',
        listedItems: [],
        swapHistory: []
    }
];

// Initialize Application
function init() {
    items = [...sampleItems];
    users = [...sampleUsers];
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
        if (currentUser.role === 'admin') {
            showPage('admin');
        } else {
            showPage('landing');
        }
    } else {
        showPage('login');
    }
    
    setupEventListeners();
    loadFeaturedItems();
    loadBrowseItems();
}

// Event Listeners
function setupEventListeners() {
    // Auth form
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    
    // Add item form
    document.getElementById('add-item-form').addEventListener('submit', handleAddItem);
    
    // Filters
    document.getElementById('category-filter').addEventListener('change', filterItems);
    document.getElementById('size-filter').addEventListener('change', filterItems);
    
    // Menu toggle
    document.getElementById('menu-toggle').addEventListener('click', toggleMenu);
    document.getElementById('close-menu').addEventListener('click', closeMenu);
    document.getElementById('menu-overlay').addEventListener('click', closeMenu);
}

// Menu Functions
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    sideMenu.classList.add('active');
    overlay.classList.add('active');
}

function closeMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
}

// Authentication
function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    if (isAuthMode === 'login') {
        // Login logic
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUI();
            
            if (user.role === 'admin') {
                showPage('admin');
            } else {
                showPage('landing');
            }
            
            showNotification('Login successful!', 'success');
        } else {
            showNotification('Invalid credentials or role!', 'error');
        }
    } else {
        // Signup logic
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showNotification('User already exists!', 'error');
            return;
        }
        
        const newUser = {
            id: users.length + 1,
            name: email.split('@')[0],
            email: email,
            password: password,
            role: role,
            points: 100, // Starting points
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            listedItems: [],
            swapHistory: [],
            purchases: []
        };
        
        users.push(newUser);
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        updateUI();
        
        if (newUser.role === 'admin') {
            showPage('admin');
        } else {
            showPage('landing');
        }
        
        showNotification('Account created successfully!', 'success');
    }
    
    // Reset form
    document.getElementById('auth-form').reset();
}

function toggleAuthMode() {
    isAuthMode = isAuthMode === 'login' ? 'signup' : 'login';
    
    if (isAuthMode === 'signup') {
        document.getElementById('auth-title').textContent = 'Sign up for ReWear';
        document.getElementById('auth-submit').textContent = 'Sign Up';
        document.getElementById('auth-switch-text').textContent = 'Already have an account?';
        document.getElementById('auth-switch-link').textContent = 'Login';
    } else {
        document.getElementById('auth-title').textContent = 'Login to ReWear';
        document.getElementById('auth-submit').textContent = 'Login';
        document.getElementById('auth-switch-text').textContent = "Don't have an account?";
        document.getElementById('auth-switch-link').textContent = 'Sign up';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showPage('login');
    showNotification('Logged out successfully!', 'success');
}

// UI Updates
function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        userProfile.classList.add('active');
        
        // Update profile circle with initials
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('user-initials').textContent = initials;
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-points').textContent = `${currentUser.points} Points`;
        
        // Update dashboard info
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-points').textContent = `${currentUser.points} Points`;
        document.getElementById('member-since').textContent = currentUser.memberSince;
        document.getElementById('dashboard-initials').textContent = initials;
    } else {
        loginBtn.style.display = 'block';
        userProfile.classList.remove('active');
    }
}

// Page Navigation
function showPage(pageId) {
    // Close menu if open
    closeMenu();
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    let targetPage;
    switch(pageId) {
        case 'login':
            targetPage = 'auth-page';
            break;
        case 'landing':
            targetPage = 'landing-page';
            loadFeaturedItems();
            break;
        case 'browse':
            targetPage = 'browse-page';
            loadBrowseItems();
            break;
        case 'item-detail':
            targetPage = 'item-detail-page';
            break;
        case 'add-item':
            targetPage = 'add-item-page';
            break;
        case 'dashboard':
            targetPage = 'dashboard-page';
            loadDashboard();
            break;
        case 'admin':
            targetPage = 'admin-page';
            loadAdminDashboard();
            break;
        default:
            targetPage = 'landing-page';
    }
    
    document.getElementById(targetPage).classList.add('active');
    currentPage = pageId;
}

// Item Management
function loadFeaturedItems() {
    const carousel = document.getElementById('featured-carousel');
    carousel.innerHTML = '';
    
    items.slice(0, 4).forEach(item => {
        const itemCard = createItemCard(item);
        carousel.appendChild(itemCard);
    });
}

function loadBrowseItems() {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';
    
    let filteredItems = [...items];
    
    const categoryFilter = document.getElementById('category-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    if (categoryFilter) {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    if (sizeFilter) {
        filteredItems = filteredItems.filter(item => item.size === sizeFilter);
    }
    
    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        grid.appendChild(itemCard);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => showItemDetail(item.id);
    
    card.innerHTML = `
        <img src="${item.images[0]}" alt="${item.title}">
        <div class="item-card-content">
            <h3>${item.title}</h3>
            <div class="meta">
                <span>${item.category}</span>
                <span>Size ${item.size ? item.size.toUpperCase() : 'N/A'}</span>
            </div>
            <div class="points">${item.points} Points</div>
        </div>
    `;
    
    return card;
}

function showItemDetail(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('item-title').textContent = item.title;
    document.getElementById('item-category').textContent = item.category;
    document.getElementById('item-size').textContent = `Size: ${item.size ? item.size.toUpperCase() : 'N/A'}`;
    document.getElementById('item-condition').textContent = `Condition: ${item.condition}`;
    document.getElementById('item-points').textContent = `${item.points} Points`;
    
    // Make description editable if it's the current user's item
    const descriptionElement = document.getElementById('item-description');
    if (currentUser && item.uploader === currentUser.name) {
        descriptionElement.contentEditable = true;
        descriptionElement.style.border = '2px dashed var(--primary-violet)';
        descriptionElement.style.padding = '0.5rem';
        descriptionElement.style.borderRadius = '8px';
        descriptionElement.title = 'Click to edit description';
        
        // Save changes when user finishes editing
        descriptionElement.addEventListener('blur', function() {
            item.description = this.textContent;
            showNotification('Description updated!', 'success');
        });
    } else {
        descriptionElement.contentEditable = false;
        descriptionElement.style.border = 'none';
        descriptionElement.style.padding = '0';
        descriptionElement.title = '';
    }
    descriptionElement.textContent = item.description;
    
    document.getElementById('uploader-name').textContent = item.uploader;
    document.getElementById('main-image').querySelector('img').src = item.images[0];
    
    // Load previous listings
    loadPreviousListings(itemId);
    
    showPage('item-detail');
}

function loadPreviousListings(currentItemId) {
    const previousItems = document.getElementById('previous-items');
    previousItems.innerHTML = '';
    
    // Get other items from the same uploader
    const currentItem = items.find(i => i.id === currentItemId);
    const otherItems = items.filter(i => i.uploader === currentItem.uploader && i.id !== currentItemId).slice(0, 4);
    
    otherItems.forEach(item => {
        const itemCard = createSmallItemCard(item);
        previousItems.appendChild(itemCard);
    });
}

function createSmallItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => showItemDetail(item.id);
    
    card.innerHTML = `
        <img src="${item.images[0]}" alt="${item.title}">
        <div class="item-card-content">
            <h4>${item.title}</h4>
            <div class="points">${item.points} Points</div>
        </div>
    `;
    
    return card;
}

function handleAddItem(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to add items!', 'error');
        return;
    }
    
    const newItem = {
        id: items.length + 1,
        title: document.getElementById('item-name').value,
        description: document.getElementById('item-desc').value,
        category: document.getElementById('item-category').value,
        size: document.getElementById('item-size').value,
        condition: document.getElementById('item-condition').value,
        points: parseInt(document.getElementById('item-price').value),
        images: ['https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg'], // Placeholder
        uploader: currentUser.name,
        status: 'pending',
        tags: document.getElementById('item-tags').value.split(',').map(tag => tag.trim())
    };
    
    items.push(newItem);
    currentUser.listedItems.push(newItem.id);
    
    showNotification('Item submitted for approval!', 'success');
    document.getElementById('add-item-form').reset();
    showPage('dashboard');
}

function filterItems() {
    loadBrowseItems();
}

function filterByCategory(category) {
    document.getElementById('category-filter').value = category;
    showPage('browse');
    loadBrowseItems();
}

// Dashboard
function loadDashboard() {
    if (!currentUser) return;
    
    // Load user's items
    const userItems = document.getElementById('user-items');
    userItems.innerHTML = '';
    
    const userItemsList = items.filter(item => currentUser.listedItems.includes(item.id));
    
    if (userItemsList.length === 0) {
        userItems.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No items listed yet</p>';
    } else {
        userItemsList.forEach(item => {
            const itemCard = createDashboardItemCard(item);
            userItems.appendChild(itemCard);
        });
    }
    
    // Load user's purchases
    const userPurchases = document.getElementById('user-purchases');
    userPurchases.innerHTML = '';
    
    const purchasesList = items.filter(item => currentUser.purchases && currentUser.purchases.includes(item.id));
    
    if (purchasesList.length === 0) {
        userPurchases.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No purchases yet</p>';
    } else {
        purchasesList.forEach(item => {
            const itemCard = createDashboardItemCard(item);
            userPurchases.appendChild(itemCard);
        });
    }
}

function createDashboardItemCard(item) {
    const card = document.createElement('div');
    card.className = 'user-item';
    card.onclick = () => showItemDetail(item.id);
    
    card.innerHTML = `
        <img src="${item.images[0]}" alt="${item.title}">
        <div class="user-item-content">
            <h4>${item.title}</h4>
            <p>Status: ${item.status}</p>
            <p class="points">${item.points} Points</p>
        </div>
    `;
    
    return card;
}

// Admin Dashboard
function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    // Load pending items
    const pendingItems = document.getElementById('pending-items');
    pendingItems.innerHTML = '';
    
    const pendingItemsList = items.filter(item => item.status === 'pending');
    
    if (pendingItemsList.length === 0) {
        pendingItems.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No pending items</p>';
    } else {
        pendingItemsList.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'pending-item';
            itemDiv.innerHTML = `
                <div>
                    <h4>${item.title}</h4>
                    <p>By: ${item.uploader}</p>
                    <p>${item.points} Points</p>
                </div>
                <div class="actions">
                    <button class="approve-btn" onclick="approveItem(${item.id})">Approve</button>
                    <button class="reject-btn" onclick="rejectItem(${item.id})">Reject</button>
                </div>
            `;
            pendingItems.appendChild(itemDiv);
        });
    }
    
    // Load recent activity
    loadRecentActivity();
}

function approveItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = 'available';
        showNotification('Item approved!', 'success');
        loadAdminDashboard();
        loadFeaturedItems();
        loadBrowseItems();
    }
}

function rejectItem(itemId) {
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        showNotification('Item rejected and removed!', 'success');
        loadAdminDashboard();
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('recent-activity');
    activityList.innerHTML = '';
    
    const activities = [
        'New user John Doe registered',
        'Item "Vintage Jacket" was approved',
        'Swap completed between Sarah and Mike',
        'New item "Summer Dress" submitted for review',
        'User Emma L. earned 50 points'
    ];
    
    activities.forEach(activity => {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'activity-item';
        activityDiv.textContent = activity;
        activityList.appendChild(activityDiv);
    });
}

// Item Actions
function requestSwap() {
    if (!currentUser) {
        showNotification('Please login to request swaps!', 'error');
        return;
    }
    showNotification('Swap request sent!', 'success');
}

function redeemWithPoints() {
    if (!currentUser) {
        showNotification('Please login to redeem items!', 'error');
        return;
    }
    
    const itemPoints = parseInt(document.getElementById('item-points').textContent);
    
    if (currentUser.points >= itemPoints) {
        currentUser.points -= itemPoints;
        
        // Initialize purchases array if it doesn't exist
        if (!currentUser.purchases) {
            currentUser.purchases = [];
        }
        
        // Add to user's purchases
        const currentItemTitle = document.getElementById('item-title').textContent;
        const currentItem = items.find(item => item.title === currentItemTitle);
        if (currentItem && !currentUser.purchases.includes(currentItem.id)) {
            currentUser.purchases.push(currentItem.id);
        }
        
        // Update UI
        document.getElementById('user-points').textContent = `${currentUser.points} Points`;
        document.getElementById('profile-points').textContent = `${currentUser.points} Points`;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Item redeemed successfully!', 'success');
    } else {
        showNotification('Insufficient points!', 'error');
    }
}

// Notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);