document.addEventListener("DOMContentLoaded", () => {
  const classList = document.getElementById("classList");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filters button");

  let allClasses = [];

  const mockClasses = [
    {
      classId: 1,
      className: "Yoga for Beginners",
      schedule: "Monday 08:00 - 09:00",
      capacity: 20,
      rating: 4.5,
    },
    {
      classId: 2,
      className: "HIIT Cardio",
      schedule: "Wednesday 18:00 - 19:00",
      capacity: 15,
      rating: 4.8,
    },
    {
      classId: 3,
      className: "Zumba Dance",
      schedule: "Friday 17:00 - 18:00",
      capacity: 25,
      rating: 4.6,
    },
  ];

  // ดึงข้อมูลคลาสจาก API จริง ถ้าไม่สำเร็จให้ใช้ mock
  fetch("http://localhost:8080/class")
    .then((response) => {
      if (!response.ok) throw new Error("API failed");
      return response.json();
    })
    .then((data) => {
      allClasses = data;
      renderClasses(allClasses);
    })
    .catch((error) => {
      console.warn("Error fetching class data, fallback to mock:", error);
      allClasses = mockClasses;
      renderClasses(allClasses);
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

    // ตั้งค่าปุ่ม Join Class
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
      console.warn("Search API failed, fallback to local filter");
      const filtered = allClasses.filter((cls) =>
        cls.className.toLowerCase().includes(query.toLowerCase())
      );
      renderClasses(filtered);
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

  // ฟังก์ชันกรองคลาสตาม schedule
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
