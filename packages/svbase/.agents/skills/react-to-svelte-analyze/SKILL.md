---
name: react-to-svelte-analyze
description: Use when analyzing a downloaded React/Base UI repo to extract state logic before porting to Svelte 5. Reads hook-based component source and produces a structured breakdown (state, effects, context, DOM behavior) independent of React syntax.
---

# React → Svelte: Analyze source

Khi được giao 1 file/thư mục React component (thường từ repo Base UI/Radix đã clone về local), nhiệm vụ là bóc tách LOGIC, không quan tâm cú pháp React.

## Việc cần làm
1. Đọc source, phân loại từng phần theo bảng:
   - State: mọi `useState`/`useReducer` → tên biến, giá trị khởi tạo, nơi được set
   - Derived: mọi `useMemo` → công thức tính, phụ thuộc gì
   - Effect: mọi `useEffect`/`useLayoutEffect` → chạy khi nào, làm gì, cleanup gì
   - Context: state nào được share xuống component con qua Context
   - DOM behavior: đoạn nào thao tác trực tiếp DOM (focus, scroll, measure, event listener thủ công) — đây là ứng viên cho Svelte action
   - Ref forwarding: chỗ nào dùng `useForkRef`/`forwardRef` — ghi chú nhưng đánh dấu "React-only, không cần port" (theo lý do đã thống nhất: Svelte không có giới hạn 1-ref này)
   - React-only utility: `useEventCallback`, `useForkRef` → đánh dấu bỏ qua, không port

2. Output ra dạng bảng/markdown, KHÔNG viết code Svelte ở bước này — chỉ mô tả logic thuần.

3. Nếu phát hiện thư viện phụ thuộc ngoài (ví dụ `@floating-ui/react`), ghi chú rõ để dùng bản tương đương framework-agnostic (`@floating-ui/dom`) thay vì tự port.

## Không làm
- Không viết code `.svelte` ở bước này.
- Không quyết định tên biến/convention Svelte — đó là việc của skill `react-to-svelte-port`.
