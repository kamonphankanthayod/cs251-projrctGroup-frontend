/**
 * Mock API สำหรับระบบจัดการสมาชิกฟิตเนส
 * ไฟล์นี้มีฟังก์ชัน Mock API ที่จำลองการเรียก API จาก Backend
 * ทีม Backend สามารถแทนที่ฟังก์ชันเหล่านี้ด้วย API จริงได้
 */

const API = {
  // API ข้อมูลผู้ใช้
  getUserProfile: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // ส่งข้อมูลจำลอง
    return {
      id: "USR12345",
      name: "John Cena",
      email: "john.cena@mailbox.com",
      phone: "0686644959",
      address: "99/9 Moo ping",
      birthDate: "18 Feb 1990",
      profileImage: "/placeholder.svg?height=120&width=120",
      membershipType: "Premium Member",
    }
  },

  updateUserProfile: async (userData) => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 800))

    // จำลองการอัพเดทสำเร็จ
    return {
      success: true,
      message: "อัพเดทโปรไฟล์สำเร็จ",
      data: userData,
    }
  },

  // API ข้อมูลสมาชิก
  getMembershipDetails: async () => {
    // จำลองการหน่วงเวลาเรียก API
    await new Promise((resolve) => setTimeout(resolve, 600))

    // ส่งข้อมูลจำลอง
    return {
      id: "FIT-8482",
      type: "Gold",
      startDate: "January 2025",
      expiryDate: "December 31, 2025",
      billingCycle: "Monthly automatic renewal",
      nextBillingDate: "December 31, 2023",
      benefits: [
        "เข้าใช้บริการฟิตเนสได้ตลอด 24/7",
        "คลาสกลุ่มฟรี",
        "ปรึกษาเทรนเนอร์ส่วนตัว (2 ครั้ง/เดือน)",
        "เข้าถึงอุปกรณ์พรีเมียม",
        "บริการผ้าเช็ดตัว",
        "ล็อคเกอร์ส่วนตัวฟรี",
      ],
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
