import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BRAND = "NEXTURN";
const FAVICON_PATH = "/images/Screenshot_2026-03-18_182531-removebg-preview.png";

const getPageTitle = (pathname) => {
  if (pathname === "/") return `Home | ${BRAND}`;
  if (pathname.startsWith("/about-us")) return `About Us | ${BRAND}`;
  if (pathname.startsWith("/products")) return `Products | ${BRAND}`;
  if (pathname.startsWith("/quality-inspection")) return `Quality Inspection | ${BRAND}`;
  if (pathname.startsWith("/contact-us")) return `Contact Us | ${BRAND}`;
  if (pathname.startsWith("/gallery")) return `Gallery | ${BRAND}`;
  if (pathname.startsWith("/technology")) return `Technology | ${BRAND}`;
  if (pathname.startsWith("/product-list")) return `Product List | ${BRAND}`;
  if (pathname.startsWith("/product-details")) return `Product Details | ${BRAND}`;

  if (pathname.startsWith("/admin/login")) return `Admin Login | ${BRAND}`;
  if (pathname.startsWith("/admin")) return `Admin Panel | ${BRAND}`;

  return BRAND;
};

const MetaTags = () => {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  useEffect(() => {
    document.title = title;

    const rels = ["icon", "shortcut icon", "apple-touch-icon"];

    rels.forEach((rel) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }

      if (rel !== "apple-touch-icon") {
        link.setAttribute("type", "image/png");
      }
      link.setAttribute("href", FAVICON_PATH);
    });
  }, [title]);

  return null;
};

export default MetaTags;
