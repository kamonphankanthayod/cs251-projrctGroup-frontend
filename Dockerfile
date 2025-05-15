# Dockerfile
FROM nginx:alpine

# คัดลอกไฟล์ทุกอย่างจาก Frontend/public/ ไปไว้ใน nginx
COPY Frontend/public/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
