"use client";

import React from "react";
import {
  ShoppingCart,
  Search,
  User,
  Star,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { DesignChoice } from "@/lib/metrics";

interface ShoppingWebsiteProps {
  designChoices: DesignChoice[];
  onElementClick?: (elementName: string) => void;
}

// Helper to get style based on design choices
function getStyleForElement(
  element: string,
  action: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === action,
  );
  if (!choice) return "";

  // Map values to CSS classes
  const styleMap: Record<string, Record<string, string>> = {
    // Colors
    "Change Color": {
      Green: "bg-green-600 hover:bg-green-700",
      Orange: "bg-orange-500 hover:bg-orange-600",
      Red: "bg-red-600 hover:bg-red-700",
      Blue: "bg-blue-600 hover:bg-blue-700",
      Purple: "bg-purple-600 hover:bg-purple-700",
      Black: "text-gray-900",
      "Dark Blue": "text-blue-900",
      "Brand Color": "text-indigo-600",
      Light: "bg-white text-gray-800",
      Dark: "bg-gray-900 text-white",
      Transparent: "bg-transparent text-gray-800",
    },
    // Sizes
    "Change Size": {
      Small: "text-sm py-1 px-2",
      Medium: "text-base py-2 px-4",
      Large: "text-lg py-3 px-6",
      "Extra Large": "text-xl py-4 px-8",
      "Full Screen": "min-h-screen",
    },
    // Fonts
    "Change Font": {
      Sans: "font-sans",
      Serif: "font-serif",
      Bold: "font-bold",
      Light: "font-light",
    },
  };

  return styleMap[action]?.[choice.value] || "";
}

function getTextForElement(
  element: string,
  designChoices: DesignChoice[],
): string | null {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change Text",
  );
  return choice?.value || null;
}

function getPositionForElement(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change Position",
  );
  if (!choice) return "";

  const positionMap: Record<string, string> = {
    // Checkout button positions
    "Top Right": "checkout-top-right",
    Center: "checkout-center",
    "Bottom Right": "checkout-bottom-right",
    Sticky: "checkout-sticky",
    // Add to Cart positions
    "Below Price": "cart-below-price",
    "Next to Image": "cart-next-image",
    Floating: "cart-floating",
    "Bottom of Card": "cart-bottom-card",
    // Other positions
    "Above Image": "order-first",
    "Below Image": "order-last",
    "Overlay on Image":
      "absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded",
    Centered: "text-center",
    Top: "sticky top-0 z-10",
    "Left Side": "w-64 shrink-0",
    Hidden: "hidden",
    "Near Checkout": "",
    Footer: "mt-8",
    Header: "mb-4",
    "Product Page": "",
    // Hero banner positions
    "Top of Page": "hero-top",
    "After Navigation": "hero-after-nav",
    "Mid Page": "hero-mid",
    // Price positions
    "Next to Title": "price-next-title",
    "Below Title": "price-below-title",
    "Near Button": "price-near-button",
    Prominent: "price-prominent",
  };

  return positionMap[choice.value] || "";
}

function getVisibilityForElement(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change Visibility",
  );
  if (!choice) return "";

  const visibilityMap: Record<string, string> = {
    Hidden: "hidden",
    Subtle: "opacity-50 scale-75",
    Prominent: "opacity-100 scale-100",
    "Very Prominent": "opacity-100 scale-110",
  };

  return visibilityMap[choice.value] || "";
}

function getBadgeForElement(
  element: string,
  designChoices: DesignChoice[],
): string | null {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Add Badge",
  );
  if (!choice || choice.value === "No Badge") return null;

  const badgeMap: Record<string, string> = {
    "Sale Badge": "SALE",
    "New Badge": "NEW",
    "Best Seller": "BEST SELLER",
  };

  return badgeMap[choice.value] || null;
}

function getBorderForElement(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change Border",
  );
  if (!choice) return "";

  const borderMap: Record<string, string> = {
    None: "",
    Subtle: "border border-gray-200",
    Rounded: "rounded-xl overflow-hidden",
    Shadow: "shadow-lg rounded-lg",
  };

  return borderMap[choice.value] || "";
}

function getStyleForElement2(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change Style",
  );
  if (!choice) return "";

  const styleMap: Record<string, string> = {
    // Navigation styles
    Minimal: "text-sm",
    Standard: "nav-standard",
    "Mega Menu": "text-base",
    Hamburger: "",
    // Hero banner styles
    "Image Only": "hero-image-only",
    "Image with Text": "hero-image-text",
    "Video Background": "hero-video-bg",
    Carousel: "hero-carousel",
    // Product image styles
    "With Zoom": "image-zoom",
    "360 View": "image-360",
    Gallery: "image-gallery",
    // Trust badge styles
    Icons: "",
    "Icons with Text": "",
    Text: "",
    Colorful: "",
  };

  return styleMap[choice.value] || "";
}

function getSearchStyleForElement(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Show Search",
  );
  if (!choice) return "";

  const searchMap: Record<string, string> = {
    Prominent: "w-96",
    "Icon Only": "w-10",
    Hidden: "hidden",
    Expandable: "w-10 focus-within:w-64 transition-all",
  };

  return searchMap[choice.value] || "";
}

function getDiscountStyleForElement(
  element: string,
  designChoices: DesignChoice[],
): { showOriginal: boolean; showPercent: boolean; showAmount: boolean } {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Show Discount",
  );
  if (!choice)
    return { showOriginal: false, showPercent: false, showAmount: false };

  return {
    showOriginal: choice.value === "Show Original Price",
    showPercent: choice.value === "Show Percentage Off",
    showAmount: choice.value === "Show Amount Saved",
  };
}

function getCTATextForElement(
  element: string,
  designChoices: DesignChoice[],
): string {
  const choice = designChoices.find(
    (c) => c.object === element && c.action === "Change CTA",
  );
  return choice?.value || "Shop Now";
}

export default function ShoppingWebsite({
  designChoices,
  onElementClick,
}: ShoppingWebsiteProps) {
  // Get styles for various elements
  const checkoutColorStyle =
    getStyleForElement("Checkout Button", "Change Color", designChoices) ||
    "bg-indigo-600 hover:bg-indigo-700";
  const checkoutSizeStyle =
    getStyleForElement("Checkout Button", "Change Size", designChoices) ||
    "py-2 px-4";
  const checkoutText =
    getTextForElement("Checkout Button", designChoices) || "Checkout";
  const checkoutPosition = getPositionForElement(
    "Checkout Button",
    designChoices,
  );

  const addToCartColorStyle =
    getStyleForElement("Add to Cart Button", "Change Color", designChoices) ||
    "bg-indigo-600 hover:bg-indigo-700";
  const addToCartSizeStyle =
    getStyleForElement("Add to Cart Button", "Change Size", designChoices) ||
    "py-2 px-4";
  const addToCartText =
    getTextForElement("Add to Cart Button", designChoices) || "Add to Cart";
  const addToCartPosition = getPositionForElement(
    "Add to Cart Button",
    designChoices,
  );

  const titleSizeStyle =
    getStyleForElement("Product Title", "Change Size", designChoices) ||
    "text-lg";
  const titleColorStyle =
    getStyleForElement("Product Title", "Change Color", designChoices) ||
    "text-gray-900";
  const titleFontStyle =
    getStyleForElement("Product Title", "Change Font", designChoices) ||
    "font-semibold";

  const priceSizeStyle =
    getStyleForElement("Product Price", "Change Size", designChoices) ||
    "text-lg";
  const priceColorStyle =
    getStyleForElement("Product Price", "Change Color", designChoices) ||
    "text-gray-900";
  const pricePosition = getPositionForElement("Product Price", designChoices);
  const discountStyle = getDiscountStyleForElement(
    "Product Price",
    designChoices,
  );

  const heroBannerSize = getStyleForElement(
    "Hero Banner",
    "Change Size",
    designChoices,
  );
  const heroBannerPosition = getPositionForElement(
    "Hero Banner",
    designChoices,
  );
  const heroBannerStyle = getStyleForElement2("Hero Banner", designChoices);
  const heroCTA = getCTATextForElement("Hero Banner", designChoices);

  const navColorStyle =
    getStyleForElement("Navigation", "Change Color", designChoices) ||
    "bg-white";
  const navPosition = getPositionForElement("Navigation", designChoices);
  const navSearchStyle =
    getSearchStyleForElement("Navigation", designChoices) || "w-64";

  const imageSize = getStyleForElement(
    "Product Image",
    "Change Size",
    designChoices,
  );
  const imageStyle = getStyleForElement2("Product Image", designChoices);
  const imageBorder = getBorderForElement("Product Image", designChoices);
  const imageBadge = getBadgeForElement("Product Image", designChoices);

  const trustVisibility = getVisibilityForElement(
    "Trust Badges",
    designChoices,
  );
  const trustPosition = getPositionForElement("Trust Badges", designChoices);

  // Sample products
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 234,
      image: "🎧",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 299.99,
      originalPrice: 349.99,
      rating: 4.6,
      reviews: 567,
      image: "⌚",
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.7,
      reviews: 189,
      image: "🔊",
    },
    {
      id: 4,
      name: "Ergonomic Laptop Stand",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 312,
      image: "💻",
    },
  ];

  const isLeftNavigation = navPosition === "w-64 shrink-0";

  const handleElementClick = (elementName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onElementClick) {
      onElementClick(elementName);
    }
  };

  return (
    <div
      className={`bg-gray-50 min-h-full ${isLeftNavigation ? "flex" : ""}`}
      id="shopping-website"
    >
      {/* Navigation */}
      {navPosition !== "hidden" && (
        <nav
          onClick={(e) => handleElementClick("Navigation", e)}
          className={`${navColorStyle} shadow-sm border-b border-gray-200 ${navPosition} ${isLeftNavigation ? "border-b-0 border-r" : ""} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
        >
          <div className={isLeftNavigation ? "p-4" : "max-w-7xl mx-auto px-4"}>
            <div
              className={`flex items-center ${isLeftNavigation ? "flex-col space-y-4" : "justify-between h-16"}`}
            >
              <div
                className={`flex items-center ${isLeftNavigation ? "flex-col space-y-2" : "space-x-8"}`}
              >
                <span className="text-xl font-bold text-indigo-600">
                  TechStore
                </span>
                <div
                  className={`${isLeftNavigation ? "flex flex-col space-y-2" : "hidden md:flex space-x-6"}`}
                >
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Products
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Categories
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Deals
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Support
                  </a>
                </div>
              </div>
              {!isLeftNavigation && (
                <div className="flex items-center space-x-4">
                  {navSearchStyle !== "hidden" && (
                    <div className={`relative ${navSearchStyle}`}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <User className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <div className={isLeftNavigation ? "flex-1 overflow-y-auto" : ""}>
        {/* Hero Banner - Top of Page or After Navigation */}
        {heroBannerPosition !== "hidden" && (heroBannerPosition === "hero-top" || heroBannerPosition === "hero-after-nav" || heroBannerPosition === "") && (
          <div
            onClick={(e) => handleElementClick("Hero Banner", e)}
            className={`${
              heroBannerStyle === "hero-image-only" ? "bg-cover bg-center" :
              heroBannerStyle === "hero-video-bg" ? "bg-black relative" :
              heroBannerStyle === "hero-carousel" ? "relative" :
              "bg-gradient-to-r from-indigo-600 to-purple-600"
            } text-white ${
              heroBannerSize === "text-sm py-1 px-2" ? "py-8" :
              heroBannerSize === "text-base py-2 px-4" ? "py-16" :
              heroBannerSize === "text-lg py-3 px-6" ? "py-24" :
              heroBannerSize === "text-xl py-4 px-8" ? "min-h-screen flex items-center" :
              "py-16"
            } ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-white hover:ring-inset transition-all" : ""}`}
            style={heroBannerStyle === "hero-image-only" ? {backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%236366f1%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E')"} : {}}
          >
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              {heroBannerStyle === "hero-video-bg" && (
                <div className="absolute inset-0 opacity-50">
                  <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900 animate-pulse"></div>
                </div>
              )}
              <div className="flex flex-col md:flex-row items-center justify-between relative">
                {(heroBannerStyle !== "hero-image-only") && (
                  <div className="mb-8 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      Summer Sale
                    </h1>
                    <p className="text-xl mb-6 text-indigo-100">
                      Up to 50% off on selected items
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                      {heroCTA}
                    </button>
                  </div>
                )}
                {(heroBannerStyle === "hero-image-text" || heroBannerStyle === "" || !heroBannerStyle) && (
                  <div className="text-8xl">🛍️</div>
                )}
                {heroBannerStyle === "hero-carousel" && (
                  <div className="flex space-x-2 mt-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges - Header Position */}
        {(trustPosition === "mb-4" ||
          (trustPosition === "" && trustVisibility !== "hidden")) && (
          <div
            onClick={(e) => handleElementClick("Trust Badges", e)}
            className={`bg-gray-100 py-3 border-b ${trustVisibility} ${trustPosition} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Banner - Mid Page */}
          {heroBannerPosition === "hero-mid" && (
            <div
              onClick={(e) => handleElementClick("Hero Banner", e)}
              className={`mb-8 ${
                heroBannerStyle === "hero-image-only" ? "bg-cover bg-center" :
                heroBannerStyle === "hero-video-bg" ? "bg-black relative" :
                heroBannerStyle === "hero-carousel" ? "relative" :
                "bg-gradient-to-r from-indigo-600 to-purple-600"
              } text-white ${
                heroBannerSize === "text-sm py-1 px-2" ? "py-8" :
                heroBannerSize === "text-base py-2 px-4" ? "py-16" :
                heroBannerSize === "text-lg py-3 px-6" ? "py-24" :
                heroBannerSize === "text-xl py-4 px-8" ? "py-32" :
                "py-16"
              } rounded-lg ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-white hover:ring-inset transition-all" : ""}`}
              style={heroBannerStyle === "hero-image-only" ? {backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%236366f1%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E')"} : {}}
            >
              <div className="px-4 relative z-10">
                {heroBannerStyle === "hero-video-bg" && (
                  <div className="absolute inset-0 opacity-50 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900 animate-pulse"></div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  {(heroBannerStyle !== "hero-image-only") && (
                    <div className="mb-8 md:mb-0">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Summer Sale
                      </h1>
                      <p className="text-xl mb-6 text-indigo-100">
                        Up to 50% off on selected items
                      </p>
                      <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                        {heroCTA}
                      </button>
                    </div>
                  )}
                  {(heroBannerStyle === "hero-image-text" || heroBannerStyle === "" || !heroBannerStyle) && (
                    <div className="text-8xl">🛍️</div>
                  )}
                  {heroBannerStyle === "hero-carousel" && (
                    <div className="flex space-x-2 mt-4">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${imageBorder} ${addToCartPosition === "cart-next-image" ? "flex" : ""} relative`}
              >
                {/* Product Image with potential button next to it */}
                <div className={`${addToCartPosition === "cart-next-image" ? "flex-shrink-0" : ""}`}>
                  <div
                    onClick={(e) => handleElementClick("Product Image", e)}
                    className={`relative bg-gray-100 p-8 text-center ${imageSize} ${
                      imageStyle === "image-zoom" ? "overflow-hidden group" :
                      imageStyle === "image-360" ? "overflow-hidden relative" :
                      imageStyle === "image-gallery" ? "relative" :
                      ""
                    } ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
                  >
                    <span className={`text-6xl ${
                      imageStyle === "image-zoom" ? "group-hover:scale-125 transition-transform duration-300" :
                      imageStyle === "image-360" ? "inline-block hover:rotate-45 transition-transform duration-500" :
                      ""
                    }`}>
                      {product.image}
                    </span>
                    {imageBadge && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {imageBadge}
                      </span>
                    )}
                    {imageStyle === "image-360" && (
                      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                        360°
                      </div>
                    )}
                    {imageStyle === "image-gallery" && (
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button - Next to Image */}
                {addToCartPosition === "cart-next-image" && (
                  <div className="flex items-center p-4">
                    <button
                      onClick={(e) => handleElementClick("Add to Cart Button", e)}
                      className={`text-white rounded-lg transition-colors ${addToCartColorStyle} ${addToCartSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
                    >
                      {addToCartText}
                    </button>
                  </div>
                )}

                {/* Product Info */}
                <div className={`p-4 ${addToCartPosition === "cart-bottom-card" ? "flex flex-col h-full" : ""}`}>
                  {/* Title and Price Container */}
                  <div className={`${pricePosition === "price-next-title" ? "flex items-center justify-between mb-2" : ""}`}>
                    <h3
                      onClick={(e) => handleElementClick("Product Title", e)}
                      className={`${titleSizeStyle} ${titleColorStyle} ${titleFontStyle} ${pricePosition === "price-next-title" ? "" : "mb-2"} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded" : ""}`}
                    >
                      {product.name}
                    </h3>

                    {/* Price - Next to Title */}
                    {pricePosition === "price-next-title" && (
                      <div
                        onClick={(e) => handleElementClick("Product Price", e)}
                        className={`${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded" : ""}`}
                      >
                        <span className={`${priceSizeStyle} ${priceColorStyle} font-bold`}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price - Default and Other Positions */}
                  {pricePosition !== "price-next-title" && (
                    <div
                      onClick={(e) => handleElementClick("Product Price", e)}
                      className={`${
                        pricePosition === "price-near-button" ? "mb-2" :
                        pricePosition === "price-prominent" ? "mb-4 text-2xl font-bold" :
                        pricePosition === "price-below-title" ? "mb-4" :
                        "mb-4"
                      } ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded inline-block" : ""}`}
                    >
                      <span className={`${priceSizeStyle} ${priceColorStyle} font-bold`}>
                        ${product.price.toFixed(2)}
                      </span>
                      {discountStyle.showOriginal && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {discountStyle.showPercent && (
                        <span className="text-sm text-green-600 ml-2">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                      {discountStyle.showAmount && (
                        <span className="text-sm text-green-600 ml-2">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button - Below Price (default) and Bottom of Card */}
                  {addToCartPosition !== "cart-next-image" && addToCartPosition !== "cart-floating" && (
                    <button
                      onClick={(e) => handleElementClick("Add to Cart Button", e)}
                      className={`w-full text-white rounded-lg transition-colors ${addToCartColorStyle} ${addToCartSizeStyle} ${addToCartPosition === "cart-bottom-card" ? "mt-auto" : ""} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
                    >
                      {addToCartText}
                    </button>
                  )}
                </div>

                {/* Add to Cart Button - Floating */}
                {addToCartPosition === "cart-floating" && (
                  <button
                    onClick={(e) => handleElementClick("Add to Cart Button", e)}
                    className={`absolute bottom-4 right-4 text-white rounded-lg transition-colors shadow-lg ${addToCartColorStyle} ${addToCartSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
                  >
                    {addToCartText}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Trust Badges - Product Page Position */}
          {(trustPosition === "" || trustPosition === "mt-8") &&
            trustVisibility !== "hidden" && (
              <div
                onClick={(e) => handleElementClick("Trust Badges", e)}
                className={`mt-12 bg-white rounded-lg p-6 ${trustVisibility} ${trustPosition} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all" : ""}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold">Secure Payment</h4>
                    <p className="text-sm text-gray-500">
                      256-bit SSL encryption
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold">Free Shipping</h4>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold">Easy Returns</h4>
                    <p className="text-sm text-gray-500">30-day money back</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold">Top Rated</h4>
                    <p className="text-sm text-gray-500">
                      4.8/5 customer rating
                    </p>
                  </div>
                </div>
              </div>
            )}
        </main>

        {/* Cart Summary / Checkout */}
        {checkoutPosition !== "checkout-top-right" &&
         checkoutPosition !== "checkout-bottom-right" &&
         checkoutPosition !== "checkout-sticky" && (
          <div
            className={`bg-white border-t border-gray-200 py-4 ${checkoutPosition === "checkout-center" ? "flex justify-center" : ""}`}
          >
            <div className={`${checkoutPosition === "checkout-center" ? "text-center" : "max-w-7xl mx-auto px-4"}`}>
              <div className={`flex items-center ${checkoutPosition === "checkout-center" ? "flex-col space-y-4" : "justify-between"}`}>
                <div>
                  <p className="text-gray-600">3 items in cart</p>
                  <p className="text-xl font-bold">Total: $489.97</p>
                </div>
                <button
                  onClick={(e) => handleElementClick("Checkout Button", e)}
                  className={`text-white rounded-lg transition-colors ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
                >
                  {checkoutText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button - Special Positions */}
        {checkoutPosition === "checkout-top-right" && (
          <button
            onClick={(e) => handleElementClick("Checkout Button", e)}
            className={`fixed top-20 right-4 z-50 text-white rounded-lg transition-colors shadow-lg ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
          >
            {checkoutText}
          </button>
        )}

        {checkoutPosition === "checkout-bottom-right" && (
          <button
            onClick={(e) => handleElementClick("Checkout Button", e)}
            className={`fixed bottom-4 right-4 z-50 text-white rounded-lg transition-colors shadow-lg ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
          >
            {checkoutText}
          </button>
        )}

        {checkoutPosition === "checkout-sticky" && (
          <div className="sticky bottom-4 z-50 px-4">
            <button
              onClick={(e) => handleElementClick("Checkout Button", e)}
              className={`w-full text-white rounded-lg transition-colors shadow-lg ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
            >
              {checkoutText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
