/**
 * Mock API สำหรับระบบจัดการสมาชิกฟิตเนส
 * ไฟล์นี้มีฟังก์ชัน Mock API ที่จำลองการเรียก API จาก Backend
 * ทีม Backend สามารถแทนที่ฟังก์ชันเหล่านี้ด้วย API จริงได้
 */

const API = {
  // API ข้อมูลผู้ใช้
  getUserProfile: async () => {
    const id = 1 //JSON.parse(localStorage.getItem("id"));
    // จำลองการหน่วงเวลาเรียก API
    const header = {
      "Content-Type": "application/json"
    };
    url = "http://localhost:8080/member/"+id; 
    response = await fetch(url, {
        method: "GET",
        headers: header
    });
    data = await response.json();
    // ส่งข้อมูล
    return {
      id: data.id,
      name: data.fname+' '+data.lname,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      birthDate: "18 Feb 1990",
      profileImage: "/placeholder.svg?height=120&width=120",
      membershipType: data.planName+" Member",
    }
  },

  updateUserProfile: async (userData) => {
    console.log(userData);
    const id = 1 //JSON.parse(localStorage.getItem("id"));
    const header = {
      "Content-Type": "application/json"
    };
    url = "http://localhost:8080/member/"+id; 
    response = await fetch(url, {
        method: "GET",
        headers: header,
    });
    data = await response.json();
    rname = userData.name.split(' ');
    
    const body = JSON.stringify({
      "userName": data.userName,
      "fname": rname[0],
      "lname": rname[1],
      "email": userData.email,
      "password": userData.pass,
      "phoneNumber": userData.phone,
      "address": userData.address
    });
    console.log(body);
    url = "http://localhost:8080/member/"+id; 
    response = await fetch(url, {
        method: "PUT",
        headers: header,
        body: body,
    });
    data = await response.json();
    console.log(data);

    // จำลองการอัพเดทสำเร็จ
    return {
      success: true,
      message: "อัพเดทโปรไฟล์สำเร็จ",
      data: userData,
    }
  },

  // API ข้อมูลสมาชิก
  getMembershipDetails: async () => {
    const id = 1 //JSON.parse(localStorage.getItem("id"));
    const header = {
      "Content-Type": "application/json"
    };
    url = "http://localhost:8080/member/"+id; 
    response = await fetch(url, {
        method: "GET",
        headers: header
    });
    datamem = await response.json();
    //console.log(datamem);
    url = "http://localhost:8080/membership"; 
    response = await fetch(url, {
        method: "GET",
        headers: header
    });
    dataplan = await response.json();
    //console.log(dataplan);
    let plan = '';
    for(const i of dataplan){
      if(i.planName == datamem.planName){
        plan = i
      } 
    }
    console.log(plan);
    enddate = datamem.expireDate.split('-');
    enddate[1] = parseInt(enddate[1])+1;
    enddate[2] = parseInt(enddate[2])-1
    if(enddate[2]==0){
      enddate[1]-=1;
      if(enddate[1]%2==1){
        enddate[2] = 31;
      }
      else if(enddate[1]==2){
        enddate[2] = 28;
      }
      else{
        enddate[2] = 30;
      }
    }
    if(enddate[1]>12){
      enddate[1]=1
    }
    bill = enddate;
    bill[2] = bill[2]-1
    if(bill[2]==0){
      bill[1]-=1;
      if(enddate[1]%2==1){
        enddate[2] = 31;
      }
      else if(enddate[1]==2){
        enddate[2] = 28;
      }
      else{
        enddate[2] = 30;
      }
    }
    console.log(plan.description.split('+'));

    // ส่งข้อมูล
    return {
      id: plan.id,
      type: datamem.planName,
      startDate: datamem.expireDate,
      expiryDate: enddate[0]+'-'+enddate[1]+'-'+enddate[2],
      billingCycle: "Monthly automatic renewal",
      nextBillingDate: bill[0]+'-'+bill[1]+'-'+bill[2],
      benefits: plan.description.split('+'),
    }
  },

  changeMembershipPlan: async (planId) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 700))

    // จำลองการเปลี่ยนแผนสำเร็จ
    return {
      success: true,
      message: "เปลี่ยนแผนสมาชิกสำเร็จ",
      newPlan: {
        id: planId,
        type: planId === "platinum" ? "Platinum" : "Gold",
        startDate: "January 2025",
        expiryDate: "December 31, 2025",
      },
    }
  },

  cancelMembership: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 900))

    // จำลองการยกเลิกสำเร็จ
    return {
      success: true,
      message: "ยกเลิกสมาชิกสำเร็จ",
      cancellationDate: "December 31, 2023",
    }
  },

  // API วิธีการชำระเงิน
  getPaymentMethods: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // ส่งข้อมูลจำลอง
    return [
      {
        id: "CARD1",
        type: "Card",
        lastFour: "****",
        expiry: "12/25",
        isDefault: true,
      },
      {
        id: "CARD2",
        type: "Card",
        lastFour: "****",
        expiry: "12/25",
        isDefault: false,
      },
      {
        id: "CARD3",
        type: "Card",
        lastFour: "****",
        expiry: "12/25",
        isDefault: false,
      },
    ]
  },

  addPaymentMethod: async (paymentData) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 800))

    // จำลองการเพิ่มสำเร็จ
    return {
      success: true,
      message: "เพิ่มวิธีการชำระเงินสำเร็จ",
      paymentMethod: {
        id: "CARD" + Math.floor(Math.random() * 1000),
        type: "Card",
        lastFour: "****",
        expiry: paymentData.expiry || "12/25",
        isDefault: false,
      },
    }
  },

  deletePaymentMethod: async (paymentId) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 600))

    // จำลองการลบสำเร็จ
    return {
      success: true,
      message: "ลบวิธีการชำระเงินสำเร็จ",
    }
  },

  setDefaultPaymentMethod: async (paymentId) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // จำลองการอัพเดทสำเร็จ
    return {
      success: true,
      message: "ตั้งค่าวิธีการชำระเงินเริ่มต้นสำเร็จ",
    }
  },

  // API คลาสเรียน
  getUpcomingClasses: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 700))

    // ส่งข้อมูลจำลอง
    return [
      {
        id: "CLS001",
        title: "Class",
        studio: "Studio A",
        instructor: "Moo Deng",
        date: "17 Feb 2025",
        time: "16:00 - 17:30",
      },
      {
        id: "CLS002",
        title: "Class",
        studio: "Studio B",
        instructor: "Lebron James",
        date: "18 Feb 2025",
        time: "16:00 - 17:30",
      },
      {
        id: "CLS003",
        title: "Class",
        studio: "Studio A",
        instructor: "Christina Sae-tae",
        date: "19 Feb 2025",
        time: "16:00 - 17:30",
      },
    ]
  },

  cancelClassRegistration: async (classId) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 600))

    // จำลองการยกเลิกสำเร็จ
    return {
      success: true,
      message: "ยกเลิกการลงทะเบียนคลาสสำเร็จ",
    }
  },

  // API เทรนเนอร์
  getTrainers: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 800))

    // ส่งข้อมูลจำลอง
    return [
      {
        id: "TRN001",
        name: "John Cena",
        specialty: "---",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.8,
        reviewCount: 24,
        avatar: "/placeholder.svg?height=80&width=80",
        userReview:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, laoreet lectus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
      },
      {
        id: "TRN002",
        name: "John Cena",
        specialty: "---",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.8,
        reviewCount: 24,
        avatar: "/placeholder.svg?height=80&width=80",
        userReview:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, laoreet lectus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
      },
      {
        id: "TRN003",
        name: "John Cena",
        specialty: "---",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis ante lacinia, laoreet arcu rhoncus, tempus tellus. Nam vulputate tellus velit, eu rhoncus sapien tincidunt at.",
        rating: 4.8,
        reviewCount: 24,
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ]
  },

  rateTrainer: async (trainerId, rating, review) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 700))

    // จำลองการให้คะแนนสำเร็จ
    return {
      success: true,
      message: "ให้คะแนนเทรนเนอร์สำเร็จ",
      data: {
        trainerId,
        rating,
        review,
      },
    }
  },

  // API ประวัติ
  getGymVisitHistory: async (page = 1, limit = 10) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 600))

    // สร้างข้อมูลจำลอง
    const visits = Array(limit)
      .fill()
      .map((_, i) => ({
        id: `VST${i + 1 + (page - 1) * limit}`,
        date: "12-01-2025",
        time: "08:15 - 09:30",
        duration: "2h 15m",
        type: "Regular visit",
      }))

    return {
      data: visits,
      pagination: {
        page,
        limit,
        total: 50,
        hasMore: page * limit < 50,
      },
    }
  },

  getPaymentHistory: async (page = 1, limit = 10) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 600))

    // สร้างข้อมูลจำลอง
    const payments = Array(limit)
      .fill()
      .map((_, i) => ({
        id: `PMT${i + 1 + (page - 1) * limit}`,
        date: "12-01-2025",
        description: "Monthly Membership - October 2023",
        amount: "฿1,500",
        method: "Credit Card",
        invoiceUrl: "#",
      }))

    return {
      data: payments,
      pagination: {
        page,
        limit,
        total: 50,
        hasMore: page * limit < 50,
      },
    }
  },

  getActivitySummary: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // ส่งข้อมูลจำลอง
    return {
      totalVisits: 24,
      classAttendance: 12,
      totalHours: 36.5,
      totalSpent: "฿4,500",
      period: "Last 3 months",
    }
  },
}
