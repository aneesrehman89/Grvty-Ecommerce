// Small stroke icon set shared across the storefront (keeps markup tidy)
const base = (path, props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    {path}
  </svg>
);

export const CartIcon = (p) =>
  base(
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    p
  );
export const SearchIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />, p);
export const UserIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0" />, p);
export const CloseIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 18L18 6M6 6l12 12" />, p);
export const MenuIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 6h16M4 12h16M4 18h16" />, p);
export const ChevronLeft = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" />, p);
export const ChevronRight = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18l6-6-6-6" />, p);
export const ChevronDown = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />, p);
export const TrashIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3" />, p);
export const FilterIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 6h16M7 12h10M10 18h4" />, p);
export const TruckIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 8h11v8H3V8zm11 3h4l3 3v2h-7v-5zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />, p);
export const ReturnIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0112-4.5M19 15a7 7 0 01-12 4.5" />, p);
export const ShieldIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />, p);
export const CheckIcon = (p) =>
  base(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />, p);
