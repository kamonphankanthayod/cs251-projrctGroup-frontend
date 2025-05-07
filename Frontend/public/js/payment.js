// ดึงค่าจาก query string
const params = new URLSearchParams(window.location.search);
const planName = params.get('PlanName') || 'Unknown';
const promoCode = params.get('PromotionCode') || null;

// Mock plans
const plans = {
  Gold: {
    MP_ID: 10001,
    Duration: 1,
    Price: 70.0,
    Description: "Everything in Basic+Group fitness classes+Nutrition consultation+Access to all locations"
  },
  Basic: {
    MP_ID: 10002,
    Duration: 1,
    Price: 50.0,
    Description: "Access to gym floor+Basic equipment usage+Locker room access+Free water station"
  },
  Platinum: {
    MP_ID: 10003,
    Duration: 1,
    Price: 100.0,
    Description: "Everything in Gold+Premium locker with amenities+Spa & recovery services+Priority class booking"
  }
};

// Mock promotions
const promotions = [
  {
    PromotionID: 20001,
    Code: "DISCOUNT10",
    DiscountType: "percentage",
    DiscountValue: 10.0,
    StartDate: "2025-01-01",
    EndDate: "2026-01-31",
    Status: "Active"
  },
  {
    PromotionID: 20002,
    Code: "SAVE25",
    DiscountType: "fixed",
    DiscountValue: 25.0,
    StartDate: "2025-02-01",
    EndDate: "2026-02-29",
    Status: "Active"
  },
  {
    PromotionID: 20003,
    Code: "NEWYEAR50",
    DiscountType: "percentage",
    DiscountValue: 50.0,
    StartDate: "2024-12-25",
    EndDate: "2026-01-05",
    Status: "Active"
  },
  {
    PromotionID: 20004,
    Code: "DISCOUNT20",
    DiscountType: "percentage",
    DiscountValue: 20.0,
    StartDate: "2025-01-25",
    EndDate: "2026-01-31",
    Status: "Active"
  }
];


const plan = plans[planName];
let discount = 0;

if (plan) {
  const basePrice = plan.Price;

  // ถ้ามีโค้ด
  if (promoCode) {
    const promo = promotions.find(p => p.Code === promoCode && p.Status === "Active");

    if (promo) {
      const today = new Date();
      const start = new Date(promo.StartDate);
      const end = new Date(promo.EndDate);

      if (today >= start && today <= end) {
        discount =
          promo.DiscountType === "percentage"
            ? basePrice * (promo.DiscountValue / 100)
            : promo.DiscountValue;
      }
    }
  }

  const finalPrice = Math.max(0, basePrice - discount);

  // 1. จำลองข้อมูลสมาชิก (กรณียังไม่มีระบบ login)
  const memberId = 10001;

  // 2. สร้างเลขที่ใบเสร็จ
  const generateReceipt = () => "REC" + Math.floor(100000 + Math.random() * 900000);
  const receiptNumber = generateReceipt();

  // 3. สร้าง Payment Record ใหม่ (mock)
  const newPayment = {
    PaymentID: 50000 + Math.floor(Math.random() * 1000),
    MemberID: memberId,
    PaymentMethod: "PromptPay",
    Amount: finalPrice,
    PaymentDate: new Date().toISOString().split("T")[0],
    PaymentStatus: "Pending",
    ReceiptNumber: receiptNumber
  };

  // (ไม่จำเป็น แต่เก็บไว้ใช้หน้า success ได้)
  localStorage.setItem("lastPayment", JSON.stringify(newPayment));

  // 4. แสดง Member ID , Amount และ Receipt Number ในหน้า
  const memberIdElem = document.getElementById("member-id");
  if (memberIdElem) memberIdElem.textContent = memberId;

  const amountElement = document.getElementById("qr-amount");
  if (amountElement) amountElement.textContent = `฿${finalPrice.toFixed(2)}`;

  const refCodeElement = document.getElementById("qr-ref");
  if (refCodeElement) refCodeElement.textContent = receiptNumber;


  // ใส่ข้อมูลลง HTML
  document.getElementById("plan-name").textContent = planName;
  document.getElementById("plan-price").innerHTML = `฿${basePrice}<span>/mo.</span>`;
  document.getElementById("subtotal").textContent = `฿${basePrice.toFixed(2)}`;
  document.getElementById("discount").textContent = `฿${discount.toFixed(2)}`;
  document.getElementById("total").textContent = `฿${finalPrice.toFixed(2)}`;

  const ul = document.getElementById("plan-features");
  ul.innerHTML = "";

  plan.Description.split("+").forEach(feature => {
    const li = document.createElement("li");
    li.innerHTML = `<span>✔</span> ${feature}`;
    ul.appendChild(li);
  });
}

// confirm button
const confirmBtn = document.getElementById("confirm-payment-btn");

if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    // โหลดข้อมูลที่เราสร้างไว้ก่อนหน้า
    const payment = JSON.parse(localStorage.getItem("lastPayment"));

    if (payment) {
      // ส่งผู้ใช้ไปหน้า success
      window.location.href = "payment-success-QR.html";
    }
  });
}
