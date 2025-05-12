document.addEventListener("DOMContentLoaded", () => {
    // โหลดข้อมูล trainer
    loadTrainers();
    
    // ตั้งค่า Modal สำหรับการให้คะแนนและรีวิว
    setupReviewModal();
    
    // ตั้งค่าปุ่มปิด Modal
    setupModalClose();
});

// Mock data สำหรับ trainers
const mockTrainers = [
    {
        id: "trainer1",
        name: "John Cena",
        specialty: "Strength Training",
        image: "/placeholder.svg?height=60&width=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.8,
        reviewCount: 24,
        userReview: {
            rating: 5,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, laoreet lectus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at."
        }
    },
    {
        id: "trainer2",
        name: "Lebron James",
        specialty: "Basketball Training",
        image: "/placeholder.svg?height=60&width=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.9,
        reviewCount: 32,
        userReview: {
            rating: 4.5,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, laoreet lectus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at."
        }
    },
    {
        id: "trainer3",
        name: "Christina Sae-tae",
        specialty: "Yoga Instructor",
        image: "/placeholder.svg?height=60&width=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.7,
        reviewCount: 18,
        userReview: null
    },
    {
        id: "trainer4",
        name: "Michael Jordan",
        specialty: "Basketball Training",
        image: "/placeholder.svg?height=60&width=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 5.0,
        reviewCount: 45,
        userReview: {
            rating: 5,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, laoreet lectus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at."
        }
    },
    {
        id: "trainer5",
        name: "Serena Williams",
        specialty: "Tennis Training",
        image: "/placeholder.svg?height=60&width=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.6,
        reviewCount: 28,
        userReview: null
    }
];

// ฟังก์ชันโหลดข้อมูล trainer
async function loadTrainers() {
    const trainersContainer = document.getElementById('trainers-container');
    if (!trainersContainer) return;
    
    try {
        showLoading(trainersContainer);
        
        // จำลองการเรียก API
        // const response = await API.getTrainers();
        // const trainers = response.data;
        
        const trainers = mockTrainers;
        
        if (trainers && trainers.length > 0) {
            trainersContainer.innerHTML = '';
            
            // แบ่ง trainer เป็นแถว แถวละ 3 คน
            for (let i = 0; i < trainers.length; i += 3) {
                const row = document.createElement('div');
                row.className = 'trainer-row';
                
                // สร้าง trainer card สำหรับแต่ละคนในแถว
                for (let j = i; j < i + 3 && j < trainers.length; j++) {
                    const trainer = trainers[j];
                    const trainerCard = createTrainerCard(trainer);
                    row.appendChild(trainerCard);
                }
                
                trainersContainer.appendChild(row);
            }
            
            // ตั้งค่าปุ่มสำหรับการให้คะแนนและแก้ไขรีวิว
            setupRatingButtons();
            setupEditButtons();
        } else {
            showNoData(trainersContainer, 'ไม่พบข้อมูลเทรนเนอร์');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลเทรนเนอร์:', error);
        showNoData(trainersContainer, 'ไม่สามารถโหลดข้อมูลเทรนเนอร์ได้');
    }
}

// ฟังก์ชันสร้าง trainer card
function createTrainerCard(trainer) {
    const card = document.createElement('div');
    card.className = 'trainer-card';
    card.setAttribute('data-trainer-id', trainer.id);
    
    // สร้างส่วนหัวของการ์ด
    const header = document.createElement('div');
    header.className = 'trainer-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'trainer-avatar';
    avatar.innerHTML = `<img src="${trainer.image}" alt="${trainer.name}">`;
    
    const info = document.createElement('div');
    info.className = 'trainer-info';
    info.innerHTML = `
        <h3>${trainer.name}</h3>
        <p>${trainer.specialty}</p>
    `;
    
    header.appendChild(avatar);
    header.appendChild(info);
    
    // สร้างส่วนคำอธิบาย
    const description = document.createElement('div');
    description.className = 'trainer-description';
    description.textContent = trainer.description;
    
    // สร้างส่วนคะแนน
    const ratingSection = document.createElement('div');
    ratingSection.className = 'trainer-rating';
    
    const stars = document.createElement('span');
    stars.className = 'rating-stars';
    stars.innerHTML = generateStars(trainer.rating);
    
    const ratingValue = document.createElement('span');
    ratingValue.className = 'rating-value';
    ratingValue.textContent = trainer.rating.toFixed(1);
    
    const ratingCount = document.createElement('span');
    ratingCount.className = 'rating-count';
    ratingCount.textContent = `(${trainer.reviewCount} reviews)`;
    
    ratingSection.appendChild(stars);
    ratingSection.appendChild(ratingValue);
    ratingSection.appendChild(ratingCount);
    
    // เพิ่มส่วนต่างๆ ลงในการ์ด
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(ratingSection);
    
    // ตรวจสอบว่าผู้ใช้มีรีวิวหรือไม่
    if (trainer.userReview) {
        // ถ้ามีรีวิว แสดงรีวิวของผู้ใช้
        const userReview = document.createElement('div');
        userReview.className = 'user-review';
        
        const userReviewTitle = document.createElement('h4');
        userReviewTitle.textContent = 'Your Rating:';
        
        const userRating = document.createElement('div');
        userRating.className = 'user-rating';
        userRating.innerHTML = generateStars(trainer.userReview.rating);
        
        const userReviewText = document.createElement('div');
        userReviewText.className = 'user-review-text';
        userReviewText.textContent = trainer.userReview.text;
        
        const reviewActions = document.createElement('div');
        reviewActions.className = 'review-actions';
        reviewActions.innerHTML = `
            <a href="#" class="edit-review-btn" data-trainer-id="${trainer.id}">Edit Review</a>
        `;
        
        userReview.appendChild(userReviewTitle);
        userReview.appendChild(userRating);
        userReview.appendChild(userReviewText);
        userReview.appendChild(reviewActions);
        
        card.appendChild(userReview);
    } else {
        // ถ้าไม่มีรีวิว แสดงปุ่มให้คะแนน
        const rateButton = document.createElement('button');
        rateButton.className = 'rate-trainer-btn';
        rateButton.setAttribute('data-trainer-id', trainer.id);
        rateButton.textContent = 'Rate Trainer';
        
        card.appendChild(rateButton);
    }
    
    return card;
}

// ฟังก์ชันสร้างดาวสำหรับคะแนน
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // สร้างดาวเต็ม
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // สร้างดาวครึ่ง
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // สร้างดาวว่าง
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ฟังก์ชันตั้งค่าปุ่มให้คะแนน
function setupRatingButtons() {
    const rateButtons = document.querySelectorAll('.rate-trainer-btn');
    
    rateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trainerId = this.getAttribute('data-trainer-id');
            openReviewModal(trainerId, 'add');
        });
    });
}

// ฟังก์ชันตั้งค่าปุ่มแก้ไขรีวิว
function setupEditButtons() {
    const editButtons = document.querySelectorAll('.edit-review-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const trainerId = this.getAttribute('data-trainer-id');
            openReviewModal(trainerId, 'edit');
        });
    });
}

// ฟังก์ชันเปิด Modal สำหรับการให้คะแนนและรีวิว
function openReviewModal(trainerId, mode) {
    const modal = document.getElementById('review-modal');
    const modalTitle = document.getElementById('review-modal-title');
    const trainerIdInput = document.getElementById('trainer-id');
    const ratingInput = document.getElementById('rating');
    const reviewTextInput = document.getElementById('review-text');
    const stars = document.querySelectorAll('.star-rating i');
    
    // ตั้งค่า Modal ตามโหมด (เพิ่มหรือแก้ไข)
    if (mode === 'add') {
        modalTitle.textContent = 'Rate Trainer';
        trainerIdInput.value = trainerId;
        ratingInput.value = 0;
        reviewTextInput.value = '';
        
        // รีเซ็ตดาว
        stars.forEach(star => {
            star.classList.remove('active');
        });
    } else if (mode === 'edit') {
        modalTitle.textContent = 'Edit Review';
        trainerIdInput.value = trainerId;
        
        // ดึงข้อมูลรีวิวปัจจุบัน
        const trainer = mockTrainers.find(t => t.id === trainerId);
        if (trainer && trainer.userReview) {
            ratingInput.value = trainer.userReview.rating;
            reviewTextInput.value = trainer.userReview.text;
            
            // ตั้งค่าดาวตามคะแนนปัจจุบัน
            stars.forEach(star => {
                const rating = parseInt(star.getAttribute('data-rating'));
                if (rating <= trainer.userReview.rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    }
    
    // แสดง Modal
    modal.style.display = 'block';
}

// ฟังก์ชันตั้งค่า Modal สำหรับการให้คะแนนและรีวิว
function setupReviewModal() {
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('rating');
    const reviewForm = document.getElementById('review-form');
    const cancelButton = document.getElementById('cancel-review');
    
    // ตั้งค่าการคลิกดาว
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // อัพเดตสถานะดาว
            stars.forEach(s => {
                const r = parseInt(s.getAttribute('data-rating'));
                if (r <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // ตั้งค่าการส่งฟอร์ม
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trainerId = document.getElementById('trainer-id').value;
        const rating = parseFloat(document.getElementById('rating').value);
        const reviewText = document.getElementById('review-text').value;
        
        if (rating === 0) {
            showNotification('กรุณาให้คะแนน', 'error');
            return;
        }
        
        if (reviewText.trim() === '') {
            showNotification('กรุณาเขียนรีวิว', 'error');
            return;
        }
        
        // บันทึกรีวิว
        saveReview(trainerId, rating, reviewText);
        
        // ปิด Modal
        document.getElementById('review-modal').style.display = 'none';
    });
    
    // ตั้งค่าปุ่มยกเลิก
    cancelButton.addEventListener('click', function() {
        document.getElementById('review-modal').style.display = 'none';
    });
}

// ฟังก์ชันตั้งค่าปุ่มปิด Modal
function setupModalClose() {
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // ปิด Modal เมื่อคลิกนอกพื้นที่ Modal
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// ฟังก์ชันบันทึกรีวิว
async function saveReview(trainerId, rating, reviewText) {
    try {
        // จำลองการเรียก API
        // await API.saveReview(trainerId, rating, reviewText);
        
        // อัพเดต mock data
        const trainerIndex = mockTrainers.findIndex(t => t.id === trainerId);
        if (trainerIndex !== -1) {
            const trainer = mockTrainers[trainerIndex];
            
            // คำนวณคะแนนเฉลี่ยใหม่
            let newRating;
            if (trainer.userReview) {
                // ถ้ามีรีวิวอยู่แล้ว ให้อัพเดตคะแนนเฉลี่ย
                const oldRating = trainer.userReview.rating;
                const totalRating = trainer.rating * trainer.reviewCount;
                const newTotalRating = totalRating - oldRating + rating;
                newRating = newTotalRating / trainer.reviewCount;
            } else {
                // ถ้าไม่มีรีวิว ให้เพิ่มคะแนนใหม่
                const totalRating = trainer.rating * trainer.reviewCount;
                const newTotalRating = totalRating + rating;
                const newReviewCount = trainer.reviewCount + 1;
                newRating = newTotalRating / newReviewCount;
                mockTrainers[trainerIndex].reviewCount = newReviewCount;
            }
            
            // อัพเดตข้อมูล
            mockTrainers[trainerIndex].rating = newRating;
            mockTrainers[trainerIndex].userReview = {
                rating: rating,
                text: reviewText
            };
        }
        
        // โหลดข้อมูล trainer ใหม่
        loadTrainers();
        
        showNotification('บันทึกรีวิวสำเร็จ', 'success');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกรีวิว:', error);
        showNotification('ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

// ฟังก์ชันแสดงการโหลด
function showLoading(element) {
    if (!element) return;
    element.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
}

// ฟังก์ชันแสดงข้อความเมื่อไม่พบข้อมูล
function showNoData(element, message = "ไม่พบข้อมูล") {
    if (!element) return;
    element.innerHTML = `<div class="no-data">${message}</div>`;
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
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
    } else {
        // ถ้าไม่พบ element การแจ้งเตือน ให้สร้างใหม่
        const newNotification = document.createElement('div');
        newNotification.id = 'notification';
        newNotification.className = `notification ${type}`;
        newNotification.textContent = message;
        
        document.body.appendChild(newNotification);
        
        // แสดงการแจ้งเตือน
        setTimeout(() => {
            newNotification.classList.add('show');
        }, 10);
        
        // ซ่อนและลบการแจ้งเตือนหลังจาก 3 วินาที
        setTimeout(() => {
            newNotification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(newNotification);
            }, 300);
        }, 3000);
    }
}

// เพิ่ม Mock API สำหรับทีม Backend
if (typeof API === 'undefined') {
    window.API = {};
}

// Mock API สำหรับการดึงข้อมูล trainer
API.getTrainers = async function() {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // จำลองข้อมูล trainer
    return {
        data: mockTrainers
    };
};

// Mock API สำหรับการบันทึกรีวิว
API.saveReview = async function(trainerId, rating, reviewText) {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // จำลองการบันทึกรีวิว
    return {
        success: true,
        message: 'บันทึกรีวิวสำเร็จ'
    };
};