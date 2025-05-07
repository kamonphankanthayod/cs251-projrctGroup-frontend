document.addEventListener("DOMContentLoaded", () => {
    const classList = document.getElementById("classList");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");

    let allClasses = [];

    // ดึงข้อมูลจาก Backend จริง
    fetch("https://your-backend.com/api/classes")
        .then(response => response.json())
        .then(data => {
            allClasses = data;
            renderClasses(allClasses);
        })
        .catch((error) => {
            console.error("Error fetching class data", error);
            classList.innerHTML = "<p>Failed to load classes. Please try again later.</p>";
        });

    // ฟังก์ชันแสดงผล
    function renderClasses(classes) {
        classList.innerHTML = "";
        if (classes.length === 0) {
            classList.innerHTML = "<p>No classes found.</p>";
            return;
        }

        classes.forEach(cls => {
            const card = document.createElement("div");
            card.className = "class-card";
            card.innerHTML = `
                <div class="badge">${cls.category}</div>
                <h3>${cls.title}</h3>
                <p>${cls.description}</p>
                <p><strong>Instructor:</strong> ${cls.instructor}</p>
                <p><strong>Duration:</strong> ${cls.duration} min</p>
                <button class="book-btn" data-id="${cls.id}" data-name="${cls.title}">Book Now</button>
            `;
            classList.appendChild(card);
        });

        // หลัง render เสร็จต้องผูก event ให้ปุ่ม Book ใหม่ด้วย
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                const classId = button.getAttribute('data-id');
                localStorage.setItem('selectedClassId', classId);
                window.location.href = "payment.html";
            });
        });
    }

    // Search
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = allClasses.filter(cls =>
            cls.title.toLowerCase().includes(keyword) ||
            cls.description.toLowerCase().includes(keyword) ||
            cls.instructor.toLowerCase().includes(keyword)
        );
        renderClasses(filtered);
    });

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-filter");
            if (category === "All") {
                renderClasses(allClasses);
            } else {
                const filtered = allClasses.filter(cls => cls.category === category);
                renderClasses(filtered);
            }
        });
    });
});
