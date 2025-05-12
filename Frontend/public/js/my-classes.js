document.addEventListener("DOMContentLoaded", () => {
  setupCancelButtons();
  loadUpcomingClasses();
});

// โหลดข้อมูลคลาสที่ลงทะเบียน
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
    const classes = await response.json();

    if (classes && classes.length > 0) {
      classesContainer.innerHTML = "";

      classes.forEach((classItem) => {
        const classElement = createClassElement(classItem);
        classesContainer.appendChild(classElement);
      });

      setupCancelButtons();
    } else {
      classesContainer.innerHTML =
        "<div class='no-data'>คุณยังไม่มีคลาสที่ลงทะเบียน</div>";
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดคลาส:", error);
    showNotification(
      "ไม่สามารถโหลดข้อมูลคลาสได้ กรุณาลองใหม่อีกครั้ง",
      "error"
    );
  }
}

// สร้าง UI สำหรับคลาส
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

// ตั้งค่าปุ่มยกเลิกคลาส (ใช้ `PUT`)
function setupCancelButtons() {
  const cancelButtons = document.querySelectorAll(".cancel-btn");

  cancelButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const bookingId = this.getAttribute("data-id");

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

// แสดงการแจ้งเตือน
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
