document.addEventListener("DOMContentLoaded", () => {
  loadTrainerReviews(); // ✅ ใช้ /trainer/review
  setupReviewModal();
  setupModalClose();
});

    async function loadTrainerReviews() {
      const trainersContainer = document.getElementById("trainers-container");
      if (!trainersContainer) return;

      try {
        showLoading(trainersContainer);

        const response = await fetch("http://localhost:8080/trainer/review");
        if (!response.ok) {
          console.error("❌ API Error:", response.status);
          return;
        }

        const trainerReviews = await response.json();
        console.log("🔍 API Response Data:", trainerReviews); // ✅ Debug API response

        trainersContainer.innerHTML = "";

        trainerReviews.forEach((trainer) => {
          console.log("✅ Checking Trainer Name:", trainer.trainerName); // ✅ Ensure trainerName exists
          const card = createTrainerCard(trainer);
          trainersContainer.appendChild(card);
        });

        setupRatingButtons();
        setupEditButtons();
      } catch (error) {
        console.error("❌ Error loading trainer reviews:", error);
        trainersContainer.innerHTML = "<p>ไม่สามารถโหลดข้อมูลได้</p>";
      }
    }

let trainerCounter = 1;
function createTrainerCard(trainerReview) {
  const card = document.createElement("div");
  card.className = "trainer-card";
  card.setAttribute("data-trainer-id", trainerReview.trainerId);

  const trainerName = trainerReview.trainerName?.trim() || `Review ${trainerCounter++}`; // ✅ Ensures trainer name is valid
  const imageSrc =
    trainerReview.image && trainerReview.image.trim() !== ""
      ? trainerReview.image
      : "image/placeholder.png"; // ✅ Proper image fallback
  const rating = trainerReview.rate ? trainerReview.rate.toFixed(1) : "N/A"; // ✅ Handles missing rating values
  const reviewText = trainerReview.review?.trim() || "ยังไม่มีรีวิว"; // ✅ Prevents undefined review display

  card.innerHTML = `
    <div class="trainer-header">
      <div class="trainer-avatar">
        <img src="${imageSrc}" alt="${trainerName}">
      </div>
      <div class="trainer-info">
        <h3>${trainerName}</h3>
      </div>
    </div>
    <button class="rate-trainer-btn" data-trainer-id="${trainerReview.trainerId}">Rate Trainer</button>
    <div class="trainer-reviews">
      <h4>Reviews</h4>
      <div class="review-item">
        <strong>⭐ ${rating}</strong>: ${reviewText}
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
      openReviewModal(trainerId, "add");
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

function openReviewModal(trainerId, mode) {
  const modal = document.getElementById("review-modal");
  document.getElementById("review-modal-title").textContent =
    mode === "edit" ? "Edit Review" : "Rate Trainer";
  document.getElementById("trainer-id").value = trainerId;
  document.getElementById("rating").value = 0;
  document.getElementById("review-text").value = "";

  document
    .querySelectorAll(".star-rating i")
    .forEach((star) => star.classList.remove("active"));

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

  console.log("📡 Sending Review Payload:", JSON.stringify(payload));

  try {
    const response = await fetch("http://localhost:8080/trainer/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Review Saved:", result);
      loadTrainerReviews(); // ✅ โหลดใหม่
      showNotification("บันทึกรีวิวสำเร็จ", "success");
    } else {
      alert("ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่");
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
