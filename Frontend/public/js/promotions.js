/*const promotionstest = [
    {
        promotionId: 20001,
        code: "DISCOUNT10",
        discountType: "Percentage",
        discountValue: 10.0,
        startDate: "2025-01-01",
        endDate: "2026-01-31",
        status: "Active"
    },
    {
        promotionId: 20002,
        code: "SAVE25",
        discountType: "Fixed Amount",
        discountValue: 25.0,
        startDate: "2025-02-01",
        endDate: "2026-02-29",
        status: "Active"
    },
    {
        promotionId: 20003,
        code: "NEWYEAR50",
        discountType: "Percentage",
        discountValue: 50.0,
        startDate: "2024-12-25",
        endDate: "2026-01-05",
        status: "Active"
    },
    {
        promotionId: 20004,
        code: "DISCOUNT20",
        discountType: "Percentage",
        discountValue: 20.0,
        startDate: "2025-01-25",
        endDate: "2026-01-31",
        status: "Active"
    }
  ];*/

let promotions = [];
window.onload = async function () {
    const header = {
        "Content-Type": "application/json"
    };
    url = "http://localhost:8080/promotion/active"; 
    response = await fetch(url, {
        method: "GET",
        headers: header
    });
    console.log(response);
    data = await response.json();
    a=1;
    for(const i of data){
        if(a){
            a=0
        }
        else{
            promotions.push(i);
            console.log(i)
        }
    }
    const container = document.getElementById("promo-container");

    // สร้าง DOM ตามโปรโมชั่น
    promotions.forEach(promo => {
    // ข้ามโปรโมชั่นที่ไม่ active
        if (promo.status !== "Active") return;

        const div = document.createElement("div");
        div.className = "promo-plan light";

        const label =
            promo.discountType === "Percentage"
                ? `${promo.discountValue}% OFF`
                : `Save ฿${promo.discountValue}`;

        div.innerHTML = `
            <h3>${promo.code}</h3>
            <p class="price">${label}</p>
            <ul>
                <li>Start: ${promo.startDate}</li>
                <li>End: ${promo.endDate}</li>
            </ul>
            <form action="payment-QR.html" method="get">
                <input type="hidden" name="PromotionCode" value="${promo.code}" />
                <input type="hidden" name="PlanName" value="Gold" />
            <button class="button button-outline" type="submit">Get started</button>
            </form>
        `;

        container.appendChild(div);
    });
}

