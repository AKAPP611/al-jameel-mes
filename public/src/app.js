// app.js - Main application
import { FactorySelectView } from './views/factory-select.js';
import { PistachioHome } from './views/pistachio-home.js';
import { PistachioShift } from './views/pistachio-shift.js';
import { MaterialsView } from './views/materials.js';

// Translations
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

// Global state
let currentLang = 'en';

// Language functions
export function t(key) { 
  return i18n[currentLang] && i18n[currentLang][key] ? i18n[currentLang][key] : key; 
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  
  // Update language buttons
  document.querySelectorAll('.lang-switch .pill').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
}

// Navigation functions
export function goTo(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  location.hash = `${path}${qs ? '?' + qs : ''}`;
}

export function getParams() {
  const q = (location.hash.split('?')[1] || '');
  return new URLSearchParams(q);
}

// Back button management
let backBtn;
function ensureBackButton() {
  if (backBtn) return backBtn;
  
  backBtn = document.createElement('button');
  backBtn.id = 'backBtn';
  backBtn.className = 'ghost back-btn';
  backBtn.type = 'button';
  backBtn.innerHTML = `← ${t('back')}`;
  backBtn.setAttribute('aria-label', 'Go back');

  backBtn.addEventListener('click', () => {
    if (history.length > 1) { 
      history.back(); 
    } else { 
      goTo('#/'); 
    }
  });

  const headerRow = document.querySelector('.header-row');
  if (headerRow) {
    headerRow.insertBefore(backBtn, headerRow.firstChild);
  }
  
  return backBtn;
}

// Main render function
function render() {
  const mount = document.getElementById('app');
  if (!mount) return;
  
  const hash = location.hash || '#/';
  const route = hash.split('?')[0];

  // Manage back button
  const btn = ensureBackButton();
  const isHome = (route === '#/' || route === '#/select');
  if (btn) {
    btn.style.display = isHome ? 'none' : '';
    btn.innerHTML = `← ${t('back')}`;
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
            <h2>404 - Page not found</h2>
            <p>The requested route "${route}" was not found.</p>
            <button onclick="location.hash='#/'" class="btn">Go Home</button>
          </div>
        `;
    }
  } catch (error) {
    console.error('Render error:', error);
    mount.innerHTML = `
      <div class="card">
        <h2>Error Loading Page</h2>
        <p>There was an error loading this page: ${error.message}</p>
        <button onclick="location.hash='#/'" class="btn">Go Home</button>
      </div>
    `;
  }

  // Update date display
  const dateEl = document.getElementById('todayDate');
  if (dateEl) {
    try {
      dateEl.textContent = new Date().toLocaleDateString(
        document.documentElement.lang, 
        { dateStyle: 'medium' }
      );
    } catch (e) {
      dateEl.textContent = new Date().toLocaleDateString();
    }
  }
}

// Event listeners
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

// Language switching
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (btn && btn.dataset.lang) { 
    applyLang(btn.dataset.lang); 
    render(); 
  }
});

// Direction toggle
document.addEventListener('DOMContentLoaded', () => {
  const dirBtn = document.getElementById('dirToggle');
  if (dirBtn) {
    dirBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      document.documentElement.setAttribute('dir', current === 'ltr' ? 'rtl' : 'ltr');
    });
  }
});

// Initialize
applyLang(currentLang);
