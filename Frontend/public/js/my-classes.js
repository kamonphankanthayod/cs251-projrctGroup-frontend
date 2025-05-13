document.addEventListener("DOMContentLoaded", () => {
  setupCancelButtons();
  loadUpcomingClasses();
});

// mock data fallback
const mockBookings = [
  {
    bookingId: 101,
    className: "Yoga for Beginners",
    trainerName: "Trainer A",
    schedule: "Monday 08:00 - 09:00",
    status: "Confirmed",
  },
  {
    bookingId: 102,
    className: "HIIT Cardio",
    trainerName: "Trainer B",
    schedule: "Wednesday 18:00 - 19:00",
    status: "Cancelled",
  },
];

async function loadUpcomingClasses() {
  const classesContainer = document.getElementById("upcoming-classes-list");

  const memberId = localStorage.getItem("memberId");
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
    renderClassList(classes, classesContainer);
  } catch (error) {
    console.warn("โหลดข้อมูลล้มเหลว ใช้ mock bookings แทน:", error);
    renderClassList(mockBookings, classesContainer);
  }
}

function renderClassList(classes, container) {
  if (classes && classes.length > 0) {
    container.innerHTML = "";
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
  const classItem = document.createElement("div");
  classItem.className = "class-item";
  classItem.dataset.id = classData.bookingId;

  const isCancelled = classData.status === "Cancelled";

  classItem.innerHTML = `
        <div class="class-header">
            <div class="class-title">${classData.className}</div>
            <div class="class-trainer">Trainer: ${classData.trainerName}</div>
            <div class="class-schedule">${classData.schedule}</div>
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
  const cancelButtons = document.querySelectorAll(".cancel-btn");

  cancelButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const bookingId = this.getAttribute("data-id");

      if (this.classList.contains("disabled")) return;

      if (confirm("คุณต้องการยกเลิกการลงทะเบียนคลาสนี้หรือไม่?")) {
        try {
          await fetch(`http://localhost:8080/booking/${bookingId}`, {
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
