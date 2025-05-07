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
  

// ดึง container
const container = document.getElementById("promo-container");

// สร้าง DOM ตามโปรโมชั่น
promotions.forEach(promo => {
    // ข้ามโปรโมชั่นที่ไม่ active
    if (promo.Status !== "Active") return;

    const div = document.createElement("div");
    div.className = "promo-plan light";

    const label =
        promo.DiscountType === "percentage"
            ? `${promo.DiscountValue}% OFF`
            : `Save ฿${promo.DiscountValue}`;

    div.innerHTML = `
        <h3>${promo.Code}</h3>
        <p class="price">${label}</p>
        <ul>
            <li>Start: ${promo.StartDate}</li>
            <li>End: ${promo.EndDate}</li>
        </ul>
        <form action="payment-QR.html" method="get">
            <input type="hidden" name="PromotionCode" value="${promo.Code}" />
            <input type="hidden" name="PlanName" value="Gold" />
        <button class="button button-outline" type="submit">Get started</button>
        </form>
    `;

    container.appendChild(div);
});
