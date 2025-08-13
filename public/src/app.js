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
    remove: "Remove"
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
    remove: "حذف"
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
    remove: "हटाएं"
  }
};
let lang = localStorage.getItem('lang') || 'en';
applyLang(lang);

function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  document.documentElement.dir = (l === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-switch .pill').forEach(b=>{
    b.setAttribute('aria-pressed', b.dataset.lang===l ? 'true':'false');
  });
}
export function t(key){ return i18n[lang][key] || key; }

export function goTo(path, params={}) {
  const qs = new URLSearchParams(params).toString();
  location.hash = `${path}${qs ? '?' + qs : ''}`;
}
export function getParams(){
  const q = (location.hash.split('?')[1] || '');
  return new URLSearchParams(q);
}
/* ============================
   BACK BUTTON (shared)
   ============================ */
// NEW: create once and insert into header
let __backBtn;
function ensureBackButton() {
  if (__backBtn) return __backBtn;
  __backBtn = document.createElement('button');
  __backBtn.id = 'backBtn';
  __backBtn.className = 'ghost back-btn';
  __backBtn.type = 'button';
  __backBtn.textContent = '← Back';
  __backBtn.setAttribute('aria-label', 'Go back');

  __backBtn.addEventListener('click', () => {
    // Prefer browser history; fall back to home
    if (history.length > 1) { history.back(); }
    else { goTo('#/'); }
  });

  const headerRow = document.querySelector('.header-row');
  if (headerRow) headerRow.insertBefore(__backBtn, headerRow.firstChild);
  return __backBtn;
}

function render() {
  const mount = document.getElementById('app');
  const hash = location.hash || '#/';
  const route = hash.split('?')[0];

  // NEW: make sure back button exists, then toggle its visibility
  const backBtn = ensureBackButton();
  const isHome = (route === '#/' || route === '#/select');
  backBtn.style.display = isHome ? 'none' : '';

  if (route === '#/' || route === '#/select') {
    FactorySelectView(mount, { t });
  } else if (route === '#/pistachio') {
    PistachioHome(mount, { t });
  } else if (route === '#/shift/new') {
    PistachioShift(mount, { t });
  } else if (route === '#/materials') {
    MaterialsView(mount, { t });
  } else {
    mount.innerHTML = `<div class="card"><p>Not Found</p></div>`;
  }

  const el = document.getElementById('todayDate');
  if (el) el.textContent = new Date().toLocaleDateString(document.documentElement.lang, { dateStyle: 'medium' });
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.pill');
  if (btn && btn.dataset.lang) { applyLang(btn.dataset.lang); render(); }
});

const dirBtn = document.getElementById('dirToggle');
if (dirBtn) dirBtn.addEventListener('click', ()=>{
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  document.documentElement.setAttribute('dir', current === 'ltr' ? 'rtl' : 'ltr');
});
