// Minimal hash router + i18n + dir toggle
import { FactorySelectView } from './views/factory-select.js';

const i18n = {
  en: { factories: "Factories", today: "Today", efficiency: "Efficiency", rejectRate: "Reject Rate", view: "View", selectFactory: "Select a Factory" },
  ar: { factories: "المصانع", today: "اليوم", efficiency: "الكفاءة", rejectRate: "نسبة الرفض", view: "عرض", selectFactory: "اختر مصنعًا" },
  hi: { factories: "कारख़ाने", today: "आज", efficiency: "दक्षता", rejectRate: "रिजेक्ट दर", view: "देखें", selectFactory: "फ़ैक्टरी चुनें" }
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
function t(key){ return i18n[lang][key] || key; }

function render() {
  const mount = document.getElementById('app');
  const hash = location.hash || '#/';
  const route = hash.split('?')[0];
  if (route === '#/' || route === '#/select') {
    FactorySelectView(mount, { t });
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

export function goTo(path, params={}) {
  const qs = new URLSearchParams(params).toString();
  location.hash = `${path}${qs ? '?' + qs : ''}`;
}
export function getText(key){ return t(key); }
