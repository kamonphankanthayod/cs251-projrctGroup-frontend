// ดึงค่าจาก query string
const params = new URLSearchParams(window.location.search);
const planName = params.get('PlanName') || 'Unknown';
const promoCode = params.get('PromotionCode') || '0';
const id = localStorage.getItem("memberId");
console.log(planName,promoCode,id);

let promotions = [];
window.onload = async function () {
  paymentdata = await savepayment();
  console.log(paymentdata)

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
  a=1
  for(const i of data){
        if(a){
            a=0
        }
        else{
            promotions.push(i);
            console.log(i)
        }
    }

  
  url = "http://localhost:8080/membership"; 
  response = await fetch(url, {
      method: "GET",
      headers: header
  });
  let plan = await response.json();
  let description = '';
  console.log(plan);
  for(const i of plan){
    if(i.planName == paymentdata.planName){
      basePrice = i.price
      description = i.description
    } 
  }
  // (ไม่จำเป็น แต่เก็บไว้ใช้หน้า success ได้)
  localStorage.setItem("lastPayment", JSON.stringify(paymentdata));

  //แสดง Member ID , Amount และ Receipt Number ในหน้า
  const memberIdElem = document.getElementById("member-id");
  if (memberIdElem) memberIdElem.textContent = paymentdata.memberId;

  const amountElement = document.getElementById("qr-amount");
  if (amountElement) amountElement.textContent = `฿${paymentdata.amount.toFixed(2)}`;

  const refCodeElement = document.getElementById("qr-ref");
  if (refCodeElement) refCodeElement.textContent = paymentdata.receiptNumber;


  // ใส่ข้อมูลลง HTML
  
  document.getElementById("plan-name").textContent = paymentdata.planName;
  document.getElementById("plan-price").innerHTML = `฿${basePrice}<span>/mo.</span>`;
  document.getElementById("subtotal").textContent = `฿${basePrice.toFixed(2)}`;
  document.getElementById("discount").textContent = `฿${(basePrice-paymentdata.amount).toFixed(2)}`;
  document.getElementById("total").textContent = `฿${paymentdata.amount.toFixed(2)}`;

  const ul = document.getElementById("plan-features");
  ul.innerHTML = "";

  console.log(description);
  description.split("+").forEach(feature => {
    const li = document.createElement("li");
    li.innerHTML = `<span>✔</span> ${feature}`;
    ul.appendChild(li);
  }); 


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
}







async function savepayment() {
  const header = {
    "Content-Type": "application/json"
  };
  let url = "http://localhost:8080/membership";
  let response = await fetch(url, {
    method: "GET",
    headers: header,
  });
  let data = await response.json();
  let amount = '';
  let planId = '';
  console.log(data);
  for(const i of data){
    if (i.planName == planName){
       amount = i.price
       planId = i.id
    }
  }
  console.log(amount,planName,planId,id,planId,promoCode);
  const body = JSON.stringify({
    "amount": amount,
    "paymentMethod": 'e-payment',
    "memberId": id,
    "planId": planId,
    "promotionCode": promoCode
  });
  url = "http://localhost:8080/payment"; 
  response = await fetch(url, {
    method: "POST",
    headers: header,
    body: body,
  });
  data = await response.json();
  //console.log(data);
  return data;
}
