export function Button({ text, attrs = {} }) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = attrs.class ? attrs.class : 'btn';
  Object.entries(attrs).forEach(([k,v])=>{
    if (k !== 'class') btn.setAttribute(k, v);
  });
  btn.setAttribute('type','button');
  btn.style.minHeight = '44px';
  return btn.outerHTML;
}
