---
name: react-to-svelte-port
description: Use when writing Svelte 5 primitive components from an analyzed React/Base UI source breakdown. Applies this project's conventions — class-based state in .svelte.ts, actions instead of ref+effect, snippets instead of render props, Base UI–style data-attributes preserved for styling.
---

# React → Svelte: Port to code

Input: bảng phân tích logic (từ skill react-to-svelte-analyze) hoặc source React trực tiếp nếu đơn giản.
Output: code Svelte 5 theo ĐÚNG convention sau, không tự sáng tạo pattern khác.

## Convention bắt buộc
- State phức tạp (nhiều field, có effect nội bộ) → viết bằng CLASS trong file `*-state.svelte.ts`, field là `$state`, không dùng getter/setter thủ công kiểu factory function.
- State đơn giản 1-2 biến → `$state` trực tiếp trong `<script>`, không cần tách class.
- `useMemo` → `$derived`.
- `useEffect` → `$effect`, giữ nguyên logic cleanup (return function).
- `useLayoutEffect` → `$effect.pre`, chỉ dùng khi thực sự cần đo DOM trước paint.
- Context (Root chia state cho con) → `setContext`/`getContext`, key là Symbol đặt tên rõ ràng.
- DOM behavior thủ công (focus trap, click-outside, portal, scroll-into-view) → viết thành Svelte ACTION riêng trong `actions/`, KHÔNG inline trong component.
- `render` prop / `asChild` → Svelte snippet (`{#snippet}` / `{@render}`).
- `mergeProps` (compose event handler, class, style) → dùng util `mergeProps` có sẵn trong `utils/merge-props.ts`, không viết lại logic merge mỗi lần.
- BỎ QUA hoàn toàn: `useForkRef`, `useEventCallback`, bất kỳ pattern nào chỉ tồn tại để né vấn đề riêng của React.
- Giữ nguyên `data-state`/`data-*` attribute convention của Base UI — đây là hook để CSS/Tailwind style theo state, không đổi tên.

## Cấu trúc file output
primitives/<component>/
  <component>-state.svelte.ts   (class state, nếu cần)
  Root.svelte
  <Part>.svelte  (mỗi compound part 1 file)

## Sau khi viết xong
- Tự review: có chỗ nào còn sót logic React (ví dụ dependency array kiểu useEffect còn sót trong comment) không.
- Note lại nếu có phần cần `@floating-ui/dom` hoặc `@tanstack/*` (theo quy tắc đã thống nhất: chỉ dùng lib ngoài cho phần data/positioning logic, không dùng cho component behavior).
