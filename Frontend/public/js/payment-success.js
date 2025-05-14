window.onload = async function () {
  const payment = JSON.parse(localStorage.getItem("lastPayment"));
  console.log("ข้อมูลจากหน้าเดิม:", payment);

  document.getElementById("net-price").textContent = payment.amount;

  const header = {
    "Content-Type": "application/json"
  };

  const intervalId = setInterval(async () => {
    let url = "http://localhost:8080/payment/get-by-member/" + payment.memberId;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: header
      });
      let data = await response.json();

      let status = '';
      for (const i of data) {
        if (payment.paymentId === i.paymentId) {
          status = i.paymentStatus;
        }
      }

      console.log("สถานะล่าสุด:", status);
      document.getElementById("status-text").textContent = status;

      if (status === 'Success') {
        clearInterval(intervalId); // ✅ หยุดการวน loop

        // ดึงข้อมูลแผน
        url = "http://localhost:8080/membership";
        response = await fetch(url, {
          method: "GET",
          headers: header
        });
        let plan = await response.json();
        console.log(plan);

        let planId = 0;
        for (const i of plan) {
          if (payment.planName == i.planName) {
            planId = i.id;
          }
        }

        // อัปเดตสถานะสมาชิก
        url = "http://localhost:8080/member/update-membership/" + payment.memberId;
        const body = JSON.stringify({
          "planId": planId
        });

        response = await fetch(url, {
          method: "PUT",
          headers: header,
          body: body
        });
        data = await response.json();
        console.log(data);
      }

    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err);
    }

  }, 1000); // เช็คทุก 1 วินาที
};
