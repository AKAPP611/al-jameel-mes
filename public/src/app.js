// app.js - Complete version with cache busting
const APP_VERSION = '1.2.0'; // Increment this when making changes

// Dynamic imports with cache busting
async function loadView(viewPath) {
  try {
    const module = await import(`${viewPath}?v=${APP_VERSION}&t=${Date.now()}`);
    return module;
  } catch (error) {
    console.error(`Failed to load view: ${viewPath}`, error);
    // Fallback: try without cache busting
    return import(viewPath);
  }
}

// Load views with cache busting
const FactorySelectView = (await loadView('./views/factory-select.js')).FactorySelectView;
const PistachioHome = (await loadView('./views/pistachio-home.js')).PistachioHome;
const PistachioShift = (await loadView('./views/pistachio-shift.js')).PistachioShift;
const MaterialsView = (await loadView('./views/materials.js')).MaterialsView;

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

// Enhanced localStorage access with cache clearing
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
    // Also store a timestamp to detect cache issues
    localStorage.setItem('lang_updated', Date.now().toString());
  } catch (e) {
    console.warn('localStorage not available, cannot save language preference');
  }
}

// Clear old cache data
function clearOldCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cached_') || key.startsWith('old_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn('Could not clear old cache data');
  }
}

// Initialize with cache clearing
clearOldCache();

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
    // Add cache busting to navigation
    const separator = path.includes('?') ? '&' : '?';
    const cacheBust = `v=${APP_VERSION}&t=${Date.now()}`;
    location.hash = `${path}${qs ? '?' + qs : ''}${separator}${cacheBust}`;
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

/* Back Button with cache busting */
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
          // Add cache busting to fallback navigation
          window.location.href = `#/?v=${APP_VERSION}&t=${Date.now()}`; 
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

/* Main Render Function with enhanced error handling */
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
          mount.innerHTML = `
            <div class="card">
              <p>404 - Page not found</p>
              <p>Route: ${route}</p>
              <button onclick="window.location.reload()" class="btn">Refresh Page</button>
              <button onclick="clearCacheAndReload()" class="ghost">Clear Cache & Refresh</button>
            </div>
          `;
      }
    } catch (e) {
      console.error('Error rendering view:', e);
      mount.innerHTML = `
        <div class="card">
          <h3 style="color: #dc2626;">Error Loading Page</h3>
          <p><strong>Error:</strong> ${e.message}</p>
          <div style="margin: 1rem 0;">
            <button onclick="window.location.reload()" class="btn">Try Again</button>
            <button onclick="clearCacheAndReload()" class="ghost">Clear Cache</button>
          </div>
        </div>
      `;
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

// Cache clearing function
function clearCacheAndReload() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    }).then(() => {
      window.location.reload(true);
    });
  } else {
    // Force reload with cache bust
    window.location.href = window.location.pathname + '?bust=' + Date.now();
  }
}

// Make function globally available
window.clearCacheAndReload = clearCacheAndReload;

/* Event Listeners with enhanced error handling */
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

// Enhanced language switching with cache consideration
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

// Global error handlers
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  
  // Show user-friendly error for critical failures
  const app = document.getElementById('app');
  if (app && e.error.message.includes('import')) {
    app.innerHTML = `
      <div class="card" style="border-color: #fecaca; background: #fef2f2;">
        <h3 style="color: #dc2626;">Loading Error</h3>
        <p>There was a problem loading the application. This might be a cache issue.</p>
        <button onclick="clearCacheAndReload()" class="btn">Clear Cache & Reload</button>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Version info for debugging
console.log('App Version:', APP_VERSION);
console.log('Build Time:', new Date().toISOString());
