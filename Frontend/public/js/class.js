document.addEventListener("DOMContentLoaded", () => {
  const classList = document.getElementById("classList");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filters button");

  let allClasses = [];

  // ดึงข้อมูลคลาสจาก API จริง
  fetch("http://localhost:8080/class")
    .then((response) => response.json())
    .then((data) => {
      allClasses = data;
      renderClasses(allClasses);
    })
    .catch((error) => {
      console.error("Error fetching class data", error);
      classList.innerHTML =
        "<p>Failed to load classes. Please try again later.</p>";
    });

  // ฟังก์ชันแสดงข้อมูลคลาส
  function renderClasses(classes) {
    classList.innerHTML = "";
    if (classes.length === 0) {
      classList.innerHTML = "<p>No classes found.</p>";
      return;
    }

    classes.forEach((cls) => {
      const card = document.createElement("div");
      card.className = "class-card";
      card.innerHTML = `
                <h3>${cls.className}</h3>
                <p><strong>Schedule:</strong> ${cls.schedule}</p>
                <p><strong>Capacity:</strong> ${cls.capacity} คน</p>
                <p><strong>Rating:</strong> ⭐ ${cls.rating}</p>
                <button class="book-btn" data-id="${cls.classId}" data-name="${cls.className}">Join Class</button>
            `;
      classList.appendChild(card);
    });

    // ตั้งค่าให้ปุ่ม Join Class เชื่อม API ลงทะเบียน
    const bookButtons = document.querySelectorAll(".book-btn");
    bookButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
          alert("กรุณาเข้าสู่ระบบก่อนจองคลาส!");
          return;
        }

        const classId = button.getAttribute("data-id");
        try {
          const response = await fetch("http://localhost:8080/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId, classId }),
          });
          const result = await response.json();

          if (result.success) {
            alert("ลงทะเบียนเข้าคลาสเรียบร้อย!");
          } else {
            alert("ไม่สามารถลงทะเบียนคลาสได้ กรุณาลองใหม่");
          }
        } catch (error) {
          console.error("Error booking class:", error);
        }
      });
    });
  }

  // ฟังก์ชันค้นหาคลาส
  async function searchClasses(query) {
    try {
      const response = await fetch(
        `http://localhost:8080/class/search?query=${query}`
      );
      const classes = await response.json();
      renderClasses(classes);
    } catch (error) {
      console.error("Error searching class", error);
    }
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      renderClasses(allClasses);
      return;
    }
    searchClasses(keyword);
  });

  // ฟังก์ชันกรองคลาสตามประเภท (ใช้ `schedule` แทน `category`)
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const schedule = button.getAttribute("data-filter");
      if (schedule === "All") {
        renderClasses(allClasses);
      } else {
        const filtered = allClasses.filter((cls) =>
          cls.schedule.includes(schedule)
        );
        renderClasses(filtered);
      }
    });
  });
});
