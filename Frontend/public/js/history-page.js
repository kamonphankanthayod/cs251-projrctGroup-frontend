document.addEventListener("DOMContentLoaded", () => {
    // ตั้งค่าแท็บประวัติ
    setupHistoryTabs();
    
    // ตั้งค่าปุ่มโหลดเพิ่มเติม
    setupLoadMoreButton();
    
    // โหลดข้อมูลประวัติการเข้าใช้บริการ (เริ่มต้นที่แท็บ Gym visit)
    loadGymVisitHistory();
    
    // โหลดข้อมูลสรุปกิจกรรม
    loadActivitySummary();
    
    // ตั้งค่า Modal ใบเสร็จ
    setupInvoiceModal();
    
    // ตั้งค่าปุ่มดูใบเสร็จ
    setupViewButtons();
});

// ฟังก์ชันตั้งค่าแท็บประวัติ
function setupHistoryTabs() {
    const tabContainer = document.getElementById('history-tabs');
    if (!tabContainer) return;
    
    const tabButtons = tabContainer.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // เปลี่ยนแท็บ
            switchTab(tabContainer, tabId);
            
            // โหลดข้อมูลตามแท็บที่เลือก
            if (tabId === 'gym-visit') {
                loadGymVisitHistory();
            } else if (tabId === 'payment') {
                loadPaymentHistory();
            }
        });
    });
}

// ฟังก์ชันตั้งค่าปุ่มโหลดเพิ่มเติม
function setupLoadMoreButton() {
    const loadMoreButton = document.getElementById('load-more-history');
    if (!loadMoreButton) return;
    
    loadMoreButton.addEventListener('click', function() {
        // ตรวจสอบว่าแท็บไหนกำลังแสดงอยู่
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'gym-visit') {
            // โหลดข้อมูลประวัติการเข้าใช้บริการเพิ่มเติม
            loadMoreGymVisitHistory();
        } else if (activeTab === 'payment') {
            // โหลดข้อมูลประวัติการชำระเงินเพิ่มเติม
            loadMorePaymentHistory();
        }
    });
}

// ฟังก์ชันตั้งค่าปุ่มดูใบเสร็จ
function setupViewButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const paymentId = this.getAttribute('data-id');
            showInvoice(paymentId);
        });
    });
}

// ฟังก์ชันโหลดข้อมูลประวัติการเข้าใช้บริการ
async function loadGymVisitHistory(page = 1) {
    const gymVisitTable = document.getElementById('gym-visit-table');
    if (!gymVisitTable) return;
    
    try {
        if (page === 1) {
            showLoading(gymVisitTable);
        }
        
        // ใช้ข้อมูล mock สำหรับการพัฒนา
        const mockVisits = [
            {
                id: "VISIT001",
                date: "12-01-2025",
                time: "08:15 - 09:30",
                duration: "2h 15m",
                type: "Regular visit"
            },
            {
                id: "VISIT002",
                date: "12-01-2025",
                time: "08:15 - 09:30",
                duration: "2h 15m",
                type: "Regular visit"
            },
            {
                id: "VISIT003",
                date: "12-01-2025",
                time: "08:15 - 09:30",
                duration: "2h 15m",
                type: "Regular visit"
            },
            {
                id: "VISIT004",
                date: "12-01-2025",
                time: "08:15 - 09:30",
                duration: "2h 15m",
                type: "Regular visit"
            }
        ];
        
        // จำลองการเรียก API
        // const response = await API.getGymVisitHistory(page);
        // const visits = response.data;
        
        const visits = mockVisits;
        const hasMore = true; // จำลองว่ามีข้อมูลเพิ่มเติม
        
        if (page === 1) {
            gymVisitTable.innerHTML = '';
        }
        
        if (visits && visits.length > 0) {
            visits.forEach(visit => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${visit.date}</td>
                    <td>${visit.time}</td>
                    <td>${visit.duration}</td>
                    <td><span class="badge">${visit.type}</span></td>
                `;
                
                gymVisitTable.appendChild(row);
            });
            
            // อัพเดทหน้าปัจจุบัน
            gymVisitTable.setAttribute('data-page', page);
            
            // อัพเดทสถานะปุ่มโหลดเพิ่มเติม
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            }
        } else if (page === 1) {
            showNoData(gymVisitTable, 'ไม่พบข้อมูลประวัติการเข้าใช้บริการ');
            
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลประวัติการเข้าใช้บริการ:', error);
        if (page === 1) {
            showNoData(gymVisitTable, 'ไม่สามารถโหลดข้อมูลประวัติการเข้าใช้บริการได้');
            
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        } else {
            showNotification('ไม่สามารถโหลดข้อมูลเพิ่มเติมได้ กรุณาลองใหม่อีกครั้ง', 'error');
        }
    }
}

// ฟังก์ชันโหลดข้อมูลประวัติการชำระเงิน
async function loadPaymentHistory(page = 1) {
    id = 1 //const id = localStorage.getItem("id");
    const paymentTable = document.getElementById('payment-table');
    if (!paymentTable) return;
    
    try {
        if (page === 1) {
            showLoading(paymentTable);
        }
        
        const header = {
            "Content-Type": "application/json"
        };
        url = "http://localhost:8080/payment/get-by-member/"+id; 
        response = await fetch(url, {
            method: "GET",
            headers: header
        });
        console.log(response);
        data = await response.json();
        payments = []
        for(const i of data){
            if(i.paymentStatus == "Success"){
             payments.push(i);
            }
        }
        
        const hasMore = true; // จำลองว่ามีข้อมูลเพิ่มเติม
        
        if (page === 1) {
            paymentTable.innerHTML = '';
        }
        
        if (payments && payments.length > 0) {
            payments.forEach(payment => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${payment.paymentDate}</td>
                    <td>${payment.planName}</td>
                    <td>${payment.amount}</td>
                    <td>${payment.paymentMethod}</td>
                    <td><a href="#" class="view-btn" data-id="${payment.paymentId}">View</a></td>
                `;
                
                paymentTable.appendChild(row);
            });
            
            // อัพเดทหน้าปัจจุบัน
            paymentTable.setAttribute('data-page', page);
            
            // อัพเดทสถานะปุ่มโหลดเพิ่มเติม
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            }
            
            // ตั้งค่าปุ่มดูใบเสร็จ
            setupViewButtons();
        } else if (page === 1) {
            showNoData(paymentTable, 'ไม่พบข้อมูลประวัติการชำระเงิน');
            
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลประวัติการชำระเงิน:', error);
        if (page === 1) {
            showNoData(paymentTable, 'ไม่สามารถโหลดข้อมูลประวัติการชำระเงินได้');
            
            const loadMoreBtn = document.getElementById('load-more-history');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        } else {
            showNotification('ไม่สามารถโหลดข้อมูลเพิ่มเติมได้ กรุณาลองใหม่อีกครั้ง', 'error');
        }
    }
}

// ฟังก์ชันโหลดข้อมูลประวัติการเข้าใช้บริการเพิ่มเติม
function loadMoreGymVisitHistory() {
    // ดึงหน้าปัจจุบัน
    const currentPage = parseInt(document.getElementById('gym-visit-table').getAttribute('data-page') || '1');
    
    // โหลดข้อมูลหน้าถัดไป
    loadGymVisitHistory(currentPage + 1);
}

// ฟังก์ชันโหลดข้อมูลประวัติการชำระเงินเพิ่มเติม
function loadMorePaymentHistory() {
    // ดึงหน้าปัจจุบัน
    const currentPage = parseInt(document.getElementById('payment-table').getAttribute('data-page') || '1');
    
    // โหลดข้อมูลหน้าถัดไป
    loadPaymentHistory(currentPage + 1);
}

// ฟังก์ชันโหลดข้อมูลสรุปกิจกรรม
async function loadActivitySummary() {
    const statsContainer = document.getElementById('activity-stats');
    if (!statsContainer) return;
    
    try {
        showLoading(statsContainer);
        
        const mockSummary = {
            totalVisits: 24,
            totalClasses: 12,
            totalHours: 36.5,
            totalSpent: await totalpayment(),
            period: "Last 3 months"
        };
        
        // จำลองการเรียก API
        // const summary = await API.getActivitySummary();
        
        const summary = mockSummary;
        
        if (summary) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user"></i></div>
                    <div class="stat-value">${summary.totalVisits}</div>
                    <div class="stat-label">Total Visit<br>${summary.period}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                    <div class="stat-value">${summary.totalClasses}</div>
                    <div class="stat-label">Class Attendance<br>${summary.period}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-value">${summary.totalHours}</div>
                    <div class="stat-label">Total Hours<br>${summary.period}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                    <div class="stat-value">${summary.totalSpent}</div>
                    <div class="stat-label">Total Spent<br>${summary.period}</div>
                </div>
            `;
        } else {
            showNoData(statsContainer, 'ไม่พบข้อมูลสรุปกิจกรรม');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสรุปกิจกรรม:', error);
        showNoData(statsContainer, 'ไม่สามารถโหลดข้อมูลสรุปกิจกรรมได้');
    }
}

// ฟังก์ชันแสดงใบเสร็จ
async function showInvoice(paymentId) {
    const modal = document.getElementById('invoice-modal');
    if (!modal) return;
    
    try {
        const header = {
        "Content-Type": "application/json"
        };
        url = "http://localhost:8080/payment/"+paymentId; 
        response = await fetch(url, {
            method: "GET",
            headers: header
        });
        datapayment = await response.json();
        console.log(datapayment);

        url = "http://localhost:8080/member/"+datapayment.memberId;
        response = await fetch(url, {
            method: "GET",
            headers: header
        });
        datamember = await response.json();
        console.log(datamember);

        url = "http://localhost:8080/membership";
        response = await fetch(url, {
            method: "GET",
            headers: header
        });
        dataplan = await response.json();
        console.log(dataplan);

        for(const i of dataplan){
            if(i.planName==datapayment.planName){
                baseprice = i.price
            }
        }
        console.log(baseprice);
        
        const Invoice = {
            id: paymentId,
            date: datapayment.paymentDate,
            customer: {
                name: datamember.fname + " " + datamember.lname,
                email: datamember.email,
                address: datamember.address
            },
            items: [
                {
                    description: "Monthly Membership - "+datapayment.planName+" Plan",
                    quantity: 1,
                    unitPrice: baseprice ,
                    amount: datapayment.amount
                }
            ],
            subtotal: datapayment.amount,
            total: datapayment.amount,
            payment: {
                method: datapayment.paymentMethod,
                date: datapayment.paymentDate,
                status: datapayment.paymentStatus
            }
        }; 
        
        const invoice = Invoice;
        
        if (invoice) {
            // อัพเดทข้อมูลใบเสร็จใน Modal
            const invoiceNumber = document.getElementById('invoice-number');
            const invoiceDate = document.getElementById('invoice-date');
            const customerName = document.getElementById('customer-name');
            const customerEmail = document.getElementById('customer-email');
            const customerAddress = document.getElementById('customer-address');
            const invoiceItems = document.getElementById('invoice-items');
            const invoiceSummary = document.getElementById('invoice-summary');
            const paymentMethod = document.getElementById('payment-method');
            const paymentDate = document.getElementById('payment-date');
            const paymentStatus = document.getElementById('payment-status');
            
            if (invoiceNumber) invoiceNumber.textContent = `Invoice #${invoice.id}`;
            if (invoiceDate) invoiceDate.textContent = `Date: ${invoice.date}`;
            if (customerName) customerName.textContent = invoice.customer.name;
            if (customerEmail) customerEmail.textContent = invoice.customer.email;
            if (customerAddress) customerAddress.textContent = invoice.customer.address;
            
            // อัพเดทรายการในใบเสร็จ
            if (invoiceItems) {
                invoiceItems.innerHTML = '';
                
                invoice.items.forEach(item => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>฿${item.unitPrice.toFixed(2)}</td>
                        <td>฿${item.amount.toFixed(2)}</td>
                    `;
                    
                    invoiceItems.appendChild(row);
                });
            }
            
            // อัพเดทสรุปยอดในใบเสร็จ
            if (invoiceSummary) {
                invoiceSummary.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-right">Subtotal</td>
                        <td>฿${invoice.subtotal.toFixed(2)}</td>
                    </tr>
                    
                    <tr>
                        <td colspan="3" class="text-right">Total</td>
                        <td>฿${invoice.total.toFixed(2)}</td>
                    </tr>
                `;
            }
            
            // อัพเดทข้อมูลการชำระเงิน
            if (paymentMethod) paymentMethod.textContent = `Payment Method: ${invoice.payment.method}`;
            if (paymentDate) paymentDate.textContent = `Payment Date: ${invoice.payment.date}`;
            if (paymentStatus) paymentStatus.textContent = `Payment Status: ${invoice.payment.status}`;
            
            // แสดง Modal
            modal.style.display = 'block';
        } else {
            throw new Error('ไม่พบข้อมูลใบเสร็จ');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลใบเสร็จ:', error);
        showNotification('ไม่สามารถโหลดข้อมูลใบเสร็จได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}



async function totalpayment() {
    id=1 //const id = localStorage.getItem("id");   
    const header = {
        "Content-Type": "application/json"
    };
    url = "http://localhost:8080/payment/get-by-member/"+id; 
    response = await fetch(url, {
        method: "GET",
        headers: header
    });
    data = await response.json();
    payments = []
    total = 0
    
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; 
    const day = dateObj.getDate();

    for(const i of data){
        if(i.paymentStatus === "Success" ){
            paymentdate = i.paymentDate
            date = paymentdate.split('-');
            if(date[0]!=year){
                year = date[0]
                month +=12
            }
            ((month-date[1])*30)+date[2]<=90
            if(month-date[1]<3 || (month-date[1]==3 && day<date[2])){
                payments.push(i);
                total+=i.amount
            }
        }
    }
    console.log(total);
    return total
}