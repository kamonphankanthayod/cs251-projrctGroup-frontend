document.addEventListener('DOMContentLoaded', function() {
    // ตั้งค่าปุ่มยกเลิกคลาส
    setupCancelButtons();
    
    // โหลดข้อมูลคลาสที่ลงทะเบียน
    loadUpcomingClasses();
});

// ฟังก์ชันโหลดข้อมูลคลาสที่ลงทะเบียน
async function loadUpcomingClasses() {
    const classesContainer = document.getElementById('upcoming-classes-list');
    
    try {
        // ในระบบจริงจะใช้ API.getUpcomingClasses() เพื่อดึงข้อมูล
        const classes = await API.getUpcomingClasses();
        
        if (classes && classes.length > 0) {
            classesContainer.innerHTML = '';
            
            classes.forEach(classItem => {
                const classElement = createClassElement(classItem);
                classesContainer.appendChild(classElement);
            });
            
            // ตั้งค่าปุ่มยกเลิกคลาสหลังจากโหลดข้อมูล
            setupCancelButtons();
        } else {
            classesContainer.innerHTML = '<div class="no-data">คุณยังไม่มีคลาสที่ลงทะเบียน</div>';
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดคลาส:', error);
        showNotification('ไม่สามารถโหลดข้อมูลคลาสได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

// ฟังก์ชันสร้าง element สำหรับคลาส
function createClassElement(classData) {
    const classItem = document.createElement('div');
    classItem.className = 'class-item';
    classItem.dataset.id = classData.id;
    
    classItem.innerHTML = `
        <div class="class-header">
            <div class="class-title">${classData.title}</div>
            <div class="class-studio">${classData.studio}</div>
        </div>
        <div class="class-instructor">Instructor: ${classData.instructor}</div>
        <div class="class-details">
            <div class="class-detail">
                <i class="fas fa-calendar"></i> ${classData.date}
            </div>
            <div class="class-detail">
                <i class="fas fa-clock"></i> ${classData.time}
            </div>
            <button class="cancel-btn" data-id="${classData.id}">✕ Cancel</button>
        </div>
    `;
    
    return classItem;
}

// ฟังก์ชันตั้งค่าปุ่มยกเลิกคลาส
function setupCancelButtons() {
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const classId = this.getAttribute('data-id');
            
            if (confirm('คุณต้องการยกเลิกการลงทะเบียนคลาสนี้หรือไม่?')) {
                try {
                    // ในระบบจริงจะเรียกใช้ API
                    await API.cancelClassRegistration(classId);
                    
                    // ลบคลาสออกจาก UI
                    const classItem = this.closest('.class-item');
                    classItem.remove();
                    
                    // แสดงการแจ้งเตือน
                    showNotification('ยกเลิกการลงทะเบียนคลาสเรียบร้อยแล้ว');
                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการยกเลิกคลาส:', error);
                    showNotification('ไม่สามารถยกเลิกการลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง', 'error');
                }
            }
        });
    });
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // ตั้งค่าข้อความและประเภท
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    
    // แสดงการแจ้งเตือน
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // ซ่อนการแจ้งเตือนหลังจาก 3 วินาที
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}