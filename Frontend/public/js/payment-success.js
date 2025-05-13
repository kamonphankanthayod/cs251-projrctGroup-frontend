// ดึงข้อมูล payment ล่าสุดจาก localStorage
const payment = JSON.parse(localStorage.getItem("lastPayment"));
console.log("ข้อมูลจากหน้าเดิม:", payment);

if (payment) {
  // ใส่ข้อมูลในช่องต่างๆ
  document.getElementById("net-price").textContent = `฿${payment.Amount.toFixed(2)}`;
  document.getElementById("status-text").textContent = payment.PaymentStatus;
} else {
  // fallback หากไม่มีข้อมูลใน localStorage
  document.getElementById("net-price").textContent = "฿-";
  document.getElementById("status-text").textContent = "Unknown";
}