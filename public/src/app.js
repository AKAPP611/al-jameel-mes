// app.js - Complete version with error handling
import { FactorySelectView } from './views/factory-select.js';
import { PistachioHome } from './views/pistachio-home.js';
import { PistachioShift } from './views/pistachio-shift.js';
import { MaterialsView } from './views/materials.js';

const i18n = {
  en: {
    factories: "Factories",
    today: "Today",
    efficiency: "Efficiency",
    rejectRate: "Reject Rate",
    view: "View",
    selectFactory: "Select Work Space",
    pistachioWS: "Pistachio Workspace",
    shiftEntry: "Shift Entry",
    materials: "Materials",
    hullerRun: "Huller Run",
    repackingOnly: "Repacking Only",
    finalGoods: "Final Goods",
    brand: "Brand",
    size: "Size",
    qtyBags10kg: "Qty (10 kg bags)",
    boxesUsed: "Boxes used",
    bagsUsed: "Vacuum bags used",
    boxesWaste: "Boxes wasted",
    bagsWaste: "Vacuum bags wasted",
    rejects: "Rejects (byproduct)",
    saveDraft: "Save Draft",
    submit: "Submit",
    clear: "Clear",
    runType: "Run Type",
    rawFormat: "Raw Material Format",
    bigBag: "Big Bag",
    carton: "Carton",
    bag25: "Bag 25 kg",
    csvExport: "Export CSV",
    editMaterials: "Materials Usage",
    add: "Add",
    remove: "Remove",
    back: "Back"
  },
  ar: {
    factories: "المصانع",
    today: "اليوم",
    efficiency: "الكفاءة",
    rejectRate: "نسبة الرفض",
    view: "عرض",
    selectFactory: "اختر مساحة العمل",
    pistachioWS: "مساحة عمل الفستق",
    shiftEntry: "إدخال الوردية",
    materials: "المواد",
    hullerRun: "تشغيل الهَولَر",
    repackingOnly: "إعادة تعبئة فقط",
    finalGoods: "المنتجات النهائية",
    brand: "العلامة",
    size: "المقاس",
    qtyBags10kg: "الكمية (أكياس 10 كجم)",
    boxesUsed: "الكرتون المستخدم",
    bagsUsed: "أكياس التفريغ المستخدمة",
    boxesWaste: "الكرتون التالف",
    bagsWaste: "أكياس التفريغ التالفة",
    rejects: "المرفوضات (ناتج جانبي)",
    saveDraft: "حفظ مسودة",
    submit: "إرسال",
    clear: "مسح",
    runType: "نوع التشغيل",
    rawFormat: "شكل المواد الخام",
    bigBag: "كيس ضخم",
    carton: "كرتون",
    bag25: "كيس 25 كجم",
    csvExport: "تصدير CSV",
    editMaterials: "استهلاك المواد",
    add: "إضافة",
    remove: "حذف",
    back: "رجوع"
  },
  hi: {
    factories: "कारख़ाने",
    today: "आज",
    efficiency: "दक्षता",
    rejectRate: "रिजेक्ट दर",
    view: "देखें",
    selectFactory: "वर्क स्पेस चुनें",
    pistachioWS: "पिस्ता वर्कस्पेस",
    shiftEntry: "शिफ्ट एंट्री",
    materials: "सामग्री",
    hullerRun: "हुलर रन",
    repackingOnly: "केवल री-पैकिंग",
    finalGoods: "अंतिम उत्पाद",
    brand: "ब्रांड",
    size: "आकार",
    qtyBags10kg: "मात्रा (10 किग्रा बैग)",
    boxesUsed: "बॉक्स उपयोग",
    bagsUsed: "वैक्यूम बैग उपयोग",
    boxesWaste: "बॉक्स बर्बाद",
    bagsWaste: "वैक्यूम बैग बर्बाद",
    rejects: "रिजेक्ट (उत्पाद उप-उत्पाद)",
    saveDraft: "ड्राफ्ट सेव",
    submit: "सबमिट",
    clear: "क्लियर",
    runType: "रन प्रकार",
    rawFormat: "कच्चा माल प्रकार",
    bigBag: "बिग बैग",
    carton: "कार्टन",
    bag25: "25 किग्रा बैग",
    csvExport: "CSV एक्सपोर्ट",
    editMaterials: "सामग्री उपयोग",
    add: "जोड़ें",
    remove: "हटाएं",
    back: "वापस"
  }
};

// Safe localStorage access with fallbacks
function getStoredLang() {
  try {
    return localStorage.getItem('lang') || 'en';
  } catch (e) {
    console.warn('localStorage not available, using default language');
    return 'en';
  }
}

function setStoredLang(lang) {
  try {
    localStorage.setItem('lang', lang);
  } catch (e) {
    console.warn('localStorage not available, cannot save language preference');
  }
}

let lang = getStoredLang();
applyLang(lang);

function applyLang(l) {
  lang = l;
  setStoredLang(l);
  
  if (document.documentElement) {
    document.documentElement.lang = l;
    document.documentElement.dir = (l === 'ar') ? 'rtl' : 'ltr';
  }
  
  // Update language buttons
  document.querySelectorAll('.lang-switch .pill').forEach(b => {
    if (b.dataset.lang) {
      b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false');
    }
  });
}

export function t(key) { 
  return i18n[lang] && i18n[lang][key] ? i18n[lang][key] : key; 
}

export function goTo(path, params = {}) {
  try {
    const qs = new URLSearchParams(params).toString();
    location.hash = `${path}${qs ? '?' + qs : ''}`;
  } catch (e) {
    console.error('Navigation error:', e);
    location.hash = path;
  }
}

export function getParams() {
  try {
    const q = (location.hash.split('?')[1] || '');
    return new URLSearchParams(q);
  } catch (e) {
    console.error('Error parsing URL parameters:', e);
    return new URLSearchParams();
  }
}

/* Back Button */
let __backBtn;
function ensureBackButton() {
  if (__backBtn) return __backBtn;
  
  try {
    __backBtn = document.createElement('button');
    __backBtn.id = 'backBtn';
    __backBtn.className = 'ghost back-btn';
    __backBtn.type = 'button';
    __backBtn.innerHTML = `← ${t('back')}`;
    __backBtn.setAttribute('aria-label', 'Go back');

    __backBtn.addEventListener('click', () => {
      try {
        if (history.length > 1) { 
          history.back(); 
        } else { 
          goTo('#/'); 
        }
      } catch (e) {
        console.error('Navigation error:', e);
        goTo('#/');
      }
    });

    const headerRow = document.querySelector('.header-row');
    if (headerRow) {
      headerRow.insertBefore(__backBtn, headerRow.firstChild);
    }
  } catch (e) {
    console.error('Error creating back button:', e);
  }
  
  return __backBtn;
}

/* Main Render Function */
function render() {
  try {
    const mount = document.getElementById('app');
    if (!mount) {
      console.error('App mount point not found');
      return;
    }
    
    const hash = location.hash || '#/';
    const route = hash.split('?')[0];

    // Ensure back button exists and toggle visibility
    const backBtn = ensureBackButton();
    const isHome = (route === '#/' || route === '#/select');
    if (backBtn) {
      backBtn.style.display = isHome ? 'none' : '';
      backBtn.innerHTML = `← ${t('back')}`;
    }

    // Route to appropriate view
    try {
      switch(route) {
        case '#/':
        case '#/select':
          FactorySelectView(mount, { t });
          break;
        case '#/pistachio':
          PistachioHome(mount, { t });
          break;
        case '#/shift/new':
          PistachioShift(mount, { t });
          break;
        case '#/materials':
          MaterialsView(mount, { t });
          break;
        default:
          mount.innerHTML = `<div class="card"><p>404 - Page not found</p><p>Route: ${route}</p></div>`;
      }
    } catch (e) {
      console.error('Error rendering view:', e);
      mount.innerHTML = `<div class="card"><p>Error loading page</p><p>${e.message}</p></div>`;
    }

    // Update date display
    try {
      const dateEl = document.getElementById('todayDate');
      if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString(
          document.documentElement.lang, 
          { dateStyle: 'medium' }
        );
      }
    } catch (e) {
      console.error('Error updating date:', e);
    }
  } catch (e) {
    console.error('Critical render error:', e);
  }
}

/* Event Listeners */
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

// Language switching with error handling
document.addEventListener('click', (e) => {
  try {
    const btn = e.target.closest('.pill');
    if (btn && btn.dataset.lang) { 
      applyLang(btn.dataset.lang); 
      render(); 
    }
  } catch (err) {
    console.error('Language switch error:', err);
  }
});

// Direction toggle with error handling
document.addEventListener('DOMContentLoaded', () => {
  const dirBtn = document.getElementById('dirToggle');
  if (dirBtn) {
    dirBtn.addEventListener('click', () => {
      try {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        document.documentElement.setAttribute('dir', current === 'ltr' ? 'rtl' : 'ltr');
      } catch (e) {
        console.error('Direction toggle error:', e);
      }
    });
  }
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
