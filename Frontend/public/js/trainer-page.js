document.addEventListener("DOMContentLoaded", () => {
  // โหลดข้อมูล trainer
  loadTrainers();

  // ตั้งค่า Modal สำหรับการให้คะแนนและรีวิว
  setupReviewModal();

  // ตั้งค่าปุ่มปิด Modal
  setupModalClose();
});

// ฟังก์ชันโหลดข้อมูล trainer
async function loadTrainers() {
  const trainersContainer = document.getElementById("trainers-container");
  if (!trainersContainer) return;

  try {
    showLoading(trainersContainer);

    // เรียก API จริง
    const response = await fetch("http://localhost:8080/trainer");
    const trainers = await response.json();

    if (Array.isArray(trainers) && trainers.length > 0) {
      trainersContainer.innerHTML = "";

      // แบ่ง trainer เป็นแถว แถวละ 3 คน
      for (let i = 0; i < trainers.length; i += 3) {
        const row = document.createElement("div");
        row.className = "trainer-row";

        // สร้าง trainer card สำหรับแต่ละคนในแถว
        for (let j = i; j < i + 3 && j < trainers.length; j++) {
          const trainer = trainers[j];

          const trainerCard = createTrainerCard({
            id: trainer.trainerId,
            name: trainer.trainerName,
            rating: trainer.averageRating,
            image: trainer.profilePicture || "/default-avatar.png",
          });

          row.appendChild(trainerCard);
        }

        trainersContainer.appendChild(row);
      }

      setupRatingButtons();
      setupEditButtons();
    } else {
      showNoData(trainersContainer, "ไม่พบข้อมูลเทรนเนอร์");
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลเทรนเนอร์:", error);
    showNoData(trainersContainer, "ไม่สามารถโหลดข้อมูลเทรนเนอร์ได้");
  }
}

// ฟังก์ชันสร้าง Trainer Card
function createTrainerCard(trainer) {
  const card = document.createElement("div");
  card.className = "trainer-card";
  card.setAttribute("data-trainer-id", trainer.id);

  // สร้างส่วนหัวของการ์ด
  const header = document.createElement("div");
  header.className = "trainer-header";

  const avatar = document.createElement("div");
  avatar.className = "trainer-avatar";
  const trainerImage = trainer.image || "/default-avatar.png";
  avatar.innerHTML = `<img src="${trainerImage}" alt="${trainer.name}">`;

  const info = document.createElement("div");
  info.className = "trainer-info";
  info.innerHTML = `
        <h3>${trainer.name}</h3>
        <p>${trainer.specialty || "No specialty provided"}</p>
    `;

  header.appendChild(avatar);
  header.appendChild(info);

  // สร้างส่วนคำอธิบาย
  const description = document.createElement("div");
  description.className = "trainer-description";
  description.textContent = trainer.description || "No description available.";

  // สร้างส่วนคะแนน
  const ratingSection = document.createElement("div");
  ratingSection.className = "trainer-rating";

  const stars = document.createElement("span");
  stars.className = "rating-stars";
  stars.innerHTML = generateStars(trainer.rating || 0);

  const ratingValue = document.createElement("span");
  ratingValue.className = "rating-value";
  const trainerRating = trainer.rating ? trainer.rating.toFixed(1) : "N/A";
  ratingValue.textContent = trainerRating;

  const ratingCount = document.createElement("span");
  ratingCount.className = "rating-count";
  const reviewCount = trainer.reviewCount
    ? `(${trainer.reviewCount} reviews)`
    : "(No reviews)";
  ratingCount.textContent = reviewCount;

  ratingSection.appendChild(stars);
  ratingSection.appendChild(ratingValue);
  ratingSection.appendChild(ratingCount);

  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(ratingSection);

  // ตรวจสอบว่าผู้ใช้มีรีวิวหรือไม่
  if (trainer.userReview) {
    const userReview = document.createElement("div");
    userReview.className = "user-review";

    const userReviewTitle = document.createElement("h4");
    userReviewTitle.textContent = "Your Rating:";

    const userRating = document.createElement("div");
    userRating.className = "user-rating";
    userRating.innerHTML = generateStars(trainer.userReview.rating || 0);

    const userReviewText = document.createElement("div");
    userReviewText.className = "user-review-text";
    userReviewText.textContent =
      trainer.userReview.text || "No review provided.";

    const reviewActions = document.createElement("div");
    reviewActions.className = "review-actions";
    reviewActions.innerHTML = `
            <a href="trainer.html" class="edit-review-btn" data-trainer-id="${trainer.id}">Edit Review</a>
        `;

    userReview.appendChild(userReviewTitle);
    userReview.appendChild(userRating);
    userReview.appendChild(userReviewText);
    userReview.appendChild(reviewActions);

    card.appendChild(userReview);
  } else {
    const rateButton = document.createElement("button");
    rateButton.className = "rate-trainer-btn";
    rateButton.setAttribute("data-trainer-id", trainer.id);
    rateButton.textContent = "Rate Trainer";

    card.appendChild(rateButton);
  }

  return card;
}

// ฟังก์ชันสร้างดาวสำหรับคะแนน
function generateStars(rating) {
  // ตรวจสอบค่า rating ให้เป็นตัวเลขที่ถูกต้อง
  const validRating = typeof rating === "number" && rating >= 0 ? rating : 0;

  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 >= 0.5;

  // ใช้ `Array.fill()` แทน `for-loop`
  const stars = [
    ...Array(fullStars).fill('<i class="fas fa-star"></i>'),
    ...(hasHalfStar ? ['<i class="fas fa-star-half-alt"></i>'] : []),
    ...Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(
      '<i class="far fa-star"></i>'
    ),
  ].join("");

  return stars;
}

// ฟังก์ชันตั้งค่าปุ่มให้คะแนน
function setupRatingButtons() {
  const rateButtons = document.querySelectorAll(".rate-trainer-btn");
  if (!rateButtons.length) return; // ตรวจสอบว่ามีปุ่มให้คะแนนก่อน

  rateButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (button.disabled) return; // ป้องกันการคลิกซ้ำ
      button.disabled = true;

      const trainerId = this.getAttribute("data-trainer-id");
      openReviewModal(trainerId, "add");

      setTimeout(() => {
        button.disabled = false; // เปิดการคลิกอีกครั้งหลัง 1 วินาที
      }, 1000);
    });
  });
}

// ฟังก์ชันตั้งค่าปุ่มแก้ไขรีวิว
function setupEditButtons() {
  const editButtons = document.querySelectorAll(".edit-review-btn");
  if (!editButtons.length) return; // ตรวจสอบว่ามีปุ่มแก้ไขก่อน

  editButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (button.disabled) return; // ป้องกันการคลิกซ้ำ
      button.disabled = true;

      const trainerId = this.getAttribute("data-trainer-id");
      openReviewModal(trainerId, "edit");

      setTimeout(() => {
        button.disabled = false; // เปิดการคลิกอีกครั้งหลัง 1 วินาที
      }, 1000);
    });
  });
}

// ฟังก์ชันเปิด Modal สำหรับการให้คะแนนและรีวิว
async function openReviewModal(trainerId, mode) {
  const modal = document.getElementById("review-modal");
  const modalTitle = document.getElementById("review-modal-title");
  const trainerIdInput = document.getElementById("trainer-id");
  const ratingInput = document.getElementById("rating");
  const reviewTextInput = document.getElementById("review-text");
  const stars = document.querySelectorAll(".star-rating i");

  // ตั้งค่า Modal ตามโหมด (เพิ่มหรือแก้ไข)
  if (mode === "add") {
    modalTitle.textContent = "Rate Trainer";
    trainerIdInput.value = trainerId;
    ratingInput.value = 0;
    reviewTextInput.value = "";

    // รีเซ็ตดาว
    stars.forEach((star) => {
      star.classList.remove("active");
    });
  } else if (mode === "edit") {
    modalTitle.textContent = "Edit Review";
    trainerIdInput.value = trainerId;

    try {
      // ดึงข้อมูลรีวิวจริงจาก API
      const response = await fetch(
        `http://localhost:8080/trainer/${trainerId}`
      );
      const trainer = await response.json();

      if (trainer?.userReview) {
        ratingInput.value = trainer.userReview.rating;
        reviewTextInput.value = trainer.userReview.text;

        // ตั้งค่าดาวตามคะแนนปัจจุบัน
        stars.forEach((star) => {
          const rating = parseFloat(star.getAttribute("data-rating"));
          if (rating <= trainer.userReview.rating) {
            star.classList.add("active");
          } else {
            star.classList.remove("active");
          }
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดรีวิว:", error);
    }
  }

  // แสดง Modal
  modal.style.display = "block";
}

// ฟังก์ชันตั้งค่า Modal สำหรับการให้คะแนนและรีวิว
function setupReviewModal() {
  const stars = document.querySelectorAll(".star-rating i");
  const ratingInput = document.getElementById("rating");
  const reviewForm = document.getElementById("review-form");
  const cancelButton = document.getElementById("cancel-review");

  if (!stars.length || !ratingInput || !reviewForm || !cancelButton) return; // ตรวจสอบว่ามีองค์ประกอบใน DOM ก่อน

  // ตั้งค่าการคลิกดาว
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = parseFloat(this.getAttribute("data-rating"));
      ratingInput.value = rating;

      // อัพเดตสถานะดาว
      stars.forEach((s) => {
        const r = parseFloat(s.getAttribute("data-rating"));
        if (r <= rating) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // ตั้งค่าการส่งฟอร์ม
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const trainerId = document.getElementById("trainer-id").value;
    const rating = parseFloat(document.getElementById("rating").value);
    const reviewText = document.getElementById("review-text").value.trim();

    if (rating === 0) {
      showNotification("กรุณาให้คะแนน", "error");
      return;
    }

    if (reviewText === "") {
      showNotification("กรุณาเขียนรีวิว", "error");
      return;
    }

    // บันทึกรีวิว
    saveReview(trainerId, rating, reviewText);

    // ปิด Modal
    document.getElementById("review-modal").style.display = "none";
  });

  // ตั้งค่าปุ่มยกเลิก
  cancelButton.addEventListener("click", function () {
    document.getElementById("review-modal").style.display = "none";
  });
}

// ฟังก์ชันตั้งค่าปุ่มปิด Modal
function setupModalClose() {
  const closeButtons = document.querySelectorAll(".close-modal");
  if (!closeButtons.length) return; // ตรวจสอบว่ามีปุ่มก่อนใช้งาน

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  // ปิด Modal เมื่อคลิกนอกพื้นที่ Modal
  window.addEventListener("click", function (e) {
    const modal = e.target.closest(".modal");
    if (modal) {
      modal.style.display = "none";
    }
  });
}

// ฟังก์ชันบันทึกรีวิว
async function saveReview(trainerId, rating, reviewText) {
  try {
    const response = await fetch("http://localhost:8080/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId, rating, reviewText }),
    });

    const result = await response.json();

    if (result.success) {
      loadTrainers();
      showNotification("บันทึกรีวิวสำเร็จ", "success");
    } else {
      showNotification("ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่อีกครั้ง", "error");
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกรีวิว:", error);
    showNotification("ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่อีกครั้ง", "error");
  }
}

// ฟังก์ชันแสดงการโหลด
function showLoading(element) {
  if (!(element instanceof HTMLElement)) return;

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading";
  loadingDiv.textContent = "กำลังโหลดข้อมูล...";

  element.appendChild(loadingDiv);
}

// ฟังก์ชันแสดงข้อความเมื่อไม่พบข้อมูล
function showNoData(element, message = "ไม่พบข้อมูล") {
  if (!(element instanceof HTMLElement)) return;

  element.innerHTML = `<div class="no-data">${message}</div>`;
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  if (notification && notificationMessage) {
    notificationMessage.textContent = message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    notification.className = `notification ${type}`;

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  } else {
    const newNotification = document.createElement("div");
    newNotification.id = "notification";
    newNotification.className = `notification ${type}`;
    newNotification.textContent = message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    document.body.appendChild(newNotification);

    setTimeout(() => {
      newNotification.classList.add("show");
    }, 10);

    setTimeout(() => {
      newNotification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(newNotification);
      }, 300);
    }, 3000);
  }
}

// เชื่อมต่อ API จริง
window.API = {};

// API สำหรับการดึงข้อมูล trainer
API.getTrainers = async function () {
  try {
    const response = await fetch("http://localhost:8080/trainer");
    return await response.json();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลเทรนเนอร์:", error);
    return { data: [] };
  }
};

// API สำหรับการบันทึกรีวิว
API.saveReview = async function (trainerId, rating, reviewText) {
  try {
    const response = await fetch("http://localhost:8080/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId, rating, reviewText }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกรีวิว:", error);
    return {
      success: false,
      message: "ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
};
