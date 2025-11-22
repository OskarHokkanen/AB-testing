// Metrics calculation engine for AB-testing simulator
// Each design choice influences multiple metrics with different weights

export interface DesignChoice {
  object: string;
  action: string;
  value: string;
  reasoning: string;
}

export interface MetricsResult {
  conversionRate: number;
  bounceRate: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  cartAbandonmentRate: number;
}

// Base metrics (represents a typical e-commerce website)
const BASE_METRICS: MetricsResult = {
  conversionRate: 2.5, // 2.5% baseline
  bounceRate: 45, // 45% baseline
  clickThroughRate: 3.5, // 3.5% baseline
  avgTimeOnPage: 120, // 120 seconds baseline
  cartAbandonmentRate: 70, // 70% baseline
};

// Weight definitions for each object/action/value combination
// Positive values improve the metric, negative values worsen it
// For bounceRate and cartAbandonmentRate, negative weight = improvement (lower is better)
interface MetricWeights {
  conversionRate: number;
  bounceRate: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  cartAbandonmentRate: number;
}

type WeightMap = Record<string, Record<string, Record<string, MetricWeights>>>;

const WEIGHTS: WeightMap = {
  // Checkout Button
  "Checkout Button": {
    "Change Color": {
      Green: {
        conversionRate: 0.8,
        bounceRate: -2,
        clickThroughRate: 1.2,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -8,
      },
      Orange: {
        conversionRate: 0.6,
        bounceRate: -1,
        clickThroughRate: 1.0,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -6,
      },
      Red: {
        conversionRate: 0.3,
        bounceRate: 2,
        clickThroughRate: 0.8,
        avgTimeOnPage: -8,
        cartAbandonmentRate: -3,
      },
      Blue: {
        conversionRate: 0.4,
        bounceRate: -1,
        clickThroughRate: 0.6,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -4,
      },
      Purple: {
        conversionRate: 0.2,
        bounceRate: 1,
        clickThroughRate: 0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -2,
      },
    },
    "Change Size": {
      Small: {
        conversionRate: -0.3,
        bounceRate: 3,
        clickThroughRate: -0.5,
        avgTimeOnPage: 5,
        cartAbandonmentRate: 5,
      },
      Medium: {
        conversionRate: 0.2,
        bounceRate: 0,
        clickThroughRate: 0.3,
        avgTimeOnPage: 0,
        cartAbandonmentRate: -2,
      },
      Large: {
        conversionRate: 0.5,
        bounceRate: -2,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -5,
      },
      "Extra Large": {
        conversionRate: 0.3,
        bounceRate: 3,
        clickThroughRate: 0.6,
        avgTimeOnPage: -8,
        cartAbandonmentRate: -3,
      },
    },
    "Change Text": {
      "Buy Now": {
        conversionRate: 0.6,
        bounceRate: -1,
        clickThroughRate: 0.9,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -6,
      },
      "Complete Purchase": {
        conversionRate: 0.4,
        bounceRate: 0,
        clickThroughRate: 0.5,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -4,
      },
      "Secure Checkout": {
        conversionRate: 0.7,
        bounceRate: -2,
        clickThroughRate: 0.7,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -7,
      },
      "Get It Now": {
        conversionRate: 0.5,
        bounceRate: 1,
        clickThroughRate: 1.0,
        avgTimeOnPage: -8,
        cartAbandonmentRate: -4,
      },
    },
    "Change Position": {
      "Top Right": {
        conversionRate: 0.3,
        bounceRate: 0,
        clickThroughRate: 0.4,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -3,
      },
      Center: {
        conversionRate: 0.5,
        bounceRate: -1,
        clickThroughRate: 0.7,
        avgTimeOnPage: 0,
        cartAbandonmentRate: -5,
      },
      "Bottom Right": {
        conversionRate: 0.2,
        bounceRate: 2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
      Sticky: {
        conversionRate: 0.6,
        bounceRate: 3,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -6,
      },
    },
  },

  // Add to Cart Button
  "Add to Cart Button": {
    "Change Color": {
      Green: {
        conversionRate: 0.5,
        bounceRate: -3,
        clickThroughRate: 1.5,
        avgTimeOnPage: 5,
        cartAbandonmentRate: 2,
      },
      Orange: {
        conversionRate: 0.6,
        bounceRate: -2,
        clickThroughRate: 1.8,
        avgTimeOnPage: 3,
        cartAbandonmentRate: 3,
      },
      Red: {
        conversionRate: 0.4,
        bounceRate: 1,
        clickThroughRate: 1.2,
        avgTimeOnPage: -2,
        cartAbandonmentRate: 4,
      },
      Blue: {
        conversionRate: 0.3,
        bounceRate: -1,
        clickThroughRate: 0.8,
        avgTimeOnPage: 5,
        cartAbandonmentRate: 1,
      },
      Purple: {
        conversionRate: 0.2,
        bounceRate: 0,
        clickThroughRate: 0.6,
        avgTimeOnPage: 3,
        cartAbandonmentRate: 2,
      },
    },
    "Change Size": {
      Small: {
        conversionRate: -0.2,
        bounceRate: 2,
        clickThroughRate: -0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: 3,
      },
      Medium: {
        conversionRate: 0.2,
        bounceRate: 0,
        clickThroughRate: 0.4,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Large: {
        conversionRate: 0.5,
        bounceRate: -2,
        clickThroughRate: 1.0,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -2,
      },
      "Extra Large": {
        conversionRate: 0.4,
        bounceRate: 2,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: 1,
      },
    },
    "Change Text": {
      "Add to Cart": {
        conversionRate: 0.2,
        bounceRate: 0,
        clickThroughRate: 0.5,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "Add to Bag": {
        conversionRate: 0.3,
        bounceRate: -1,
        clickThroughRate: 0.6,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -1,
      },
      "Buy": {
        conversionRate: 0.4,
        bounceRate: 1,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -2,
      },
      "I Want This!": {
        conversionRate: 0.3,
        bounceRate: 2,
        clickThroughRate: 0.9,
        avgTimeOnPage: 3,
        cartAbandonmentRate: 2,
      },
    },
    "Change Position": {
      "Below Price": {
        conversionRate: 0.4,
        bounceRate: -1,
        clickThroughRate: 0.7,
        avgTimeOnPage: 0,
        cartAbandonmentRate: -2,
      },
      "Next to Image": {
        conversionRate: 0.5,
        bounceRate: -2,
        clickThroughRate: 0.9,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -3,
      },
      "Floating": {
        conversionRate: 0.4,
        bounceRate: 3,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: 1,
      },
      "Bottom of Card": {
        conversionRate: 0.2,
        bounceRate: 1,
        clickThroughRate: 0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: 0,
      },
    },
  },

  // Product Title
  "Product Title": {
    "Change Size": {
      Small: {
        conversionRate: -0.2,
        bounceRate: 3,
        clickThroughRate: -0.3,
        avgTimeOnPage: -5,
        cartAbandonmentRate: 2,
      },
      Medium: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Large: {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
      "Extra Large": {
        conversionRate: 0.2,
        bounceRate: 1,
        clickThroughRate: 0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
    },
    "Change Color": {
      Black: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "Dark Blue": {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.3,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -1,
      },
      "Brand Color": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
      Red: {
        conversionRate: 0.1,
        bounceRate: 2,
        clickThroughRate: 0.3,
        avgTimeOnPage: -3,
        cartAbandonmentRate: 1,
      },
    },
    "Change Font": {
      Sans: {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.3,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
      Serif: {
        conversionRate: 0.1,
        bounceRate: 1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 5,
        cartAbandonmentRate: 0,
      },
      Bold: {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -2,
      },
      Light: {
        conversionRate: 0.0,
        bounceRate: 2,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 1,
      },
    },
    "Change Position": {
      "Above Image": {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.3,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -1,
      },
      "Below Image": {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "Overlay on Image": {
        conversionRate: 0.3,
        bounceRate: 2,
        clickThroughRate: 0.4,
        avgTimeOnPage: -3,
        cartAbandonmentRate: 1,
      },
      Centered: {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.3,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
    },
  },

  // Product Price
  "Product Price": {
    "Change Size": {
      Small: {
        conversionRate: -0.3,
        bounceRate: 3,
        clickThroughRate: -0.2,
        avgTimeOnPage: -3,
        cartAbandonmentRate: 4,
      },
      Medium: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Large: {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -3,
      },
      "Extra Large": {
        conversionRate: 0.3,
        bounceRate: 1,
        clickThroughRate: 0.3,
        avgTimeOnPage: -2,
        cartAbandonmentRate: -1,
      },
    },
    "Change Color": {
      Black: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Green: {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -3,
      },
      Red: {
        conversionRate: 0.5,
        bounceRate: -1,
        clickThroughRate: 0.4,
        avgTimeOnPage: -2,
        cartAbandonmentRate: -4,
      },
      "Brand Color": {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -2,
      },
    },
    "Show Discount": {
      "Show Original Price": {
        conversionRate: 0.6,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -5,
      },
      "Show Percentage Off": {
        conversionRate: 0.7,
        bounceRate: -4,
        clickThroughRate: 0.6,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -6,
      },
      "Show Amount Saved": {
        conversionRate: 0.5,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -4,
      },
      "No Discount Display": {
        conversionRate: 0.0,
        bounceRate: 0,
        clickThroughRate: 0.0,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
    },
    "Change Position": {
      "Next to Title": {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: -1,
      },
      "Below Title": {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "Near Button": {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -4,
      },
      Prominent: {
        conversionRate: 0.5,
        bounceRate: -1,
        clickThroughRate: 0.5,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -3,
      },
    },
  },

  // Hero Banner
  "Hero Banner": {
    "Change Size": {
      Small: {
        conversionRate: -0.2,
        bounceRate: 5,
        clickThroughRate: -0.3,
        avgTimeOnPage: -10,
        cartAbandonmentRate: 2,
      },
      Medium: {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -1,
      },
      Large: {
        conversionRate: 0.4,
        bounceRate: -4,
        clickThroughRate: 0.6,
        avgTimeOnPage: 10,
        cartAbandonmentRate: -3,
      },
      "Full Screen": {
        conversionRate: 0.3,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 15,
        cartAbandonmentRate: -2,
      },
    },
    "Change Style": {
      "Image Only": {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -1,
      },
      "Image with Text": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 10,
        cartAbandonmentRate: -3,
      },
      "Video Background": {
        conversionRate: 0.5,
        bounceRate: -5,
        clickThroughRate: 0.7,
        avgTimeOnPage: 20,
        cartAbandonmentRate: -4,
      },
      Carousel: {
        conversionRate: 0.3,
        bounceRate: -4,
        clickThroughRate: 0.4,
        avgTimeOnPage: 25,
        cartAbandonmentRate: -2,
      },
    },
    "Change CTA": {
      "Shop Now": {
        conversionRate: 0.5,
        bounceRate: -3,
        clickThroughRate: 0.8,
        avgTimeOnPage: -5,
        cartAbandonmentRate: -3,
      },
      "Explore Collection": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 10,
        cartAbandonmentRate: -2,
      },
      "Limited Time Offer": {
        conversionRate: 0.6,
        bounceRate: -4,
        clickThroughRate: 0.9,
        avgTimeOnPage: -3,
        cartAbandonmentRate: -5,
      },
      "View Products": {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -1,
      },
    },
    "Change Position": {
      "Top of Page": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
      "After Navigation": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 8,
        cartAbandonmentRate: -3,
      },
      "Mid Page": {
        conversionRate: 0.1,
        bounceRate: 2,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 1,
      },
      Hidden: {
        conversionRate: -0.3,
        bounceRate: 5,
        clickThroughRate: -0.4,
        avgTimeOnPage: -10,
        cartAbandonmentRate: 3,
      },
    },
  },

  // Navigation
  Navigation: {
    "Change Style": {
      Minimal: {
        conversionRate: 0.2,
        bounceRate: 2,
        clickThroughRate: 0.2,
        avgTimeOnPage: -5,
        cartAbandonmentRate: 1,
      },
      Standard: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "Mega Menu": {
        conversionRate: 0.3,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 15,
        cartAbandonmentRate: -2,
      },
      Hamburger: {
        conversionRate: 0.0,
        bounceRate: 3,
        clickThroughRate: -0.2,
        avgTimeOnPage: -3,
        cartAbandonmentRate: 2,
      },
    },
    "Change Position": {
      Top: {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.3,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
      "Left Side": {
        conversionRate: 0.1,
        bounceRate: 1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 5,
        cartAbandonmentRate: 0,
      },
      Sticky: {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 8,
        cartAbandonmentRate: -3,
      },
      Hidden: {
        conversionRate: -0.3,
        bounceRate: 8,
        clickThroughRate: -0.5,
        avgTimeOnPage: -15,
        cartAbandonmentRate: 5,
      },
    },
    "Change Color": {
      Light: {
        conversionRate: 0.1,
        bounceRate: -1,
        clickThroughRate: 0.1,
        avgTimeOnPage: 2,
        cartAbandonmentRate: 0,
      },
      Dark: {
        conversionRate: 0.2,
        bounceRate: -1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
      Transparent: {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -1,
      },
      "Brand Color": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
    },
    "Show Search": {
      Prominent: {
        conversionRate: 0.4,
        bounceRate: -4,
        clickThroughRate: 0.6,
        avgTimeOnPage: 10,
        cartAbandonmentRate: -3,
      },
      "Icon Only": {
        conversionRate: 0.2,
        bounceRate: 0,
        clickThroughRate: 0.3,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -1,
      },
      Hidden: {
        conversionRate: -0.2,
        bounceRate: 5,
        clickThroughRate: -0.3,
        avgTimeOnPage: -8,
        cartAbandonmentRate: 3,
      },
      Expandable: {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
    },
  },

  // Product Image
  "Product Image": {
    "Change Size": {
      Small: {
        conversionRate: -0.3,
        bounceRate: 4,
        clickThroughRate: -0.4,
        avgTimeOnPage: -8,
        cartAbandonmentRate: 4,
      },
      Medium: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.2,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Large: {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.6,
        avgTimeOnPage: 10,
        cartAbandonmentRate: -4,
      },
      "Full Width": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 12,
        cartAbandonmentRate: -3,
      },
    },
    "Change Style": {
      Standard: {
        conversionRate: 0.1,
        bounceRate: 0,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      "With Zoom": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.5,
        avgTimeOnPage: 15,
        cartAbandonmentRate: -5,
      },
      "360 View": {
        conversionRate: 0.5,
        bounceRate: -5,
        clickThroughRate: 0.7,
        avgTimeOnPage: 25,
        cartAbandonmentRate: -6,
      },
      Gallery: {
        conversionRate: 0.4,
        bounceRate: -4,
        clickThroughRate: 0.6,
        avgTimeOnPage: 20,
        cartAbandonmentRate: -5,
      },
    },
    "Add Badge": {
      "Sale Badge": {
        conversionRate: 0.5,
        bounceRate: -3,
        clickThroughRate: 0.7,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -4,
      },
      "New Badge": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.5,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -2,
      },
      "Best Seller": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.6,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -4,
      },
      "No Badge": {
        conversionRate: 0.0,
        bounceRate: 0,
        clickThroughRate: 0.0,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
    },
    "Change Border": {
      None: {
        conversionRate: 0.0,
        bounceRate: 0,
        clickThroughRate: 0.0,
        avgTimeOnPage: 0,
        cartAbandonmentRate: 0,
      },
      Subtle: {
        conversionRate: 0.1,
        bounceRate: -1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -1,
      },
      Rounded: {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.3,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -2,
      },
      Shadow: {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.4,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -2,
      },
    },
  },

  // Trust Badges
  "Trust Badges": {
    "Change Visibility": {
      Hidden: {
        conversionRate: -0.4,
        bounceRate: 5,
        clickThroughRate: -0.2,
        avgTimeOnPage: -5,
        cartAbandonmentRate: 8,
      },
      Subtle: {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.1,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -3,
      },
      Prominent: {
        conversionRate: 0.5,
        bounceRate: -4,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -6,
      },
      "Very Prominent": {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -5,
      },
    },
    "Change Position": {
      "Near Checkout": {
        conversionRate: 0.5,
        bounceRate: -3,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -7,
      },
      Footer: {
        conversionRate: 0.1,
        bounceRate: -1,
        clickThroughRate: 0.1,
        avgTimeOnPage: 0,
        cartAbandonmentRate: -2,
      },
      Header: {
        conversionRate: 0.3,
        bounceRate: -3,
        clickThroughRate: 0.2,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -4,
      },
      "Product Page": {
        conversionRate: 0.4,
        bounceRate: -2,
        clickThroughRate: 0.2,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -5,
      },
    },
    "Change Type": {
      "Security Badges": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -6,
      },
      "Payment Icons": {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.1,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -5,
      },
      Guarantees: {
        conversionRate: 0.5,
        bounceRate: -4,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -7,
      },
      Reviews: {
        conversionRate: 0.6,
        bounceRate: -5,
        clickThroughRate: 0.4,
        avgTimeOnPage: 8,
        cartAbandonmentRate: -6,
      },
    },
    "Change Style": {
      Icons: {
        conversionRate: 0.2,
        bounceRate: -2,
        clickThroughRate: 0.1,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -3,
      },
      "Icons with Text": {
        conversionRate: 0.4,
        bounceRate: -3,
        clickThroughRate: 0.3,
        avgTimeOnPage: 5,
        cartAbandonmentRate: -5,
      },
      Text: {
        conversionRate: 0.3,
        bounceRate: -2,
        clickThroughRate: 0.2,
        avgTimeOnPage: 3,
        cartAbandonmentRate: -4,
      },
      Colorful: {
        conversionRate: 0.3,
        bounceRate: -1,
        clickThroughRate: 0.2,
        avgTimeOnPage: 2,
        cartAbandonmentRate: -3,
      },
    },
  },
};

// Default weights for unknown combinations
const DEFAULT_WEIGHTS: MetricWeights = {
  conversionRate: 0.1,
  bounceRate: 0,
  clickThroughRate: 0.1,
  avgTimeOnPage: 0,
  cartAbandonmentRate: 0,
};

export function calculateMetrics(designChoices: DesignChoice[]): MetricsResult {
  // Start with base metrics
  const result: MetricsResult = { ...BASE_METRICS };

  // Apply each design choice
  for (const choice of designChoices) {
    const objectWeights = WEIGHTS[choice.object];
    if (!objectWeights) {
      // Unknown object, apply default weights
      applyWeights(result, DEFAULT_WEIGHTS);
      continue;
    }

    const actionWeights = objectWeights[choice.action];
    if (!actionWeights) {
      // Unknown action, apply default weights
      applyWeights(result, DEFAULT_WEIGHTS);
      continue;
    }

    const valueWeights = actionWeights[choice.value];
    if (!valueWeights) {
      // Unknown value, apply default weights
      applyWeights(result, DEFAULT_WEIGHTS);
      continue;
    }

    applyWeights(result, valueWeights);
  }

  // Clamp values to reasonable ranges
  result.conversionRate = Math.max(0.1, Math.min(15, result.conversionRate));
  result.bounceRate = Math.max(10, Math.min(90, result.bounceRate));
  result.clickThroughRate = Math.max(0.5, Math.min(20, result.clickThroughRate));
  result.avgTimeOnPage = Math.max(10, Math.min(300, result.avgTimeOnPage));
  result.cartAbandonmentRate = Math.max(
    20,
    Math.min(95, result.cartAbandonmentRate)
  );

  // Round to 2 decimal places
  result.conversionRate = Math.round(result.conversionRate * 100) / 100;
  result.bounceRate = Math.round(result.bounceRate * 100) / 100;
  result.clickThroughRate = Math.round(result.clickThroughRate * 100) / 100;
  result.avgTimeOnPage = Math.round(result.avgTimeOnPage * 100) / 100;
  result.cartAbandonmentRate =
    Math.round(result.cartAbandonmentRate * 100) / 100;

  return result;
}

function applyWeights(metrics: MetricsResult, weights: MetricWeights): void {
  metrics.conversionRate += weights.conversionRate;
  metrics.bounceRate += weights.bounceRate;
  metrics.clickThroughRate += weights.clickThroughRate;
  metrics.avgTimeOnPage += weights.avgTimeOnPage;
  metrics.cartAbandonmentRate += weights.cartAbandonmentRate;
}

// Export configuration options for the customization interface
export const CUSTOMIZATION_OPTIONS = {
  objects: [
    "Checkout Button",
    "Add to Cart Button",
    "Product Title",
    "Product Price",
    "Hero Banner",
    "Navigation",
    "Product Image",
    "Trust Badges",
  ],
  actions: {
    "Checkout Button": ["Change Color", "Change Size", "Change Text", "Change Position"],
    "Add to Cart Button": ["Change Color", "Change Size", "Change Text", "Change Position"],
    "Product Title": ["Change Size", "Change Color", "Change Font", "Change Position"],
    "Product Price": ["Change Size", "Change Color", "Show Discount", "Change Position"],
    "Hero Banner": ["Change Size", "Change Style", "Change CTA", "Change Position"],
    Navigation: ["Change Style", "Change Position", "Change Color", "Show Search"],
    "Product Image": ["Change Size", "Change Style", "Add Badge", "Change Border"],
    "Trust Badges": ["Change Visibility", "Change Position", "Change Type", "Change Style"],
  },
  values: {
    "Checkout Button": {
      "Change Color": ["Green", "Orange", "Red", "Blue", "Purple"],
      "Change Size": ["Small", "Medium", "Large", "Extra Large"],
      "Change Text": ["Buy Now", "Complete Purchase", "Secure Checkout", "Get It Now"],
      "Change Position": ["Top Right", "Center", "Bottom Right", "Sticky"],
    },
    "Add to Cart Button": {
      "Change Color": ["Green", "Orange", "Red", "Blue", "Purple"],
      "Change Size": ["Small", "Medium", "Large", "Extra Large"],
      "Change Text": ["Add to Cart", "Add to Bag", "Buy", "I Want This!"],
      "Change Position": ["Below Price", "Next to Image", "Floating", "Bottom of Card"],
    },
    "Product Title": {
      "Change Size": ["Small", "Medium", "Large", "Extra Large"],
      "Change Color": ["Black", "Dark Blue", "Brand Color", "Red"],
      "Change Font": ["Sans", "Serif", "Bold", "Light"],
      "Change Position": ["Above Image", "Below Image", "Overlay on Image", "Centered"],
    },
    "Product Price": {
      "Change Size": ["Small", "Medium", "Large", "Extra Large"],
      "Change Color": ["Black", "Green", "Red", "Brand Color"],
      "Show Discount": ["Show Original Price", "Show Percentage Off", "Show Amount Saved", "No Discount Display"],
      "Change Position": ["Next to Title", "Below Title", "Near Button", "Prominent"],
    },
    "Hero Banner": {
      "Change Size": ["Small", "Medium", "Large", "Full Screen"],
      "Change Style": ["Image Only", "Image with Text", "Video Background", "Carousel"],
      "Change CTA": ["Shop Now", "Explore Collection", "Limited Time Offer", "View Products"],
      "Change Position": ["Top of Page", "After Navigation", "Mid Page", "Hidden"],
    },
    Navigation: {
      "Change Style": ["Minimal", "Standard", "Mega Menu", "Hamburger"],
      "Change Position": ["Top", "Left Side", "Sticky", "Hidden"],
      "Change Color": ["Light", "Dark", "Transparent", "Brand Color"],
      "Show Search": ["Prominent", "Icon Only", "Hidden", "Expandable"],
    },
    "Product Image": {
      "Change Size": ["Small", "Medium", "Large", "Full Width"],
      "Change Style": ["Standard", "With Zoom", "360 View", "Gallery"],
      "Add Badge": ["Sale Badge", "New Badge", "Best Seller", "No Badge"],
      "Change Border": ["None", "Subtle", "Rounded", "Shadow"],
    },
    "Trust Badges": {
      "Change Visibility": ["Hidden", "Subtle", "Prominent", "Very Prominent"],
      "Change Position": ["Near Checkout", "Footer", "Header", "Product Page"],
      "Change Type": ["Security Badges", "Payment Icons", "Guarantees", "Reviews"],
      "Change Style": ["Icons", "Icons with Text", "Text", "Colorful"],
    },
  },
};
