// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all editable landing-page content.
// Edit values here to update both the public page and the admin panel.
// ─────────────────────────────────────────────────────────────────────────────

export type SiteContent = {
  clinic: {
    name: string;
    tagline: string;
    phone: string;
    address: string;
    email: string;
    hours: { day: string; hours: string }[];
    social: {
      facebook: string;
      instagram: string;
      youtube: string;
      whatsapp: string;
    };
  };
  hero: {
    heading: string;
    subheading: string;
    ctaText: string;
    backgroundImage: string;
    videoUrl?: string;
  };
  trustBar: {
    items: { icon: string; number?: string; text?: string; label: string }[];
  };
  service: {
    tag: string;
    heading: string;
    description: string;
    bullets: string[];
    image: string;
  };
  about: {
    name: string;
    title: string;
    bio: string;
    image: string;
    strengths: { icon: string; label: string }[];
    ctaText: string;
  };
  patients: {
    heading: string;
    subheading: string;
    images: { src: string; caption: string }[];
  };
  clinic_section: {
    heading: string;
    subheading: string;
    paragraph: string;
    team: { name: string; role: string; image: string }[];
    tech: { icon: string; label: string; description: string }[];
    ctaText: string;
    ctaButtonText: string;
  };
  testimonials: {
    heading: string;
    items: { text: string; name: string; source: string }[];
  };
  staff_split: {
    left: {
      name: string;
      role: string;
      image: string;
      bullets: string[];
      ctaText: string;
    };
    right: {
      name: string;
      role: string;
      image: string;
      bullets: string[];
      ctaText: string;
    };
  };
  videos: {
    heading: string;
    items: { youtubeId: string; title: string }[];
  };
  forms: {
    serviceOptions: string[];
    submitText: string;
    successMessage: string;
    inlineTitle: string;
    footerTitle: string;
    contactEmail: string;
    fieldName: string;
    fieldPhone: string;
    fieldService: string;
  };
  faq: {
    heading: string;
    items: { question: string; answer: string }[];
  };
  footer: {
    copyright: string;
  };
  meta: {
    facebookPixelCode: string;
  };
};

export const siteContent: SiteContent = {
  clinic: {
    name: 'ד"ר דניאלה בלטר-אבן',
    tagline: "אורתודונטית | מומחית לייישור שיניים",
    phone: "077-460-0800",
    address: "המעפילים 14, נהריה",
    email: "",
    hours: [
      { day: "ראשון", hours: "08:00–19:00" },
      { day: "שני", hours: "08:00–19:00" },
      { day: "שלישי", hours: "08:00–19:00" },
      { day: "רביעי", hours: "08:00–19:00" },
      { day: "חמישי", hours: "08:00–19:00" },
      { day: "שישי", hours: "סגור" },
      { day: "שבת", hours: "סגור" },
    ],
    social: {
      facebook: "https://www.facebook.com/drdanielabalter/",
      instagram: "https://www.instagram.com/daniella.balter.even/",
      youtube:
        "https://www.youtube.com/@דרדניאלהבלטראבן-מומחיתלייישורשיני",
      whatsapp: "97277460800",
    },
  },

  hero: {
    heading: "חיוך מושלם מתחיל כאן",
    subheading:
      "יישור שיניים שקוף עם טכנולוגיה מתקדמת – לתוצאות שתאהבי",
    ctaText: "לתיאום ייעוץ חינם ←",
    backgroundImage: "/images/hero-bg.jpg",
    videoUrl: "",
  },

  trustBar: {
    items: [
      { icon: "FaTooth", number: "+500", label: "מטופלים מרוצים" },
      { icon: "FaMedal", label: "15+ שנות ניסיון" },
      { icon: "FaStar", text: "iTero", label: "טכנולוגיה מתקדמת" },
      { icon: "FaChild", label: "ידידותי לילדים מגיל 8" },
    ],
  },

  service: {
    tag: "השירות שלנו",
    heading: "יישור שיניים שקוף – חיוך שתאהבי",
    description:
      "אנחנו מתמחים ביישור שיניים שקוף המתאים לכל גיל החל מגיל 8. הטיפול כמעט בלתי נראה, נוח לחיי היומיום, ומניב תוצאות מדהימות.",
    bullets: [
      "שקוף וכמעט בלתי נראה",
      "נוח ומאפשר חיי יומיום רגילים",
      "מתאים מגיל 8 ומעלה",
      "טכנולוגיית iTero לתכנון מדויק",
    ],
    image: "/images/service-invisalign.jpg",
  },

  about: {
    name: 'ד"ר דניאלה בלטר-אבן',
    title: "אורתודונטית מומחית",
    bio: 'ד"ר דניאלה בלטר-אבן היא אורתודונטית מומחית עם ניסיון של מעל 15 שנה בטיפולי יישור שיניים לכל הגילאים. בוגרת מוסמכת עם התמחות באורתודונטיה, המשלבת טכנולוגיה מתקדמת עם גישה אישית וחמה לכל מטופל.',
    image: "/images/daniela.jpg",
    strengths: [
      { icon: "FaTooth", label: "אורתודונטית מוסמכת" },
      { icon: "FaMedal", label: "מעל 15 שנות ניסיון" },
      { icon: "FaSmile", label: "מומחית לטיפול בילדים" },
      { icon: "FaStar", label: "גישה אישית לכל מטופל" },
    ],
    ctaText: "לתיאום ייעוץ ←",
  },

  patients: {
    heading: "תוצאות אמיתיות של מטופלים שלנו",
    subheading: "לפני ואחרי – תוצאות שמדברות בעד עצמן",
    images: [
      { src: "/images/patient-1.jpg", caption: "" },
      { src: "/images/patient-2.jpg", caption: "" },
      { src: "/images/patient-3.jpg", caption: "" },
      { src: "/images/patient-4.jpg", caption: "" },
      { src: "/images/patient-5.jpg", caption: "" },
      { src: "/images/patient-6.jpg", caption: "" },
    ],
  },

  clinic_section: {
    heading: "המרפאה שלנו",
    subheading: "צוות מקצועי, טכנולוגיה מתקדמת, אווירה חמה",
    paragraph: "המרפאה שלנו מציעה סביבה חמה ומקצועית עם הטכנולוגיה המתקדמת ביותר בתחום האורתודונטיה. אנחנו מאמינים שטיפול אורתודונטי הוא השקעה לכל החיים.",
    team: [
      {
        name: 'ד"ר דניאלה בלטר-אבן',
        role: "אורתודונטית מומחית",
        image: "/images/daniela.jpg",
      },
      {
        name: "[שם רופאת ילדים]",
        role: "רופאת שיניים לילדים",
        image: "/images/pediatric.jpg",
      },
      {
        name: "[שם שיננית]",
        role: "שיננית מוסמכת",
        image: "/images/hygienist.jpg",
      },
    ],
    tech: [
      {
        icon: "FaScan",
        label: "סורק iTero",
        description: "תכנון דיגיטלי מדויק",
      },
      {
        icon: "FaShieldAlt",
        label: "חומרים מאושרים FDA",
        description: "בטיחות מירבית",
      },
      {
        icon: "FaTooth",
        label: "יישור שקוף",
        description: "Invisalign מורשה",
      },
    ],
    ctaText: "לתיאום תור במרפאה ←",
    ctaButtonText: "לתיאום תור ←",
  },

  testimonials: {
    heading: "מה המטופלים אומרים עלינו",
    items: [
      {
        text: 'הטיפול אצל ד"ר דניאלה היה חוויה מדהימה. מקצועית, אדיבה ותמיד זמינה לשאלות. התוצאה עברה את הציפיות שלי!',
        name: "מיכל כ.",
        source: "google",
      },
      {
        text: "הילד שלי פחד מרופאי שיניים, אבל אצל דניאלה הוא מרגיש בבית. הגישה שלה לילדים פשוט מיוחדת במינה.",
        name: "רונית ל.",
        source: "google",
      },
      {
        text: "אחרי חצי שנה של יישור שקוף יש לי חיוך שתמיד חלמתי עליו. תודה רבה!",
        name: "יוסי מ.",
        source: "google",
      },
      {
        text: "מרפאה ברמה אחרת לגמרי. הטכנולוגיה מתקדמת, הצוות מקסים והתוצאות מדברות בעד עצמן.",
        name: "שרה ב.",
        source: "google",
      },
      {
        text: 'המלצה חמה לכולם! ד"ר דניאלה מסבירה הכל בסבלנות ומקצועיות. שירות פרימיום בכל קנה מידה.',
        name: "אורי ד.",
        source: "google",
      },
    ],
  },

  staff_split: {
    left: {
      name: "[שם השיננית]",
      role: "שיננית מוסמכת",
      image: "/images/hygienist.jpg",
      bullets: [
        "ניקוי שיניים מקצועי",
        "טיפולי מניעה",
        "הדרכת היגיינה אישית",
      ],
      ctaText: "לקביעת תור ←",
    },
    right: {
      name: "[שם רופאת ילדים]",
      role: "רופאת שיניים לילדים",
      image: "/images/pediatric.jpg",
      bullets: [
        "טיפול עדין לילדים מגיל 0",
        "אווירה נעימה ומרגיעה",
        "ציפוי פלואוריד ואטימות",
      ],
      ctaText: "לקביעת תור ←",
    },
  },

  videos: {
    heading: "צפי בסרטונים שלנו",
    items: [
      { youtubeId: "PLACEHOLDER_1", title: "סרטון 1" },
      { youtubeId: "PLACEHOLDER_2", title: "סרטון 2" },
      { youtubeId: "PLACEHOLDER_3", title: "סרטון 3" },
      { youtubeId: "PLACEHOLDER_4", title: "סרטון 4" },
    ],
  },

  forms: {
    serviceOptions: ["יישור שיניים שקוף", "רופאת שיניים", "שיננית"],
    submitText: "שלחי פרטים ←",
    successMessage: "תודה! ניצור איתך קשר בהקדם 😊",
    inlineTitle: "קבלי ייעוץ חינם עכשיו",
    footerTitle: "מוכנה להתחיל? נשמח לקבוע לך ייעוץ חינם",
    contactEmail: "",
    fieldName: "שם מלא",
    fieldPhone: "טלפון",
    fieldService: "סוג שירות",
  },

  faq: {
    heading: "שאלות נפוצות",
    items: [
      { question: "מה זה יישור שיניים שקוף?", answer: "יישור שקוף הוא שיטת יישור שיניים באמצעות סדרת מסילות שקופות וניתנות להסרה, המחליפות את הגשרים המסורתיים." },
      { question: "מאיזה גיל מתאים הטיפול?", answer: "הטיפול מתאים מגיל 8 ומעלה, לילדים, נוער ומבוגרים כאחד." },
      { question: "כמה זמן נמשך הטיפול?", answer: "משך הטיפול משתנה בהתאם למורכבות המקרה, בדרך כלל בין 6 חודשים לשנתיים." },
      { question: "האם הטיפול כואב?", answer: "הטיפול עשוי לגרום לאי נוחות קלה בתחילת כל שלב חדש, אך הוא נחשב נוח בהרבה לעומת גשרים מסורתיים." },
      { question: "כיצד מקבעים תור ייעוץ?", answer: "ניתן לפנות אלינו בטלפון, בוואטסאפ או דרך הטופס באתר ונחזור אליכם בהקדם." },
    ],
  },
  footer: {
    copyright: '© 2025 ד"ר דניאלה בלטר-אבן | כל הזכויות שמורות',
  },
  meta: {
    facebookPixelCode: "",
  },
};
