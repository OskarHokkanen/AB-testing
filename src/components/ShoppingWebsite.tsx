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

  // Build position map based on element and value
  const getPositionClass = (element: string, value: string): string => {
    // Checkout button positions
    if (element === "Checkout Button") {
      const checkoutMap: Record<string, string> = {
        "Top Right": "checkout-top-right",
        Center: "checkout-center",
        "Bottom Right": "checkout-bottom-right",
        Sticky: "checkout-sticky",
      };
      return checkoutMap[value] || "";
    }

    // Navigation positions
    if (element === "Navigation") {
      const navMap: Record<string, string> = {
        Sticky: "sticky top-0 z-10",
        Top: "",
        "Left Side": "w-64 shrink-0",
        Hidden: "hidden",
      };
      return navMap[value] || "";
    }

    // Add to Cart positions
    if (element === "Add to Cart Button") {
      const cartMap: Record<string, string> = {
        "Below Price": "cart-below-price",
        "Next to Image": "cart-next-image",
        Floating: "cart-floating",
        "Bottom of Card": "cart-bottom-card",
      };
      return cartMap[value] || "";
    }

    // Product Title positions
    if (element === "Product Title") {
      const titleMap: Record<string, string> = {
        "Above Image": "order-first",
        "Below Image": "order-last",
        "Overlay on Image": "absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded",
      };
      return titleMap[value] || "";
    }

    // Hero banner positions
    if (element === "Hero Banner") {
      const heroMap: Record<string, string> = {
        "Top of Page": "hero-top",
        "After Navigation": "hero-after-nav",
        "Mid Page": "hero-mid",
        Hidden: "hidden",
      };
      return heroMap[value] || "";
    }

    // Product Price positions
    if (element === "Product Price") {
      const priceMap: Record<string, string> = {
        "Next to Title": "price-next-title",
        "Below Title": "price-below-title",
        "Near Button": "price-near-button",
        Prominent: "price-prominent",
      };
      return priceMap[value] || "";
    }

    // Trust Badges positions
    if (element === "Trust Badges") {
      const badgeMap: Record<string, string> = {
        "Near Checkout": "near-checkout",
        Footer: "footer",
        Header: "header",
        "Product Page": "product-page",
      };
      return badgeMap[value] || "";
    }

    return "";
  };

  return getPositionClass(element, choice.value);
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
    Standard: "",
    "Mega Menu": "nav-mega-menu",
    Hamburger: "nav-hamburger",
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
    Expandable: "w-10 hover:w-64 transition-all",
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
  const titlePosition = getPositionForElement("Product Title", designChoices);

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
  const navStyle = getStyleForElement2("Navigation", designChoices);
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

  // Get Trust Badge Type
  const trustTypeChoice = designChoices.find(
    (c) => c.object === "Trust Badges" && c.action === "Change Type"
  );
  const trustType = trustTypeChoice?.value || "default";

  // Get Trust Badge Style
  const trustStyleChoice = designChoices.find(
    (c) => c.object === "Trust Badges" && c.action === "Change Style"
  );
  const trustStyle = trustStyleChoice?.value || "Icons with Text";

  // Sample products
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 299.99,
      originalPrice: 349.99,
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Ergonomic Laptop Stand",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    },
  ];

  const isLeftNavigation = navPosition === "w-64 shrink-0";

  const handleElementClick = (elementName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onElementClick) {
      onElementClick(elementName);
    }
  };

  // Render Trust Badges based on type and style
  const renderTrustBadges = (compact: boolean = false) => {
    const badges = {
      "Security Badges": [
        { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
        { icon: Shield, title: "Data Protection", desc: "Your privacy is safe" },
        { icon: Shield, title: "Verified Secure", desc: "PCI DSS compliant" },
      ],
      "Payment Icons": [
        { icon: Shield, title: "Visa & Mastercard", desc: "All major cards accepted" },
        { icon: Shield, title: "PayPal", desc: "Fast & secure checkout" },
        { icon: Shield, title: "Apple Pay", desc: "One-click payment" },
      ],
      "Guarantees": [
        { icon: Shield, title: "Money Back", desc: "30-day guarantee" },
        { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
        { icon: RefreshCw, title: "Easy Returns", desc: "No questions asked" },
      ],
      "Reviews": [
        { icon: Star, title: "Top Rated", desc: "4.8/5 customer rating" },
        { icon: Star, title: "Verified Reviews", desc: "Real customer feedback" },
        { icon: Star, title: "Trusted Shop", desc: "10,000+ happy customers" },
      ],
      "default": [
        { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
        { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
        { icon: RefreshCw, title: "Easy Returns", desc: "30-day money back" },
        { icon: Star, title: "Top Rated", desc: "4.8/5 customer rating" },
      ],
    };

    const selectedBadges = badges[trustType as keyof typeof badges] || badges.default;
    const showIcons = trustStyle !== "Text";
    const showText = trustStyle !== "Icons";
    const isColorful = trustStyle === "Colorful";

    if (compact) {
      return (
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          {selectedBadges.slice(0, 3).map((badge, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              {showIcons && <badge.icon className={`w-4 h-4 ${isColorful ? "text-indigo-600" : ""}`} />}
              {showText && <span>{badge.title}</span>}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        {selectedBadges.map((badge, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {showIcons && <badge.icon className={`w-8 h-8 mb-2 ${isColorful ? "text-indigo-600" : "text-gray-600"}`} />}
            {trustStyle !== "Icons" && (
              <>
                <h4 className="font-semibold">{badge.title}</h4>
                {trustStyle === "Icons with Text" && (
                  <p className="text-sm text-gray-500">{badge.desc}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`bg-gray-50 min-h-full relative ${isLeftNavigation ? "flex" : ""}`}
      id="shopping-website"
    >
      {/* Navigation */}
      {navPosition !== "hidden" && (
        <nav
          onClick={(e) => handleElementClick("Navigation", e)}
          className={`${navColorStyle} shadow-sm border-b border-gray-200 ${navPosition} ${navStyle} ${isLeftNavigation ? "border-b-0 border-r" : ""} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
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
                {navStyle === "nav-hamburger" ? (
                  <button className="p-2">
                    <div className="space-y-1">
                      <div className="w-6 h-0.5 bg-gray-600"></div>
                      <div className="w-6 h-0.5 bg-gray-600"></div>
                      <div className="w-6 h-0.5 bg-gray-600"></div>
                    </div>
                  </button>
                ) : (
                  <div
                    className={`${isLeftNavigation ? "flex flex-col space-y-2" : "hidden md:flex space-x-6"} ${navStyle === "nav-mega-menu" ? "text-base font-semibold space-x-8" : ""}`}
                  >
                    <a href="#" className={`text-gray-600 hover:text-gray-900 ${navStyle === "nav-mega-menu" ? "px-4 py-2 hover:bg-gray-100 rounded transition-colors" : ""}`}>
                      Products
                    </a>
                    <a href="#" className={`text-gray-600 hover:text-gray-900 ${navStyle === "nav-mega-menu" ? "px-4 py-2 hover:bg-gray-100 rounded transition-colors" : ""}`}>
                      Categories
                    </a>
                    <a href="#" className={`text-gray-600 hover:text-gray-900 ${navStyle === "nav-mega-menu" ? "px-4 py-2 hover:bg-gray-100 rounded transition-colors" : ""}`}>
                      Deals
                    </a>
                    <a href="#" className={`text-gray-600 hover:text-gray-900 ${navStyle === "nav-mega-menu" ? "px-4 py-2 hover:bg-gray-100 rounded transition-colors" : ""}`}>
                      Support
                    </a>
                  </div>
                )}
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
                  {/* Checkout Button - In Navigation Bar */}
                  {checkoutPosition === "checkout-top-right" && (
                    <button
                      onClick={(e) => handleElementClick("Checkout Button", e)}
                      className={`text-white rounded-lg transition-colors ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
                    >
                      {checkoutText}
                    </button>
                  )}
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
              heroBannerStyle === "hero-image-only" ? "bg-cover bg-center relative" :
              heroBannerStyle === "hero-video-bg" ? "bg-black relative" :
              heroBannerStyle === "hero-carousel" ? "relative bg-cover bg-center" :
              "bg-gradient-to-r from-indigo-600 to-purple-600 relative"
            } text-white ${
              heroBannerSize === "text-sm py-1 px-2" ? "py-8" :
              heroBannerSize === "text-base py-2 px-4" ? "py-16" :
              heroBannerSize === "text-lg py-3 px-6" ? "py-24" :
              heroBannerSize === "min-h-screen" ? "min-h-screen flex items-center" :
              "py-16"
            } overflow-hidden ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-white hover:ring-inset transition-all" : ""}`}
            style={
              heroBannerStyle === "hero-image-only"
                ? {backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop')"}
                : heroBannerStyle === "hero-carousel"
                ? {backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop')"}
                : {}
            }
          >
            {/* Background image for default style */}
            {(heroBannerStyle === "" || !heroBannerStyle) && (
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop"
                  alt="Shopping bags"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              {heroBannerStyle === "hero-video-bg" && (
                <>
                  <div className="absolute inset-0 opacity-30">
                    <img
                      src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop"
                      alt="Shopping mall"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50"></div>
                </>
              )}
              <div className={`flex flex-col md:flex-row items-center justify-between relative ${heroBannerStyle === "hero-image-only" ? "min-h-[400px]" : ""}`}>
                {(heroBannerStyle !== "hero-image-only") && (
                  <div className="mb-8 md:mb-0 md:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                      Summer Sale
                    </h1>
                    <p className="text-xl mb-6 text-indigo-100 drop-shadow">
                      Up to 50% off on selected items
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
                      {heroCTA}
                    </button>
                  </div>
                )}
                {(heroBannerStyle === "hero-image-text" || heroBannerStyle === "" || !heroBannerStyle) && (
                  <div className="md:w-1/2 flex justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop"
                      alt="Shopping"
                      className="w-64 h-64 object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                )}
                {heroBannerStyle === "hero-carousel" && (
                  <div className="flex space-x-2 mt-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
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
        {(trustPosition === "header" || (!trustPosition && trustVisibility !== "hidden")) && trustVisibility !== "hidden" && (
          <div
            onClick={(e) => handleElementClick("Trust Badges", e)}
            className={`bg-gray-100 py-3 border-b ${trustVisibility} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4">
              {renderTrustBadges(true)}
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
                heroBannerStyle === "hero-image-only" ? "bg-cover bg-center relative" :
                heroBannerStyle === "hero-video-bg" ? "bg-black relative" :
                heroBannerStyle === "hero-carousel" ? "relative bg-cover bg-center" :
                "bg-gradient-to-r from-indigo-600 to-purple-600 relative"
              } text-white ${
                heroBannerSize === "text-sm py-1 px-2" ? "py-8" :
                heroBannerSize === "text-base py-2 px-4" ? "py-16" :
                heroBannerSize === "text-lg py-3 px-6" ? "py-24" :
                heroBannerSize === "min-h-screen" ? "py-32" :
                "py-16"
              } rounded-lg overflow-hidden ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-white hover:ring-inset transition-all" : ""}`}
              style={
                heroBannerStyle === "hero-image-only"
                  ? {backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop')"}
                  : heroBannerStyle === "hero-carousel"
                  ? {backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop')"}
                  : {}
              }
            >
              {/* Background image for default style */}
              {(heroBannerStyle === "" || !heroBannerStyle) && (
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop"
                    alt="Shopping bags"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 relative z-10">
                {heroBannerStyle === "hero-video-bg" && (
                  <>
                    <div className="absolute inset-0 opacity-30 rounded-lg overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop"
                        alt="Shopping mall"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg"></div>
                  </>
                )}
                <div className={`flex flex-col md:flex-row items-center justify-between relative ${heroBannerStyle === "hero-image-only" ? "min-h-[400px]" : ""}`}>
                  {(heroBannerStyle !== "hero-image-only") && (
                    <div className="mb-8 md:mb-0 md:w-1/2">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        Summer Sale
                      </h1>
                      <p className="text-xl mb-6 text-indigo-100 drop-shadow">
                        Up to 50% off on selected items
                      </p>
                      <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
                        {heroCTA}
                      </button>
                    </div>
                  )}
                  {(heroBannerStyle === "hero-image-text" || heroBannerStyle === "" || !heroBannerStyle) && (
                    <div className="md:w-1/2 flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop"
                        alt="Shopping"
                        className="w-64 h-64 object-cover rounded-lg shadow-2xl"
                      />
                    </div>
                  )}
                  {heroBannerStyle === "hero-carousel" && (
                    <div className="flex space-x-2 mt-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
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
                className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${imageBorder} ${addToCartPosition === "cart-next-image" ? "flex" : addToCartPosition === "cart-bottom-card" ? "flex flex-col" : ""} relative`}
              >
                {/* Product Title - Above Image */}
                {titlePosition === "order-first" && (
                  <div className="p-4 pb-0">
                    <h3
                      onClick={(e) => handleElementClick("Product Title", e)}
                      className={`${titleSizeStyle} ${titleColorStyle} ${titleFontStyle} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded" : ""}`}
                    >
                      {product.name}
                    </h3>
                  </div>
                )}

                {/* Product Image with potential button next to it */}
                <div className={`${addToCartPosition === "cart-next-image" ? "flex-shrink-0" : ""} ${titlePosition === "order-first" || titlePosition === "order-last" ? "" : "relative"}`}>
                  <div
                    onClick={(e) => handleElementClick("Product Image", e)}
                    className={`relative bg-gray-100 ${imageSize} ${
                      imageStyle === "image-zoom" ? "overflow-hidden group" :
                      imageStyle === "image-360" ? "overflow-hidden relative" :
                      imageStyle === "image-gallery" ? "relative" :
                      ""
                    } ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-48 object-cover ${
                        imageStyle === "image-zoom" ? "group-hover:scale-125 transition-transform duration-300" :
                        imageStyle === "image-360" ? "hover:rotate-45 transition-transform duration-500" :
                        ""
                      }`}
                    />
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
                    {/* Product Title - Overlay on Image */}
                    {titlePosition === "absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded" && (
                      <h3
                        onClick={(e) => handleElementClick("Product Title", e)}
                        className={`absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded ${titleSizeStyle} ${titleFontStyle} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
                      >
                        {product.name}
                      </h3>
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
                <div className={`p-4 ${addToCartPosition === "cart-bottom-card" ? "flex flex-col flex-1" : ""}`}>
                  {/* Title and Price Container */}
                  <div className={`${pricePosition === "price-next-title" ? "flex items-center justify-between mb-2" : ""}`}>
                    {/* Product Title - Default/Below Image Position */}
                    {!titlePosition || titlePosition === "order-last" || titlePosition === "" ? (
                      <h3
                        onClick={(e) => handleElementClick("Product Title", e)}
                        className={`${titleSizeStyle} ${titleColorStyle} ${titleFontStyle} ${pricePosition === "price-next-title" ? "" : "mb-2"} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded" : ""}`}
                      >
                        {product.name}
                      </h3>
                    ) : null}

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
                        pricePosition === "price-prominent" ? "mb-4" :
                        pricePosition === "price-below-title" ? "mb-4" :
                        "mb-4"
                      } ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all rounded inline-block" : ""}`}
                    >
                      <span className={`${pricePosition === "price-prominent" ? "text-2xl font-bold" : priceSizeStyle} ${priceColorStyle} ${pricePosition !== "price-prominent" ? "font-bold" : ""}`}>
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

        </main>

        {/* Trust Badges - Footer Position */}
        {trustPosition === "footer" && trustVisibility !== "hidden" && (
          <div
            onClick={(e) => handleElementClick("Trust Badges", e)}
            className={`bg-gray-100 py-6 border-t ${trustVisibility} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4">
              {renderTrustBadges(false)}
            </div>
          </div>
        )}

        {/* Trust Badges - Near Checkout Position */}
        {trustPosition === "near-checkout" && trustVisibility !== "hidden" && (
          <div
            onClick={(e) => handleElementClick("Trust Badges", e)}
            className={`bg-gray-50 py-4 border-t ${trustVisibility} ${onElementClick ? "cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4">
              {renderTrustBadges(true)}
            </div>
          </div>
        )}

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
        {checkoutPosition === "checkout-bottom-right" && (
          <button
            onClick={(e) => handleElementClick("Checkout Button", e)}
            className={`absolute bottom-4 right-4 z-50 text-white rounded-lg transition-colors shadow-lg ${checkoutColorStyle} ${checkoutSizeStyle} ${onElementClick ? "hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2" : ""}`}
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
