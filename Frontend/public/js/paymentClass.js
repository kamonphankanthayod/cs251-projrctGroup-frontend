document.addEventListener("DOMContentLoaded", () => {
    const selectedClassId = localStorage.getItem('selectedClassId');

    if (!selectedClassId) {
        console.error("No selected class ID found.");
        document.getElementById('plan-name').innerText = "No Class Selected";
        return;
    }

    fetch(`https://your-backend.com/api/class-detail/${selectedClassId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // ตั้งค่าข้อมูลที่ดึงมา
            document.getElementById('plan-name').innerText = data.name;
            document.getElementById('plan-price').innerHTML = `฿${data.price}<span>/mo.</span>`;
            document.getElementById('subtotal').innerText = `฿${data.price}`;
            document.getElementById('total').innerText = `฿${data.price}`;

            const featuresList = document.getElementById('plan-features');
            featuresList.innerHTML = "";

            if (data.features && data.features.length > 0) {
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>✔</span> ${feature}`;
                    featuresList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.innerText = "No feature listed.";
                featuresList.appendChild(li);
            }
        })
        .catch(error => {
            console.error("Error fetching class detail:", error);
            document.getElementById('plan-name').innerText = "Failed to load class";
            document.getElementById('plan-price').innerText = "-";
            document.getElementById('subtotal').innerText = "-";
            document.getElementById('total').innerText = "-";
        });
});
