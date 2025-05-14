const API_BASE = 'http://localhost:8080';
const memberId = localStorage.getItem('memberId');

const API = {
    getUserProfile: async () => {
        const res = await fetch(`${API_BASE}/member/${memberId}`);
        return res.json();
    },
    updateUserProfile: async (formData) => {
        const payload = Object.fromEntries(formData.entries());
        const res = await fetch(`${API_BASE}/member/${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return res.json();
    },
    getMembershipDetails: async () => {
        const res = await fetch(`${API_BASE}/member/${memberId}`);
        const data = await res.json();
        return data.membership;
    },
    changeMembershipPlan: async (planId) => {
        const res = await fetch(`${API_BASE}/member/update-membership/${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId }),
        });
        return res.json();
    },
    cancelMembership: async () => {
        const res = await fetch(`${API_BASE}/member/update-membership/${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId: 'standard' }),
        });
        return res.json();
    },
    getPaymentMethods: async () => {
        const res = await fetch(`${API_BASE}/payment/get-by-member/${memberId}`);
        return res.json();
    },
    addPaymentMethod: async (data) => {
        const payload = { ...data, memberId };
        const res = await fetch(`${API_BASE}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return res.json();
    },
    setDefaultPaymentMethod: async (paymentId) => {
        const res = await fetch(`${API_BASE}/payment/${paymentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDefault: true }),
        });
        return res.json();
    },
    deletePaymentMethod: async (paymentId) => {
        const res = await fetch(`${API_BASE}/payment/${paymentId}`, {
            method: 'DELETE' });
        return res.json();
    },
};

// ส่วนที่เหลือของ profile.js ใช้ API ตามด้านบนแทน mock และปรับตามที่เชื่อมจริง
// เช่น loadUserProfile(), loadMembershipDetails(), loadPaymentMethods(), updateUserProfile() เป็นต้น
// โค้ดเดิมสามารถใช้ต่อได้โดยไม่ต้องแก้ไข HTML เพราะ API ตอนนี้เรียกของจริงแล้ว

// โหลดข้อมูลผู้ใช้เมื่อหน้าเว็บโหลด
window.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadMembershipDetails();
    loadPaymentMethods();
    loadMembershipHistory();
    setupMembershipTabs();
    setupEditProfileButton();
    setupProfileImageUpload();
    setupChangePlanButton();
    setupCancelMembershipButton();
    setupAddPaymentButton();
});

