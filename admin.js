document.addEventListener('DOMContentLoaded', () => {

    // 1. Sidebar Toggle Logic for Mobile
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('active');
        });
    }

    // Optional: click outside sidebar to close on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('active');
            }
        }
    });

    // 2. Dummy Data for Recent Orders Table
    const orders = [
        {
            id: '#FD-00124',
            customer: 'John Doe',
            customerImg: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
            pickup: 'New York, NY',
            dropoff: 'Los Angeles, CA',
            type: 'Box/Parcel',
            status: 'Delivered',
            statusClass: 'bg-success-light text-success'
        },
        {
            id: '#FD-00125',
            customer: 'Sarah Smith',
            customerImg: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random',
            pickup: 'Chicago, IL',
            dropoff: 'Miami, FL',
            type: 'Document',
            status: 'In Transit',
            statusClass: 'bg-primary-light text-primary'
        },
        {
            id: '#FD-00126',
            customer: 'Mike Johnson',
            customerImg: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
            pickup: 'Austin, TX',
            dropoff: 'Denver, CO',
            type: 'Heavy Freight',
            status: 'Pending',
            statusClass: 'bg-warning-light text-warning'
        },
        {
            id: '#FD-00127',
            customer: 'Emily Davis',
            customerImg: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random',
            pickup: 'Seattle, WA',
            dropoff: 'Portland, OR',
            type: 'Fragile Item',
            status: 'In Transit',
            statusClass: 'bg-primary-light text-primary'
        },
        {
            id: '#FD-00128',
            customer: 'Chris Lee',
            customerImg: 'https://ui-avatars.com/api/?name=Chris+Lee&background=random',
            pickup: 'Boston, MA',
            dropoff: 'Newark, NJ',
            type: 'Box/Parcel',
            status: 'Pending',
            statusClass: 'bg-warning-light text-warning'
        }
    ];

    const tableBody = document.getElementById('ordersTableBody');

    if(tableBody) {
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4 fw-medium">${order.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${order.customerImg}" alt="${order.customer}" class="rounded-circle me-3" width="35">
                        <span class="fw-medium">${order.customer}</span>
                    </div>
                </td>
                <td>
                    <span class="d-block text-muted" style="font-size: 0.85rem;"><i class="bi bi-geo-alt me-1 text-brand"></i>${order.pickup}</span>
                    <span class="d-block fw-medium mt-1"><i class="bi bi-arrow-down-short me-1 text-muted"></i>${order.dropoff}</span>
                </td>
                <td><span class="text-secondary"><i class="bi bi-box me-2"></i>${order.type}</span></td>
                <td>
                    <span class="badge rounded-pill ${order.statusClass}">${order.status}</span>
                </td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-light text-primary border-0 shadow-sm rounded-3 me-2" title="View details"><i class="bi bi-eye-fill"></i></button>
                    <button class="btn btn-sm btn-light border-0 shadow-sm rounded-3" title="More actions"><i class="bi bi-three-dots-vertical"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }
});
