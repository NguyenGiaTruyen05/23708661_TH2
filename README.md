NGUYEN GIA TRUYEN | MSSV: 23708661 | Clone HTTPS: https://github.com/NguyenGiaTruyen05/23708661_TH2.git | STAMP: #109116 | LAST_DIGIT: 1 | VARIANT: watermark-below, phone-login, shop-first, selection-haptic, ship-B, detail-card

# BKT2 KTXGo - 23708661

Ứng dụng KTXGo được xây dựng bằng React Native CLI + TypeScript cho Bài kiểm tra thực hành 2.

## Thông tin sinh viên

- Họ tên: NGUYEN GIA TRUYEN
- MSSV: 23708661
- Stamp: #109116
- Số cuối MSSV: 1
- Phòng giao demo: P.361

## Variant

- Watermark: phía dưới màn hình
- Đăng nhập: số điện thoại
- Tab order: Shop → Giỏ → Tôi
- Haptic khi thêm sản phẩm: selection
- Công thức phí ship: B
- Detail presentation: card

## Công nghệ sử dụng

- React Native CLI + TypeScript
- React Navigation: Stack + Bottom Tabs
- FlashList
- Zustand + AsyncStorage persist
- TanStack Query
- Axios instance + interceptor
- react-native-permissions
- react-native-geolocation-service
- react-native-haptic-feedback

## Chức năng chính

### Đăng nhập

- Đăng nhập bằng số điện thoại.
- Lưu trạng thái đăng nhập bằng Zustand persist.
- Hiển thị họ tên, MSSV và stamp.

### Shop

- Danh sách sản phẩm bằng FlashList 2 cột.
- Tìm kiếm có debounce theo giá trị sinh viên.
- Pull-to-refresh.
- Loading, error và empty state.
- Thêm nhanh sản phẩm vào giỏ bằng nút `+`.
- Haptic theo VARIANT.

### Chi tiết sản phẩm

- Hiển thị hình ảnh, tên, giá và mô tả.
- Hiển thị chi tiết sản phẩm dạng card.
- Nút Thêm vào giỏ.
- Zustand dùng chung với màn hình Shop.
- Haptic khi thêm vào giỏ.
- Alert có MSSV.

### Giỏ hàng

- Hiển thị danh sách sản phẩm trong giỏ.
- Tăng / giảm số lượng.
- Xóa sản phẩm.
- Tính tổng tiền hàng.
- Tính phí giao hàng khi đã có vị trí.
- Hiển thị `Giao đến P.361`.
- Giỏ hàng được persist bằng AsyncStorage.

### Vị trí và phí giao hàng

- Xin quyền Location runtime.
- Xử lý các trạng thái granted, denied và blocked.
- Khi blocked có nút `Mở Cài đặt`.
- Tính khoảng cách bằng Haversine.
- Tính phí giao hàng theo công thức B từ dữ liệu sinh viên.
- Có thể mock tọa độ trên Android Emulator để kiểm thử.

## Công thức dữ liệu theo MSSV

Các giá trị debounce, stale time, hệ số giá, phí ship nền, phòng giao và variant được sinh từ `src/constants/student.ts` theo quy định của đề.

```text
DEBOUNCE_MS = 400
STALE_TIME_MS = 11000
PRICE_MULTIPLIER = 25500
BASE_SHIP_FEE = 9000
ROOM_LABEL = P.361
BANNER_IMAGE_ID = 261