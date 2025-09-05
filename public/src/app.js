// app.js - Complete version with cache busting (Fixed - No top-level await)
const APP_VERSION = '1.2.1'; // Increment this when making changes

// Dynamic imports with cache busting - moved inside functions
async function loadView(viewPath) {
  try {
    console.log('Loading view:', viewPath); // Add this line
    const module = await import(`${viewPath}?v=${APP_VERSION}&t=${Date.now()}`);
    return module;
  } catch (error) {
    console.error(`Failed to load view: ${viewPath}`, error); // This will show which file fails
    // Fallback: try without cache busting
    return import(viewPath);
  }
}

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
/* ADDED: Inventory placeholder views for Phase 1 */
function renderInventoryPlaceholder(mount, factoryId) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">📦 Inventory - ${factoryId.charAt(0).toUpperCase() + factoryId.slice(1)}</h2>
        <p class="section-sub">Inventory Management System (Phase 1 - Data Layer Ready)</p>
        
        <div class="grid grid-3" style="margin-top: 1rem;">
          <div class="kpi">
            <div class="label">Data Layer</div>
            <div class="value" style="color: #22c55e;">✓ Ready</div>
          </div>
          <div class="kpi">
            <div class="label">Factory ID</div>
            <div class="value">${factoryId}</div>
          </div>
          <div class="kpi">
            <div class="label">Phase</div>
            <div class="value">1 of 4</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="title">🔧 Phase 1 - Data Layer Complete</h3>
        <ul style="margin: 1rem 0 0 1rem; line-height: 1.8;">
          <li><strong>✅ State Management:</strong> Central inventory state with localStorage persistence</li>
          <li><strong>✅ Factory Scoping:</strong> All data isolated by factoryId: "${factoryId}"</li>
          <li><strong>✅ Seed Data:</strong> Initial pistachio items, locations, and inventory</li>
          <li><strong>✅ CRUD Operations:</strong> Add/update items, stock movements</li>
          <li><strong>✅ Storage Keys:</strong> inv:${factoryId}:v1</li>
        </ul>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #f0f9ff; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
          <strong>Ready for Phase 2:</strong> Stock Operations UI
        </div>
      </div>

      <div class="card">
        <h3 class="title">🧪 Test the Data Layer</h3>
        <p style="margin: 0.5rem 0;">Open browser console and try:</p>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem;">
          <div style="color: #0066cc;">import('./src/data/inventory-state.js').then(m => console.log(m.inventoryState.getState('pistachio')))</div>
        </div>
      </div>
    </section>
  `;
}

function renderOrdersPlaceholder(mount, factoryId) {
  mount.innerHTML = `
    <section class="grid">
      <div class="card">
        <h2 class="section">📋 Orders - ${factoryId.charAt(0).toUpperCase() + factoryId.slice(1)}</h2>
        <p class="section-sub">Order Management System (Phase 3)</p>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #fff7ed; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
          <strong>Coming in Phase 3:</strong> Reserve → Fulfill → Deduct → Cancel workflows
        </div>
      </div>
    </section>
  `;
}
/* Main Render Function with enhanced error handling and dynamic imports */
async function render() {
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

    // Show loading indicator while loading views
    mount.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="display: inline-block; width: 32px; height: 32px; border: 3px solid #f3f3f3; border-top: 3px solid #a32034; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p>Loading...</p>
      </div>
    `;

    // Route to appropriate view with dynamic imports
    try {
      switch(route) {
        case '#/':
        case '#/select':
          {
            const { FactorySelectView } = await loadView('./views/factory-select.js');
            FactorySelectView(mount, { t });
          }
          break;
        case '#/pistachio':
          {
            const { PistachioHome } = await loadView('./views/pistachio-home.js');
            PistachioHome(mount, { t });
          }
          break;
        case '#/shift/new':
          {
            const { PistachioShift } = await loadView('./views/pistachio-shift.js');
            PistachioShift(mount, { t });
          }
          break;
        case '#/materials':
          {
            const { MaterialsView } = await loadView('./views/materials.js');
            MaterialsView(mount, { t });
          }
          break;
        // ADDED: New inventory routes for pistachio factory
       case '#/inventory/overview':
{
  // Master inventory overview for all factories
  const { MasterInventoryView } = await loadView('./views/master-inventory-view.js');
  MasterInventoryView(mount, { t });
}
break;

case '#/inventory/pistachio':
{
  // Phase 2: Full inventory management UI
  const { InventoryView } = await loadView('./views/inventory-view.js');
  InventoryView(mount, { t, factoryId: 'pistachio' });
}
break;
       case '#/orders/pistachio':
          {
            // Phase 3: Full order management
            const { OrderView } = await loadView('./views/order-view.js');
            OrderView(mount, { t, factoryId: 'pistachio' });
          }
          break;
        // ADD THIS NEW CASE HERE:
        case '#/dashboard/pistachio':
          {
            // Phase 4: Complete inventory dashboard
            const { DashboardView } = await loadView('./views/dashboard-view.js');
            DashboardView(mount, { t, factoryId: 'pistachio' });
          }
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
          <details style="margin-top: 1rem;">
            <summary>Technical Details</summary>
            <pre style="background: #f5f5f5; padding: 0.5rem; font-size: 12px; white-space: pre-wrap;">${e.stack}</pre>
          </details>
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
  if (app && e.error && e.error.message.includes('import')) {
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

// Add loading animation styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loadingStyle);

// Version info for debugging
console.log('App Version:', APP_VERSION);
console.log('Build Time:', new Date().toISOString());
console.log('Browser support - Top-level await:', 'supported' in window ? 'yes' : 'no');
