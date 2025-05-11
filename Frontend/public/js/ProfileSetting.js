/**
 * ไฟล์ JavaScript หลักสำหรับทุกหน้า
 * ใช้สำหรับการจัดการการนำทางและฟังก์ชันการทำงานทั่วไป
 */

document.addEventListener("DOMContentLoaded", () => {
  // ตั้งค่าการนำทางของเมนูด้านข้าง
  setupSidebarNavigation()

  // ตั้งค่าปุ่มออกจากระบบ
  setupLogout()
})

// ฟังก์ชันตั้งค่าการนำทางของเมนูด้านข้าง
function setupSidebarNavigation() {
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // ลบคลาส active จากทุกลิงก์
      sidebarLinks.forEach((item) => {
        item.classList.remove("active")
      })

      // เพิ่มคลาส active ให้กับลิงก์ที่คลิก
      this.classList.add("active")

      // ดึงค่า page จาก data-page attribute
      const page = this.getAttribute("data-page")

      // นำทางไปยังหน้าที่เลือก
      window.location.href = page + ".html"
    })
  })

  // ตั้งค่า active class ตามหน้าปัจจุบัน
  const currentPage = window.location.pathname.split("/").pop().replace(".html", "")
  const currentLink = document.querySelector(`.sidebar-link[data-page="${currentPage}"]`)

  if (currentLink) {
    currentLink.classList.add("active")
  } else {
    // ถ้าไม่มีหน้าที่ตรงกัน ให้ตั้งค่าหน้า my-classes เป็นค่าเริ่มต้น
    const defaultLink = document.querySelector('.sidebar-link[data-page="my-classes"]')
    if (defaultLink) {
      defaultLink.classList.add("active")
    }
  }
}

// ฟังก์ชันตั้งค่าปุ่มออกจากระบบ
function setupLogout() {
  const logoutBtn = document.querySelector(".sign-out-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // ในระบบจริงควรมีการเรียก API เพื่อออกจากระบบ
      if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
        // จำลองการออกจากระบบ
        alert("ออกจากระบบสำเร็จ")
        window.location.href = "login.html" // สมมติว่ามีหน้า login.html
      }
    })
  }
}

// ฟังก์ชันสำหรับการเปลี่ยนแท็บ
function switchTab(tabContainer, tabId) {
  const tabButtons = tabContainer.querySelectorAll(".tab-btn")
  const tabContents = tabContainer.querySelectorAll(".tab-content")

  // ลบคลาส active จากทุกแท็บ
  tabButtons.forEach((btn) => btn.classList.remove("active"))
  tabContents.forEach((content) => content.classList.remove("active"))

  // เพิ่มคลาส active ให้กับแท็บที่เลือก
  tabContainer.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add("active")
  tabContainer.querySelector(`#${tabId}-content`).classList.add("active")
}

// ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // แสดงการแจ้งเตือน
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // ซ่อนและลบการแจ้งเตือนหลังจาก 3 วินาที
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// ฟังก์ชันสำหรับการโหลดข้อมูล
async function fetchData(apiFunction, params = {}) {
  try {
    return await apiFunction(params)
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error)
    showNotification("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง", "error")
    return null
  }
}

// ฟังก์ชันสำหรับการแสดงสถานะการโหลด
function showLoading(element) {
  element.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>'
}

// ฟังก์ชันสำหรับการแสดงข้อความเมื่อไม่พบข้อมูล
function showNoData(element, message = "ไม่พบข้อมูล") {
  element.innerHTML = `<div class="no-data">${message}</div>`
}
