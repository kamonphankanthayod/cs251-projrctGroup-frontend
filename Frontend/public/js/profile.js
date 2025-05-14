document.addEventListener('DOMContentLoaded', function() {
    const id = 1 //JSON.parse(localStorage.getItem("id"));
    // โหลดข้อมูลผู้ใช้
    loadUserProfile();
    
    // โหลดข้อมูลสมาชิก
    loadMembershipDetails();
    
    // โหลดข้อมูลวิธีการชำระเงิน
    loadPaymentMethods();
    
    // โหลดประวัติสมาชิก
    loadMembershipHistory();
    
    // ตั้งค่าแท็บสมาชิก
    setupMembershipTabs();
    
    // ตั้งค่าปุ่มแก้ไขโปรไฟล์
    setupEditProfileButton();
    
    // ตั้งค่าการอัพโหลดรูปโปรไฟล์
    setupProfileImageUpload();
    
    // ตั้งค่าปุ่มเปลี่ยนแผนสมาชิก
    setupChangePlanButton();
    
    // ตั้งค่าปุ่มยกเลิกสมาชิก
    setupCancelMembershipButton();
    
    // ตั้งค่าปุ่มเพิ่มวิธีการชำระเงิน
    setupAddPaymentButton();

});

// ฟังก์ชันโหลดข้อมูลผู้ใช้
async function loadUserProfile() {
    try {
        // ในระบบจริงจะใช้ API.getUserProfile() เพื่อดึงข้อมูล
        const profile = await API.getUserProfile();
        const header = {
            "Content-Type": "application/json"
        };
        let url = "http://localhost:8080/member/{memberId}";
        let response = await fetch(url, {
            method: "GET",
            headers: header,
        });
        
        if (profile) {
            let memberIdElem = document.getElementById("nameP");
            if (memberIdElem) memberIdElem.textContent = profile.name;
            memberIdElem = document.getElementById("planP");
            if (memberIdElem) memberIdElem.textContent = profile.membershipType;
            // อัพเดทข้อมูลในหน้า
            document.getElementById('profile-name-value').textContent = `${profile.fname} ${profile.lname}`;
            document.getElementById('profile-email-value').textContent = profile.email;
            document.getElementById('profile-phone-value').textContent = profile.phoneNumber;
            document.getElementById('profile-address-value').textContent = profile.address;
            
            // อัพเดทฟอร์มแก้ไขโปรไฟล์
            document.getElementById('profile-name').value = profile.name;
            document.getElementById('profile-email').value = profile.email;
            document.getElementById('profile-phone').value = profile.phone;
            document.getElementById('profile-address').value = profile.address;
            
            // แปลงวันที่เป็นรูปแบบที่ใช้กับ input type="date"
            /*
            const birthDate = new Date(profile.birthDate);
            const formattedDate = birthDate.toISOString().split('T')[0];
            document.getElementById('profile-birthdate').value = formattedDate;
            */
            // อัพเดทรูปโปรไฟล์
            /*
            if (profile.profileImage) {
                document.getElementById('profile-image').src = profile.profileImage;
            }*/
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์:', error);
        showNotification('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

// ฟังก์ชันโหลดข้อมูลสมาชิก
async function loadMembershipDetails() {
    try {
        // ในระบบจริงจะใช้ API.getMembershipDetails() เพื่อดึงข้อมูล
        const membership = await API.getMembershipDetails();
        const header = {
            "Content-Type": "application/json"
        };
        let url = "http://localhost:8080/membership/{id}";
        let response = await fetch(url, {
            method: "GET",
            headers: header,
        });
        
        if (membership) {
            // อัพเดทข้อมูลในหน้า
            document.getElementById('membership-type-value').textContent = membership.type;
            document.getElementById('membership-since-value').textContent = membership.startDate;
            document.getElementById('membership-expires-value').textContent = membership.expiryDate;
            document.getElementById('membership-id-value').textContent = membership.id;
            document.getElementById('billing-cycle-value').textContent = membership.billingCycle;
            document.getElementById('next-billing-value').textContent = membership.nextBillingDate;
            
            // อัพเดทแท็บสิทธิประโยชน์
            const benefitsList = document.getElementById('benefits-list');
            benefitsList.innerHTML = '';
            
            membership.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
            
            // อัพเดทสถานะแผนปัจจุบัน
            updateCurrentPlan(membership.type.toLowerCase());
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก:', error);
        showNotification('ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

// ฟังก์ชันโหลดข้อมูลวิธีการชำระเงิน
async function loadPaymentMethods() {
    const paymentMethodsList = document.getElementById('payment-methods-list');
    const header = {
            "Content-Type": "application/json"
        };
        let url = "http://localhost:8080/payment";
        let response = await fetch(url, {
            method: "GET",
            headers: header,
        });
    
    try {
        // ในระบบจริงจะใช้ API.getPaymentMethods() เพื่อดึงข้อมูล
        const paymentMethods = await API.getPaymentMethods();
        
        if (paymentMethods && paymentMethods.length > 0) {
            paymentMethodsList.innerHTML = '';
            
            paymentMethods.forEach(method => {
                const methodElement = document.createElement('div');
                methodElement.className = 'payment-method';
                methodElement.dataset.id = method.id;
                
                methodElement.innerHTML = `
                    <div class="payment-method-info">
                        <div class="payment-method-icon"><i class="fas fa-credit-card"></i></div>
                        <div class="payment-method-details">
                            <div class="payment-method-type">${
                              method.type
                            }</div>
                            <div class="payment-method-number">**** **** **** ${
                              method.lastFour
                            }</div>
                            <div class="payment-method-expiry">Expire: ${
                              method.expiry
                            }</div>
                        </div>
                    </div>
                    <div class="payment-method-actions">
                        ${
                          method.isDefault
                            ? '<button class="payment-action-btn default">Default</button>'
                            : `<button class="payment-action-btn set-default" data-id="${method.id}">Set Default</button>`
                        }
                        <button class="payment-action-btn delete" data-id="${
                          method.id
                        }"><i class="fas fa-trash"></i></button>
                    </div>
                `;

        paymentMethodsList.appendChild(methodElement);
      });

      // ตั้งค่าการจัดการวิธีการชำระเงิน
      setupPaymentMethodActions();
    } else {
      paymentMethodsList.innerHTML =
        '<div class="no-data">ไม่พบข้อมูลวิธีการชำระเงิน</div>';
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลวิธีการชำระเงิน:", error);
    paymentMethodsList.innerHTML =
      '<div class="no-data">ไม่สามารถโหลดข้อมูลวิธีการชำระเงินได้</div>';
  }
}

// ฟังก์ชันโหลดประวัติสมาชิก
function loadMembershipHistory() {
  const historyContainer = document.querySelector(".membership-history-list");

  // ข้อมูลจำลอง
  const historyData = [
    {
      date: "2025-01-01",
      action: "Membership Started",
      details: "Gold membership plan activated",
    },
    {
      date: "2024-12-15",
      action: "Plan Changed",
      details: "Changed from Silver to Gold plan",
    },
    {
      date: "2024-10-01",
      action: "Membership Started",
      details: "Silver membership plan activated",
    },
    {
      date: "2024-09-25",
      action: "Registration",
      details: "Account created",
    },
  ];

  // เรียงข้อมูลจากใหม่ไปเก่า
  historyData.sort((a, b) => new Date(b.date) - new Date(a.date));

  // แสดงข้อมูล
  historyContainer.innerHTML = "";

  historyData.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";

    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    historyItem.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div class="history-action">${item.action}</div>
            <div class="history-details">${item.details}</div>
        `;

    historyContainer.appendChild(historyItem);
  });
}

// ฟังก์ชันตั้งค่าแท็บสมาชิก
function setupMembershipTabs() {
  const tabButtons = document.querySelectorAll(".membership-tabs .tab-btn");
  const tabContents = document.querySelectorAll(
    ".membership-tabs .tab-content"
  );

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // ลบคลาส active จากทุกแท็บ
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // เพิ่มคลาส active ให้กับแท็บที่เลือก
      this.classList.add("active");
      document.getElementById(`membership-${tabId}`).classList.add("active");
    });
  });
}

// ฟังก์ชันตั้งค่าปุ่มแก้ไขโปรไฟล์
function setupEditProfileButton() {
  const editButton = document.getElementById("edit-profile-btn");
  const modal = document.getElementById("edit-profile-modal");
  const closeBtn = modal.querySelector(".close-modal");
  const form = document.getElementById("profile-form");

  // เปิด Modal เมื่อคลิกที่ปุ่มแก้ไข
  editButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // ปิด Modal เมื่อคลิกที่ปุ่มปิด
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // ปิด Modal เมื่อคลิกนอก Modal
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ส่งฟอร์มแก้ไขโปรไฟล์
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // รวบรวมข้อมูลจากฟอร์ม
    const formData = new FormData(form);

    try {
      // ในระบบจริงจะเรียกใช้ API
      const response = await API.updateUserProfile(formData);

      if (response.success) {
        // อัพเดทข้อมูลในหน้า
        document.getElementById("profile-name-value").textContent =
          formData.get("name");
        document.getElementById("profile-email-value").textContent =
          formData.get("email");
        document.getElementById("profile-phone-value").textContent =
          formData.get("phone");
        document.getElementById("profile-address-value").textContent =
          formData.get("address");

        // แปลงวันที่เป็นรูปแบบที่ต้องการ
        const birthDate = new Date(formData.get("birthDate"));
        const formattedDate = birthDate.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        document.getElementById("profile-birthdate-value").textContent =
          formattedDate;

        // อัพเดทรูปโปรไฟล์ทุกที่ในเว็บไซต์
        if (response.profileImage) {
          updateProfileImages(response.profileImage);
        }

    });
    
    // ส่งฟอร์มแก้ไขโปรไฟล์
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // รวบรวมข้อมูลจากฟอร์ม
        const formData = new FormData(form);
        let data ={}
        for (const [key, value] of formData.entries()) {
            data[key] =  value
        }
        
        try {
            // ในระบบจริงจะเรียกใช้ API
            const response = await API.updateUserProfile(data);
            
            if (response.success) {
                // อัพเดทข้อมูลในหน้า
                document.getElementById('profile-name-value').textContent = formData.get('name');
                document.getElementById('profile-email-value').textContent = formData.get('email');
                document.getElementById('profile-phone-value').textContent = formData.get('phone');
                document.getElementById('profile-address-value').textContent = formData.get('address');
                
                // แปลงวันที่เป็นรูปแบบที่ต้องการ
                const birthDate = new Date(formData.get('birthDate'));
                const formattedDate = birthDate.toLocaleDateString('th-TH', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                });
                document.getElementById('profile-birthdate-value').textContent = formattedDate;
                
                // อัพเดทรูปโปรไฟล์ทุกที่ในเว็บไซต์
                if (response.profileImage) {
                    //updateProfileImages(response.profileImage);
                }
                
                // อัพเดทชื่อผู้ใช้ในเมนูด้านข้าง
                const sidebarUsername = document.querySelector('.sidebar .user-name');
                if (sidebarUsername) {
                    sidebarUsername.textContent = formData.get('name');
                }
                
                // ปิด Modal
                modal.style.display = 'none';
                
                // แสดงข้อความสำเร็จ
                showNotification('อัพเดทโปรไฟล์เรียบร้อยแล้ว');
            } else {
                throw new Error(response.message || 'ไม่สามารถอัพเดทโปรไฟล์ได้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์:', error);
            showNotification('ไม่สามารถอัพเดทโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง', 'error');
        }

        // ปิด Modal
        modal.style.display = "none";

        // แสดงข้อความสำเร็จ
        showNotification("อัพเดทโปรไฟล์เรียบร้อยแล้ว");
      } else {
        throw new Error(response.message || "ไม่สามารถอัพเดทโปรไฟล์ได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์:", error);
      showNotification(
        "ไม่สามารถอัพเดทโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        "error"
      );
    }
  });
}

// ฟังก์ชันตั้งค่าปุ่มเปลี่ยนแผนสมาชิก
function setupChangePlanButton() {
  const changePlanButton = document.getElementById("change-plan-btn");
  const modal = document.getElementById("change-plan-modal");
  const closeBtn = modal.querySelector(".close-modal");
  const selectPlanButtons = document.querySelectorAll(".select-plan-btn");

  // เปิด Modal เมื่อคลิกที่ปุ่มเปลี่ยนแผน
  changePlanButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // ปิด Modal เมื่อคลิกที่ปุ่มปิด
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // ปิด Modal เมื่อคลิกนอก Modal
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ตั้งค่าปุ่มเลือกแผน
  selectPlanButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const planId = this.getAttribute("data-plan");

      if (
        confirm(
          `คุณต้องการเปลี่ยนแผนสมาชิกเป็น ${
            planId.charAt(0).toUpperCase() + planId.slice(1)
          } หรือไม่?`
        )
      ) {
        try {
          // ในระบบจริงจะเรียกใช้ API
          const response = await API.changeMembershipPlan(planId);

          if (response.success) {
            // อัพเดทสถานะแผนปัจจุบัน
            updateCurrentPlan(planId);

            // อัพเดทข้อมูลในหน้า
            document.getElementById("membership-type-value").textContent =
              response.newPlan.type;

            // อัพเดทสิทธิประโยชน์ตามแผนที่เลือก
            updateBenefitsByPlan(planId);

            // เพิ่มประวัติการเปลี่ยนแปลง
            addMembershipHistoryItem(
              "Plan Changed",
              `Changed to ${response.newPlan.type} plan`
            );

            // ปิด Modal
            modal.style.display = "none";

            // แสดงข้อความสำเร็จ
            showNotification("เปลี่ยนแผนสมาชิกเรียบร้อยแล้ว");
          } else {
            throw new Error(response.message || "ไม่สามารถเปลี่ยนแผนสมาชิกได้");
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเปลี่ยนแผนสมาชิก:", error);
          showNotification(
            "ไม่สามารถเปลี่ยนแผนสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
            "error"
          );
        }
      }
    });
  });
}

// ฟังก์ชันอัพเดทสถานะแผนปัจจุบัน
function updateCurrentPlan(planId) {
  // ลบสถานะแผนปัจจุบันทั้งหมด
  document.querySelectorAll(".plan-option").forEach((plan) => {
    plan.classList.remove("active");
    const badge = plan.querySelector(".current-plan-badge");
    if (badge) badge.remove();
  });

  // เพิ่มสถานะแผนปัจจุบัน
  const currentPlan = document.getElementById(`${planId}-plan`);
  if (currentPlan) {
    currentPlan.classList.add("active");

    // เพิ่ม badge
    if (!currentPlan.querySelector(".current-plan-badge")) {
      const badge = document.createElement("div");
      badge.className = "current-plan-badge";
      badge.textContent = "Current Plan";
      currentPlan.appendChild(badge);
    }

    // ลบปุ่มเลือกแผน
    const selectButton = currentPlan.querySelector(".select-plan-btn");
    if (selectButton) selectButton.remove();
  }

  // เพิ่มปุ่มเลือกแผนให้กับแผนอื่น
  document.querySelectorAll(".plan-option:not(.active)").forEach((plan) => {
    const planType = plan.id.replace("-plan", "");
    if (!plan.querySelector(".select-plan-btn")) {
      const button = document.createElement("button");
      button.className = "btn btn-outline select-plan-btn";
      button.setAttribute("data-plan", planType);
      button.textContent = "Select Plan";
      button.addEventListener("click", async function () {
        const planId = this.getAttribute("data-plan");

        if (
          confirm(
            `คุณต้องการเปลี่ยนแผนสมาชิกเป็น ${
              planId.charAt(0).toUpperCase() + planId.slice(1)
            } หรือไม่?`
          )
        ) {
          try {
            // ในระบบจริงจะเรียกใช้ API
            const response = await API.changeMembershipPlan(planId);

            if (response.success) {
              // อัพเดทสถานะแผนปัจจุบัน
              updateCurrentPlan(planId);

              // อัพเดทข้อมูลในหน้า
              document.getElementById("membership-type-value").textContent =
                response.newPlan.type;

              // อัพเดทสิทธิประโยชน์ตามแผนที่เลือก
              updateBenefitsByPlan(planId);

              // เพิ่มประวัติการเปลี่ยนแปลง
              addMembershipHistoryItem(
                "Plan Changed",
                `Changed to ${response.newPlan.type} plan`
              );

              // ปิด Modal
              document.getElementById("change-plan-modal").style.display =
                "none";

              // แสดงข้อความสำเร็จ
              showNotification("เปลี่ยนแผนสมาชิกเรียบร้อยแล้ว");
            } else {
              throw new Error(
                response.message || "ไม่สามารถเปลี่ยนแผนสมาชิกได้"
              );
            }
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการเปลี่ยนแผนสมาชิก:", error);
            showNotification(
              "ไม่สามารถเปลี่ยนแผนสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
              "error"
            );
          }
        }
      });
      plan.appendChild(button);
    }
  });
}

// ฟังก์ชันอัพเดทสิทธิประโยชน์ตามแผนที่เลือก
function updateBenefitsByPlan(planId) {
  const benefitsList = document.getElementById("benefits-list");
  benefitsList.innerHTML = "";

  let benefits = [];

  switch (planId) {
    case "standard":
      benefits = ["เข้าใช้บริการฟิตเนสได้ตลอด 24/7", "ล็อคเกอร์ส่วนตัวฟรี"];
      break;
    case "silver":
      benefits = [
        "เข้าใช้บริการฟิตเนสได้ตลอด 24/7",
        "คลาสกลุ่มพื้นฐาน",
        "ล็อคเกอร์ส่วนตัวฟรี",
      ];
      break;
    case "gold":
      benefits = [
        "เข้าใช้บริการฟิตเนสได้ตลอด 24/7",
        "คลาสกลุ่มฟรี",
        "ปรึกษาเทรนเนอร์ส่วนตัว (2 ครั้ง/เดือน)",
        "เข้าถึงอุปกรณ์พรีเมียม",
        "บริการผ้าเช็ดตัว",
        "ล็อคเกอร์ส่วนตัวฟรี",
      ];
      break;
    case "platinum":
      benefits = [
        "เข้าใช้บริการฟิตเนสได้ตลอด 24/7",
        "คลาสกลุ่มฟรีไม่จำกัด",
        "ปรึกษาเทรนเนอร์ส่วนตัว (4 ครั้ง/เดือน)",
        "เข้าถึงอุปกรณ์พรีเมียม",
        "บริการผ้าเช็ดตัว",
        "ล็อคเกอร์ส่วนตัวฟรี",
        "สิทธิ์เข้าใช้สปาและซาวน่า",
        "ที่จอดรถฟรี",
      ];
      break;
  }

  benefits.forEach((benefit) => {
    const li = document.createElement("li");
    li.textContent = benefit;
    benefitsList.appendChild(li);
  });
}

// ฟังก์ชันเพิ่มประวัติการเปลี่ยนแปลงสมาชิก
function addMembershipHistoryItem(action, details) {
  const historyContainer = document.querySelector(".membership-history-list");

  const historyItem = document.createElement("div");
  historyItem.className = "history-item";

  const date = new Date();
  const formattedDate = date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  historyItem.innerHTML = `
        <div class="history-date">${formattedDate}</div>
        <div class="history-action">${action}</div>
        <div class="history-details">${details}</div>
    `;

  // เพิ่มรายการใหม่ไว้ด้านบนสุด
  historyContainer.insertBefore(historyItem, historyContainer.firstChild);
}

// ฟังก์ชันตั้งค่าปุ่มยกเลิกสมาชิก
function setupCancelMembershipButton() {
  const cancelButton = document.getElementById("cancel-membership-btn");

  cancelButton.addEventListener("click", async function () {
    if (
      confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกสมาชิก? การกระทำนี้จะเปลี่ยนแผนของคุณเป็น Standard"
      )
    ) {
      try {
        // ในระบบจริงจะเรียกใช้ API
        const response = await API.cancelMembership();

        if (response.success) {
          // เปลี่ยนแผนเป็น Standard
          updateCurrentPlan("standard");

          // อัพเดทข้อมูลในหน้า
          document.getElementById("membership-type-value").textContent =
            "Standard";

          // อัพเดทสิทธิประโยชน์
          updateBenefitsByPlan("standard");

          // เพิ่มประวัติการเปลี่ยนแปลง
          addMembershipHistoryItem(
            "Membership Downgraded",
            "Changed to Standard plan"
          );

          // แสดงข้อความสำเร็จ
          showNotification("เปลี่ยนแผนสมาชิกเป็น Standard เรียบร้อยแล้ว");
        } else {
          throw new Error(response.message || "ไม่สามารถยกเลิกสมาชิกได้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการยกเลิกสมาชิก:", error);
        showNotification(
          "ไม่สามารถยกเลิกสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
          "error"
        );
      }
    }
  });
}

// ฟังก์ชันตั้งค่าปุ่มเพิ่มวิธีการชำระเงิน
function setupAddPaymentButton() {
  const addButton = document.getElementById("add-payment-btn");
  const modal = document.getElementById("add-payment-modal");
  const closeBtn = modal.querySelector(".close-modal");
  const form = document.getElementById("payment-form");

  // เปิด Modal เมื่อคลิกที่ปุ่มเพิ่ม
  addButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // ปิด Modal เมื่อคลิกที่ปุ่มปิด
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // ปิด Modal เมื่อคลิกนอก Modal
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // จัดรูปแบบหมายเลขบัตร
  const cardNumberInput = document.getElementById("card-number");
  cardNumberInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = value.match(new RegExp(".{1,4}", "g")).join(" ");
    }
    e.target.value = value;
  });

  // จัดรูปแบบวันหมดอายุ
  const cardExpiryInput = document.getElementById("card-expiry");
  cardExpiryInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // จัดรูปแบบ CVV
  const cardCvvInput = document.getElementById("card-cvv");
  cardCvvInput.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  // ส่งฟอร์มเพิ่มวิธีการชำระเงิน
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // รวบรวมข้อมูลจากฟอร์ม
    const formData = {
      cardNumber: document
        .getElementById("card-number")
        .value.replace(/\s/g, ""),
      cardExpiry: document.getElementById("card-expiry").value,
      cardCvv: document.getElementById("card-cvv").value,
      cardName: document.getElementById("card-name").value,
      setDefault: document.getElementById("set-default").checked,
    };

    // ตรวจสอบข้อมูล
    if (formData.cardNumber.length !== 16) {
      showNotification("กรุณากรอกหมายเลขบัตรให้ครบ 16 หลัก", "error");
      return;
    }

    if (formData.cardExpiry.length !== 5) {
      showNotification("กรุณากรอกวันหมดอายุให้ถูกต้อง (MM/YY)", "error");
      return;
    }

    if (formData.cardCvv.length !== 3) {
      showNotification("กรุณากรอก CVV ให้ครบ 3 หลัก", "error");
      return;
    }

    if (!formData.cardName) {
      showNotification("กรุณากรอกชื่อบนบัตร", "error");
      return;
    }

    try {
      // ในระบบจริงจะเรียกใช้ API
      const response = await API.addPaymentMethod(formData);

      if (response.success) {
        // รีเซ็ตฟอร์ม
        form.reset();

        // ปิด Modal
        modal.style.display = "none";

        // โหลดข้อมูลวิธีการชำระเงินใหม่
        loadPaymentMethods();

        // แสดงข้อความสำเร็จ
        showNotification("เพิ่มวิธีการชำระเงินเรียบร้อยแล้ว");
      } else {
        throw new Error(response.message || "ไม่สามารถเพิ่มวิธีการชำระเงินได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มวิธีการชำระเงิน:", error);
      showNotification(
        "ไม่สามารถเพิ่มวิธีการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
        "error"
      );
    }
  });
}

// ฟังก์ชันตั้งค่าการจัดการวิธีการชำระเงิน
function setupPaymentMethodActions() {
  // ตั้งค่าปุ่มตั้งเป็นค่าเริ่มต้น
  const setDefaultButtons = document.querySelectorAll(
    ".payment-action-btn.set-default"
  );

  setDefaultButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const paymentId = this.getAttribute("data-id");

      try {
        // ในระบบจริงจะเรียกใช้ API
        const response = await API.setDefaultPaymentMethod(paymentId);

        if (response.success) {
          // โหลดข้อมูลวิธีการชำระเงินใหม่
          loadPaymentMethods();

          // แสดงข้อความสำเร็จ
          showNotification("ตั้งค่าวิธีการชำระเงินเริ่มต้นเรียบร้อยแล้ว");
        } else {
          throw new Error(
            response.message || "ไม่สามารถตั้งค่าวิธีการชำระเงินเริ่มต้นได้"
          );
        }
      } catch (error) {
        console.error(
          "เกิดข้อผิดพลาดในการตั้งค่าวิธีการชำระเงินเริ่มต้น:",
          error
        );
        showNotification(
          "ไม่สามารถตั้งค่าวิธีการชำระเงินเริ่มต้นได้ กรุณาลองใหม่อีกครั้ง",
          "error"
        );
      }
    });
  });

  // ตั้งค่าปุ่มลบ
  const deleteButtons = document.querySelectorAll(".payment-action-btn.delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const paymentId = this.getAttribute("data-id");

      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบวิธีการชำระเงินนี้?")) {
        try {
          // ในระบบจริงจะเรียกใช้ API
          const response = await API.deletePaymentMethod(paymentId);

          if (response.success) {
            // โหลดข้อมูลวิธีการชำระเงินใหม่
            loadPaymentMethods();

            // แสดงข้อความสำเร็จ
            showNotification("ลบวิธีการชำระเงินเรียบร้อยแล้ว");
          } else {
            throw new Error(
              response.message || "ไม่สามารถลบวิธีการชำระเงินได้"
            );
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบวิธีการชำระเงิน:", error);
          showNotification(
            "ไม่สามารถลบวิธีการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
            "error"
          );
        }
      }
    });
  });
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = "success") {
  // ลบการแจ้งเตือนเดิม
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // สร้างการแจ้งเตือนใหม่
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // แสดงการแจ้งเตือน
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // ซ่อนและลบการแจ้งเตือนหลังจาก 3 วินาที
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}


/*
// ฟังก์ชันอัพเดทรูปโปรไฟล์ทุกที่ในเว็บไซต์
function updateProfileImages(imageUrl) {

    // อัพเดทรูปในหน้าโปรไฟล์
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        profileImage.src = imageUrl;
    }
    
    // อัพเดทรูปในเมนูด้านข้าง
    const sidebarAvatar = document.querySelector('.sidebar .user-avatar img');
    if (sidebarAvatar) {
        sidebarAvatar.src = imageUrl;
    }
    
    // อัพเดทรูปในพรีวิวการอัพโหลด
    const profileImagePreview = document.getElementById('profile-image-preview');
    if (profileImagePreview) {
        profileImagePreview.src = imageUrl;
    }
}*/


// ฟังก์ชันตั้งค่าการอัพโหลดรูปโปรไฟล์
function setupProfileImageUpload() {
  const uploadButton = document.getElementById("upload-image-btn");
  const fileInput = document.getElementById("profile-image-upload");
  const imagePreview = document.getElementById("profile-image-preview");

  if (!uploadButton || !fileInput || !imagePreview) return;

  // เปิดหน้าต่างเลือกไฟล์เมื่อคลิกที่ปุ่ม
  uploadButton.addEventListener("click", function () {
    fileInput.click();
  });

  // แสดงตัวอย่างรูปเมื่อเลือกไฟล์
  fileInput.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (event) {
        imagePreview.src = event.target.result;
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // เพิ่มปุ่มแก้ไขรูปโปรไฟล์ที่หน้าโปรไฟล์
  const profileAvatar = document.querySelector(".profile-avatar");
  if (profileAvatar) {
    // เพิ่มปุ่มแก้ไขรูปโปรไฟล์
    const editOverlay = document.createElement("div");
    editOverlay.className = "edit-avatar-overlay";
    editOverlay.innerHTML = '<i class="fas fa-camera"></i>';
    profileAvatar.appendChild(editOverlay);

    // เปิด Modal แก้ไขโปรไฟล์เมื่อคลิกที่ปุ่มแก้ไขรูป
    editOverlay.addEventListener("click", function () {
      document.getElementById("edit-profile-modal").style.display = "block";
      // เลื่อนไปที่ส่วนอัพโหลดรูป
      document.querySelector(".profile-image-upload").scrollIntoView();
    });
  }
}
