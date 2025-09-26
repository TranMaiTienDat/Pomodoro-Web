Ứng dụng Pomodoro đơn giản xây dựng bằng [Next.js](https://nextjs.org).

## Chạy dự án

Chạy máy chủ phát triển:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để sử dụng.

Bạn có thể sửa giao diện hoặc logic trong `src/components/PomodoroTimer.tsx` hoặc trang `src/app/page.tsx`. Trang sẽ tự động cập nhật khi lưu file.

Project sử dụng [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) để tối ưu phông chữ [Geist](https://vercel.com/font).

## Tính năng

- Hẹn giờ Pomodoro với các pha: Làm việc, Nghỉ ngắn, Nghỉ dài
- Tự động chuyển pha, có tuỳ chọn tự động bắt đầu pha tiếp theo
- Tuỳ chỉnh thời lượng và số phiên trước khi nghỉ dài
- Lưu cài đặt vào LocalStorage
- Thông báo trình duyệt và âm báo ngắn khi kết thúc phiên

## Ghi chú

- Bạn có thể bật thông báo của trình duyệt khi được hỏi hoặc trong phần “Bật thông báo trình duyệt”.
- Nếu âm thanh không phát, hãy nhấn nút Bắt đầu để kích hoạt audio (trình duyệt yêu cầu tương tác người dùng).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
