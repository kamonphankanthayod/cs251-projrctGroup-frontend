document.addEventListener("DOMContentLoaded", () => {
    const classList = document.getElementById("classList");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");

    let allClasses = [];

    // ดึงข้อมูลจาก Backend จริง
    fetch("http://localhost:8080/class")
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

        const trainersHTML = cls.trainers?.map(t => `
            <li>
                <strong>${t.fullName}</strong> (${t.speciality}) – Rating: ${t.rating}
            </li>
        `).join("") || "<li>No trainers listed.</li>";

        card.innerHTML = `
            <div class="badge">${cls.category || "General"}</div>
            <h3>${cls.className || cls.title}</h3>
            <p><strong>Schedule:</strong> ${cls.schedule || "TBD"}</p>
            <p><strong>Capacity:</strong> ${cls.capacity}</p>
            <p><strong>Class Rating:</strong> ${cls.rating}</p>
            <p><strong>Trainers:</strong></p>
            <ul>${trainersHTML}</ul>
        `;
        classList.appendChild(card);
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
