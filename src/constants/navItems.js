import { SECTION_ID } from "./routePaths";

// Liên kết điều hướng trên Navbar — trỏ tới các section trong trang Home.
export const NAV_ITEMS = [
  { label: "Tính năng", href: `#${SECTION_ID.FEATURES}` },
  { label: "Cách hoạt động", href: `#${SECTION_ID.HOW_IT_WORKS}` },
  { label: "Bảng giá", href: `#${SECTION_ID.PRICING}` },
  { label: "FAQ", href: `#${SECTION_ID.FAQ}` },
  { label: "Liên hệ", href: `#${SECTION_ID.CONTACT}` },
];
