
function formatNumber(num) {
    return num.toLocaleString('es-CO');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                counter.textContent = formatNumber(Math.floor(current));
            }
        }, 40);
    });
}

function setupSalesChart() {
    const chartElement = document.getElementById('ventasChart');
    if (!chartElement) return;
    const ctx = chartElement.getContext('2d');
    const weekData = [1200000, 1900000, 800000, 1400000, 2100000, 2800000, 2200000];
    const monthData = [15000000, 18000000, 22000000, 19000000, 25000000, 28000000, 30000000,
                      32000000, 29000000, 35000000, 38000000, 40000000];
    let currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas ($)',
                data: weekData,
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            periodButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.getAttribute('data-period');
            if (period === 'week') {
                currentChart.data.labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                currentChart.data.datasets[0].data = weekData;
            } else if (period === 'month') {
                currentChart.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                currentChart.data.datasets[0].data = monthData;
            }
            currentChart.update();
        });
    });
    return currentChart;
}

function showLowStockAlert() {
    const stockBajoElement = document.querySelector('[data-target]');
    const stockBajo = stockBajoElement ? stockBajoElement.getAttribute('data-target') : '23';
    if (confirm(`Hay ${stockBajo} productos con stock bajo que necesitan reposición.\n\n¿Deseas ir al inventario para revisar?`)) {
        window.location.href = '/inventario?filter=low-stock';
    }
}

function updateNotifications() {
    console.log('Actualizando notificaciones...');
}

function initializeDashboard() {
    setTimeout(() => {
        animateCounters();
    }, 500);
    setTimeout(() => {
        setupSalesChart();
    }, 1000);
    updateNotifications();
    console.log('Dashboard inicializado correctamente');
}

const ClientManager = {
    init() {
        this.setupEventListeners();
        this.loadClients();
    },
    setupEventListeners() {
        const searchInput = document.getElementById('clientSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.filterClients.bind(this));
        }
        const addClientBtn = document.getElementById('addClientBtn');
        if (addClientBtn) {
            addClientBtn.addEventListener('click', this.showAddClientModal.bind(this));
        }
    },
    loadClients() {
        console.log('Cargando clientes...');
    },
    filterClients(event) {
        const searchTerm = event.target.value.toLowerCase();
        const clientRows = document.querySelectorAll('.client-row');
        clientRows.forEach(row => {
            const clientName = row.querySelector('.client-name')?.textContent.toLowerCase() || '';
            const clientEmail = row.querySelector('.client-email')?.textContent.toLowerCase() || '';
            if (clientName.includes(searchTerm) || clientEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },
    showAddClientModal() {
        console.log('Mostrando modal de agregar cliente');
    }
};

const InventoryManager = {
    init() {
        this.setupEventListeners();
        this.loadProducts();
    },
    setupEventListeners() {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.filterProducts.bind(this));
        }
        const stockFilters = document.querySelectorAll('[data-stock-filter]');
        stockFilters.forEach(filter => {
            filter.addEventListener('click', this.filterByStock.bind(this));
        });
    },
    loadProducts() {
        console.log('Cargando productos...');
    },
    filterProducts(event) {
        const searchTerm = event.target.value.toLowerCase();
        const productRows = document.querySelectorAll('.product-row');
        productRows.forEach(row => {
            const productName = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const productCode = row.querySelector('.product-code')?.textContent.toLowerCase() || '';
            if (productName.includes(searchTerm) || productCode.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },
    filterByStock(event) {
        const filterType = event.target.getAttribute('data-stock-filter');
        const productRows = document.querySelectorAll('.product-row');
        productRows.forEach(row => {
            const stockElement = row.querySelector('.product-stock');
            if (!stockElement) return;
            const stock = parseInt(stockElement.textContent);
            let show = true;
            switch (filterType) {
                case 'low':
                    show = stock < 10;
                    break;
                case 'medium':
                    show = stock >= 10 && stock < 50;
                    break;
                case 'high':
                    show = stock >= 50;
                    break;
                default:
                    show = true;
            }
            row.style.display = show ? '' : 'none';
        });
    }
};

const SalesManager = {
    cart: [],
    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
    },
    setupEventListeners() {
        const productSearch = document.getElementById('productSearchSale');
        if (productSearch) {
            productSearch.addEventListener('input', this.searchProducts.bind(this));
        }
        const processSaleBtn = document.getElementById('processSaleBtn');
        if (processSaleBtn) {
            processSaleBtn.addEventListener('click', this.processSale.bind(this));
        }
    },
    searchProducts(event) {
        const searchTerm = event.target.value;
        if (searchTerm.length < 2) return;
        console.log('Buscando productos:', searchTerm);
    },
    addToCart(productId, productName, price, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: price,
                quantity: quantity
            });
        }
        this.updateCartDisplay();
    },
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    },
    updateCartDisplay() {
        const cartContainer = document.getElementById('saleCart');
        const totalContainer = document.getElementById('saleTotal');
        if (!cartContainer) return;
        let total = 0;
        cartContainer.innerHTML = '';
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <small>${formatCurrency(item.price)} x ${item.quantity}</small>
                </div>
                <div class="cart-item-total">
                    ${formatCurrency(itemTotal)}
                </div>
                <button class="btn btn-sm btn-danger" onclick="SalesManager.removeFromCart('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartContainer.appendChild(cartItem);
        });
        if (totalContainer) {
            totalContainer.textContent = formatCurrency(total);
        }
    },
    processSale() {
        if (this.cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (confirm(`¿Confirmar venta por ${formatCurrency(total)}?`)) {
            console.log('Procesando venta:', this.cart);
            this.cart = [];
            this.updateCartDisplay();
            alert('Venta procesada exitosamente');
        }
    }
};

function setupPagination(containerId, itemsPerPage = 8) {
    const container = document.getElementById(containerId);
    const rows = container.getElementsByClassName('custom-table-row');
    const totalPages = Math.ceil(rows.length / itemsPerPage);
    
    function showPage(pageNum) {
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        Array.from(rows).forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? 'flex' : 'none';
        });
        
        updatePaginationButtons(pageNum);
    }
    
    function updatePaginationButtons(currentPage) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
        
        // Botón Previous
        const prevButton = document.createElement('div');
        prevButton.innerHTML = '«';
        prevButton.className = currentPage === 1 ? 'disabled' : '';
        prevButton.onclick = () => currentPage > 1 && showPage(currentPage - 1);
        paginationContainer.appendChild(prevButton);
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('div');
            pageButton.innerText = i;
            pageButton.className = i === currentPage ? 'active' : '';
            pageButton.onclick = () => showPage(i);
            paginationContainer.appendChild(pageButton);
        }
        
        // Botón Next
        const nextButton = document.createElement('div');
        nextButton.innerHTML = '»';
        nextButton.className = currentPage === totalPages ? 'disabled' : '';
        nextButton.onclick = () => currentPage < totalPages && showPage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
    
    // Inicializar paginación
    if (rows.length > 0) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        container.parentNode.insertBefore(paginationDiv, container.nextSibling);
        showPage(1);
    }
}

// Inicializar paginación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const tables = ['clientsTable', 'employeesTable', 'inventoryTable', 'suppliersTable'];
    tables.forEach(tableId => {
        if (document.getElementById(tableId)) {
            setupPagination(tableId);
        }
    });
});

function initializePageSpecificFunctions() {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/dashboard' || currentPath.includes('index')) {
        initializeDashboard();
    }
    if (currentPath.includes('client') || currentPath.includes('/view/clients')) {
        ClientManager.init();
    }
    if (currentPath.includes('inventario') || currentPath.includes('inventory')) {
        InventoryManager.init();
    }
    if (currentPath.includes('venta') || currentPath.includes('sale')) {
        SalesManager.init();
    }
}

function initializeGlobalFunctions() {
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    const deleteButtons = document.querySelectorAll('[data-confirm-delete]');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm-delete') || '¿Estás seguro de que quieres eliminar este elemento?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
    const alerts = document.querySelectorAll('.alert[data-auto-hide]');
    alerts.forEach(alert => {
        const delay = parseInt(alert.getAttribute('data-auto-hide')) || 5000;
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, delay);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('ArkoSystem - Inicializando aplicación...');
    initializeGlobalFunctions();
    initializePageSpecificFunctions();
    console.log('ArkoSystem - Aplicación inicializada correctamente');
});

window.ArkoSystem = {
    showLowStockAlert,
    formatCurrency,
    formatNumber,
    SalesManager,
    ClientManager,
    InventoryManager
};

document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('active')) {
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Efectos de los iconos en los inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const icon = this.parentElement.querySelector('.form-icon');
            if (icon) {
                icon.style.color = '#d4a017';
            }
        });

        input.addEventListener('blur', function() {
            const icon = this.parentElement.querySelector('.form-icon');
            if (icon && !this.value) {
                icon.style.color = '#6c757d';
            }
        });
    });

    // Auto-ocultar alertas después de 5 segundos
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        });
    }, 5000);
});

// Validación del formulario
document.querySelector('.login-form').addEventListener('submit', function(e) {
    const email = this.querySelector('input[name="username"]');
    const password = this.querySelector('input[name="password"]');

    if (!email.value.trim()) {
        e.preventDefault();
        email.focus();
        showMessage('Por favor, ingrese su correo electrónico.', 'error');
        return;
    }

    if (!password.value.trim()) {
        e.preventDefault();
        password.focus();
        showMessage('Por favor, ingrese su contraseña.', 'error');
        return;
    }

    // Mostrar indicador de carga
    const submitBtn = this.querySelector('.btn-login');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
    submitBtn.disabled = true;

    // Si hay un error, restaurar el botón
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
});

function showMessage(message, type) {
    const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass}`;
    alertDiv.innerHTML = `<i class="fas ${icon} me-2"></i>${message}`;

    const form = document.querySelector('.login-form');
    form.parentNode.insertBefore(alertDiv, form);

    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

// ... (código JavaScript anterior para gestionar el carrito) ...

// Event listener para el botón de registrar venta
btnProcessSale.addEventListener('click', async () => {
    if (Object.keys(cart).length === 0) {
        alert('No hay productos en la venta para registrar.');
        return;
    }

    const client = document.getElementById('clientSelect').value;
    if (!client) {
        alert('Por favor, seleccione un cliente.');
        return;
    }

    const saleData = {
        client: client,
        paymentMethod: document.getElementById('paymentMethod').value,
        items: Object.values(cart),
        total: parseFloat(totalAmountSpan.textContent.substring(1))
    };

    try {
        const response = await fetch('/view/process-sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saleData)
        });

        const result = await response.text();

        if (response.ok) {
            alert('¡Venta registrada con éxito!');

            // Limpiar el carrito y la UI después de registrar la venta
            cart = {};
            renderCart();
            document.getElementById('clientSelect').value = '';
        } else {
            alert('Error: ' + result);
        }

    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert('Ocurrió un error inesperado al registrar la venta.');
    }
});