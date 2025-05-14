window.onload = async function () {
  const payment = JSON.parse(localStorage.getItem("lastPayment"));
  console.log("ข้อมูลจากหน้าเดิม:", payment);

  document.getElementById("net-price").textContent = payment.amount;

  // เรียกฟังก์ชันเช็คสถานะซ้ำ ๆ ทุก 5 วินาที
  setInterval(async () => {
    const header = {
      "Content-Type": "application/json"
    };
    const url = "http://localhost:8080/payment/get-by-member/" + payment.memberId;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: header
      });
      const data = await response.json();

      let status = '';
      for (const i of data) {
        if (payment.paymentId === i.paymentId) {
          status = i.paymentStatus;
        }
      }

      console.log("สถานะล่าสุด:", status);
      document.getElementById("status-text").textContent = status;

    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err);
    }

  }, 1000); // ← เช็คทุก 5000 มิลลิวินาที (5 วินาที)
};
