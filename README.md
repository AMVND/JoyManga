# JoyManga

Web đọc truyện tranh (ReactJS + Bootstrap) dùng API mở của [MangaDex](https://api.mangadex.org/docs/). Giao diện đơn giản, responsive (điện thoại → máy tính), có chế độ sáng/tối, tiếng Việt / English.

## Tính năng
- Trang chủ: truyện mới cập nhật, lọc theo thể loại và theo ngôn ngữ chương, phân trang
- Tìm truyện theo tên
- Trang truyện: ảnh bìa, tác giả, thể loại, mô tả, danh sách chương (chọn ngôn ngữ, sắp xếp, phân trang)
- Trang đọc: cuộn dọc, chế độ tiết kiệm dữ liệu, chương trước/sau, tải lại ảnh lỗi
- "Đọc tiếp" (lưu trong trình duyệt)

## Chạy / triển khai
```bash
cd frontend
npm install
npm start          # chạy thử
npm test           # test hàm tiện ích
npm run deploy     # build + đẩy lên GitHub Pages
```

## Cấu trúc `frontend/src`
- `api/mangadex.js` – toàn bộ lời gọi API (muốn đổi nguồn truyện chỉ sửa file này)
- `utils/manga.js` – hàm thuần (chọn tiêu đề theo ngôn ngữ, link bìa…), có test
- `hooks/useAsync.js` – gọi API kèm hủy request cũ + nút thử lại
- `components/`, `pages/` – giao diện
