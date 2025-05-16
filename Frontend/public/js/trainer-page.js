document.addEventListener("DOMContentLoaded", () => {
  loadTrainerReviews(); // ✅ ใช้ /trainer/review
  setupReviewModal();
  setupModalClose();
});

// โหลดรายชื่อเทรนเนอร์ทั้งหมด
async function loadTrainerReviews() {
  const trainersContainer = document.getElementById("trainers-container");
  trainersContainer.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';

  try {
    const memberId = localStorage.getItem("memberId");

    // โหลดเทรนเนอร์ทั้งหมด
    const trainerRes = await fetch("http://localhost:8080/trainer");
    const trainers = await trainerRes.json();

    // โหลดรีวิวเฉพาะของสมาชิก (เราคนเดียว)
    const reviewRes = await fetch(`http://localhost:8080/trainer/review/memberId/${memberId}`);
    const myReviews = await reviewRes.json();

    trainersContainer.innerHTML = "";

    trainers.forEach((trainer) => {
      const myReview = myReviews.find(r => r.trainerId === trainer.id);
      const card = createTrainerCard(trainer, myReview);
      trainersContainer.appendChild(card);
    });

    setupRatingButtons();
  } catch (error) {
    console.error("❌ Error loading trainers:", error);
    trainersContainer.innerHTML = "<p>ไม่สามารถโหลดรายชื่อเทรนเนอร์ได้</p>";
  }
}

// สร้าง Card เทรนเนอร์พร้อมปุ่มให้คะแนน
function createTrainerCard(trainer, myReview) {
  const card = document.createElement("div");
  card.className = "trainer-card";
  card.setAttribute("data-trainer-id", trainer.id);

  const trainerName = trainer.fullName?.trim() || "ไม่ทราบชื่อ";
  const imageSrc = trainer.image?.trim() || "image/placeholder.png";
  const myRating = myReview?.rate || null;
  const myReviewText = myReview?.review || null;

  card.innerHTML = `
    <div class="trainer-header">
      <div class="trainer-avatar">
        <img src="${imageSrc}" alt="${trainerName}">
      </div>
      <div class="trainer-info">
        <h3>${trainerName}</h3>
        ${myRating ? `<p>⭐ คะแนนของคุณ: ${myRating} <br> 💬 ${myReviewText}</p>` : ""}
      </div>
    </div>
    <div class="trainer-reviews">
      <div class="review-action">
        <button class="btn btn-outline rate-trainer-btn"
          data-trainer-id="${trainer.id}"
          data-trainer-name="${trainerName}"
          ${myReview ? `data-review-id="${myReview.id}" data-rating="${myReview.rate}" data-review-text="${myReview.review}"` : ""}>
          ${myReview ? "แก้ไขรีวิว" : "ให้คะแนนเทรนเนอร์"}
        </button>
      </div>
    </div>
  `;

  return card;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    '<i class="fas fa-star"></i>'.repeat(fullStars) +
    (hasHalf ? '<i class="fas fa-star-half-alt"></i>' : "") +
    '<i class="far fa-star"></i>'.repeat(emptyStars)
  );
}

function setupRatingButtons() {
  document.querySelectorAll(".rate-trainer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const trainerId = btn.getAttribute("data-trainer-id");
      const trainerName = btn.getAttribute("data-trainer-name");
      const reviewId = btn.getAttribute("data-review-id") || null;
      const rating = btn.getAttribute("data-rating") || 0;
      const reviewText = btn.getAttribute("data-review-text") || "";

      openReviewModal(trainerId, trainerName, reviewId, rating, reviewText);
    });
  });
}

function setupEditButtons() {
  document.querySelectorAll(".edit-review-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const trainerId = btn.getAttribute("data-trainer-id");
      openReviewModal(trainerId, "edit");
    });
  });
}

function openReviewModal(trainerId, trainerName, reviewId, rating = 0, reviewText = "") {
  const modal = document.getElementById("review-modal");
  document.getElementById("review-modal-title").textContent = reviewId ? `แก้ไขรีวิว: ${trainerName}` : `ให้คะแนน: ${trainerName}`;

  document.getElementById("trainer-id").value = trainerId;
  document.getElementById("rating").value = rating;
  document.getElementById("review-text").value = reviewText;
  document.getElementById("review-id").value = reviewId || "";

  document.querySelectorAll(".star-rating i").forEach((star) => {
    const starRating = parseInt(star.getAttribute("data-rating"));
    star.classList.toggle("active", starRating <= rating);
  });

  modal.style.display = "block";
}

function setupReviewModal() {
  const stars = document.querySelectorAll(".star-rating i");
  const ratingInput = document.getElementById("rating");
  const reviewForm = document.getElementById("review-form");
  const cancelButton = document.getElementById("cancel-review");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.getAttribute("data-rating"));
      ratingInput.value = rating;

      stars.forEach((s) => {
        const r = parseInt(s.getAttribute("data-rating"));
        s.classList.toggle("active", r <= rating);
      });
    });
  });

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const trainerId = document.getElementById("trainer-id").value;
    const rating = parseFloat(document.getElementById("rating").value);
    const reviewText = document.getElementById("review-text").value;
    const memberId = localStorage.getItem("memberId");

    if (!memberId) {
      showNotification("กรุณาเข้าสู่ระบบก่อนรีวิว", "error");
      return;
    }

    if (rating === 0 || reviewText.trim() === "") {
      showNotification("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }

    await saveReview(trainerId, rating, reviewText, memberId);
    document.getElementById("review-modal").style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    document.getElementById("review-modal").style.display = "none";
  });
}

function setupModalClose() {
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });
}

async function saveReview(trainerId, rating, reviewText, memberId) {
  const payload = {
    trainerId,
    memberId,
    rate: rating,
    review: reviewText,
  };

  const reviewId = document.getElementById("review-id").value;

  const url = reviewId
    ? `http://localhost:8080/trainer/review/${reviewId}`
    : `http://localhost:8080/trainer/review`;

  const method = reviewId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showNotification("บันทึกรีวิวสำเร็จ", "success");
      loadTrainerReviews(); // โหลดใหม่
    } else {
      throw new Error("ไม่สามารถบันทึกรีวิวได้");
    }
  } catch (error) {
    console.error("❌ Error saving review:", error);
    showNotification("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
  }
}

function showLoading(element) {
  element.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
}

function showNotification(message, type) {
  alert(message); // ❗เปลี่ยนเป็น toast ได้ในภายหลัง
}
