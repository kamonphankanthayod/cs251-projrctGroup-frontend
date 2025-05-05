document.addEventListener("DOMContentLoaded", () => {
    const classList = document.getElementById("classList");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");

    let allClasses = [];

    fetch("https://your-backend.com/api/classes") // Backend Change
        .then(response => response.json())
        .then(data => {
            allClasses = data;
            renderClasses(allClasses);
        })
        .catch(() => {
            // mock data (ถ้า backend พังหรือยังไม่มีใช้ mock นี้ไปก่อน)
            allClasses = [
                { title: "Power Lifting", description: "Build strength and power with squats, bench press, and deadlifts.", instructor: "Alex Thompson", duration: 30, category: "HIIT" },
                { title: "Yoga Flow", description: "Relax and stretch in our guided yoga sessions.", instructor: "Linda Wu", duration: 45, category: "Yoga" },
                { title: "Cardio Burn", description: "High intensity cardio class to burn fat fast.", instructor: "Mike Jordan", duration: 40, category: "Cardio" },
                { title: "Strength Training", description: "Build muscles with expert strength training guidance.", instructor: "Sarah Lee", duration: 50, category: "Strength" }
            ];
            renderClasses(allClasses);
        });

    // Render class cards
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
                <a href="#" class="book-btn">Book Now</a>
            `;
            classList.appendChild(card);
        });
    }

    // Search filter
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = allClasses.filter(cls =>
            cls.title.toLowerCase().includes(keyword) ||
            cls.description.toLowerCase().includes(keyword) ||
            cls.instructor.toLowerCase().includes(keyword)
        );
        renderClasses(filtered);
    });

    // Category filter
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
