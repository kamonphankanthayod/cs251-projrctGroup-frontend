document.addEventListener("DOMContentLoaded", () => {
  setupCancelButtons();
  loadUpcomingClasses();
});

// Mock data fallback
const mockBookings = [
  {
    bookingId: 101,
    classId: 1,
    className: "Yoga for Beginners",
    trainerName: "Trainer A",
    bookingDate: "Monday 08:00 - 09:00",
    status: "Confirmed",
  },
  {
    bookingId: 102,
    classId: 2,
    className: "HIIT Cardio",
    trainerName: "Trainer B",
    bookingDate: "Wednesday 18:00 - 19:00",
    status: "Cancelled",
  },
];

// ✅ Set `memberId` (Fallback: 1 if not found in `localStorage`)
const memberId = localStorage.getItem("memberId") || 1;

async function loadUpcomingClasses() {
  const classesContainer = document.getElementById("upcoming-classes-list");

  if (!memberId) {
    console.error("Member not logged in. Redirecting to login page...");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/booking/memberId/${memberId}`
    );
    if (!response.ok) throw new Error("API failed");

    const classes = await response.json();
    console.log("API response:", classes); // ✅ Debugging log to check received data

    if (!classes || classes.length === 0) throw new Error("No bookings found");

    renderClassList(classes, classesContainer);
  } catch (error) {
    console.warn("โหลดข้อมูลล้มเหลว ใช้ mock bookings แทน:", error);
    renderClassList(mockBookings, classesContainer);
  }
}

function renderClassList(classes, container) {
  container.innerHTML = "";

  if (classes.length > 0) {
    classes.forEach((classItem) => {
      const classElement = createClassElement(classItem);
      container.appendChild(classElement);
    });
    setupCancelButtons();
  } else {
    container.innerHTML =
      "<div class='no-data'>คุณยังไม่มีคลาสที่ลงทะเบียน</div>";
  }
}

function createClassElement(classData) {
  console.log("Rendering class:", classData); // ✅ Debugging step

  const classItem = document.createElement("div");
  classItem.className = "class-item";
  classItem.dataset.id = classData.bookingId;

  const isCancelled = classData.status === "Cancelled";

  classItem.innerHTML = `
        <div class="class-header">
            <div class="class-title"><strong>Class name:</strong> ${
              classData.className
            }</div>
            <div class="class-schedule"><strong>Time:</strong> ${
              classData.bookingDate
            }</div>
            <div class="class-status"><strong>Status:</strong> ${
              classData.status
            }</div>
        </div>
        <button class="cancel-btn ${isCancelled ? "disabled" : ""}" data-id="${
    classData.bookingId
  }" ${isCancelled ? "disabled" : ""}>
            ${isCancelled ? "Cancelled" : "✕ Cancel"}
        </button>
    `;

  return classItem;
}

function setupCancelButtons() {
  document.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const bookingId = this.getAttribute("data-id");

      if (this.classList.contains("disabled")) return;

      if (confirm("คุณต้องการยกเลิกการลงทะเบียนคลาสนี้หรือไม่?")) {
        try {
          await fetch(`http://localhost:8080/booking/${bookingId}`, {
            // ✅ Updated API path
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Cancelled" }),
          });

          this.textContent = "Cancelled";
          this.disabled = true;
          this.classList.add("disabled");
          showNotification("ยกเลิกการลงทะเบียนคลาสเรียบร้อยแล้ว");
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการยกเลิกคลาส:", error);
          showNotification(
            "ไม่สามารถยกเลิกการลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
            "error"
          );
        }
      }
    });
  });
}

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  notificationMessage.textContent = message;
  notification.className = `notification ${type}`;

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
