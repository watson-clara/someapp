import{n as p,p as k}from"./index-CROiEWKh.js";import"history";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const F=o=>{let i=-25e3,r=0,e,l,s;const C=o.getBoolean("animated",!0)&&o.getBoolean("rippleEffect",!0),u=new WeakMap,I=t=>{i=p(t),v(t)},E=t=>{i=p(t),T(t)},_=t=>{if(t.button===2)return;const n=p(t)-g;i<n&&v(t)},M=t=>{const n=p(t)-g;i<n&&T(t)},m=()=>{s&&clearTimeout(s),s=void 0,e&&(w(!1),e=void 0)},v=t=>{e||h(y(t),t)},T=t=>{h(void 0,t)},h=(t,n)=>{if(t&&t===e)return;s&&clearTimeout(s),s=void 0;const{x:d,y:a}=k(n);if(e){if(u.has(e))throw new Error("internal error");e.classList.contains(f)||L(e,d,a),w(!0)}if(t){const D=u.get(t);D&&(clearTimeout(D),u.delete(t)),t.classList.remove(f);const R=()=>{L(t,d,a),s=void 0};S(t)?R():s=setTimeout(R,q)}e=t},L=(t,n,d)=>{if(r=Date.now(),t.classList.add(f),!C)return;const a=U(t);a!==null&&(A(),l=a.addRipple(n,d))},A=()=>{l!==void 0&&(l.then(t=>t()),l=void 0)},w=t=>{A();const n=e;if(!n)return;const d=b-Date.now()+r;if(t&&d>0&&!S(n)){const a=setTimeout(()=>{n.classList.remove(f),u.delete(n)},b);u.set(n,a)}else n.classList.remove(f)},c=document;c.addEventListener("ionGestureCaptured",m),c.addEventListener("touchstart",I,!0),c.addEventListener("touchcancel",E,!0),c.addEventListener("touchend",E,!0),c.addEventListener("pointercancel",m,!0),c.addEventListener("mousedown",_,!0),c.addEventListener("mouseup",M,!0)},y=o=>{if(o.composedPath!==void 0){const i=o.composedPath();for(let r=0;r<i.length-2;r++){const e=i[r];if(!(e instanceof ShadowRoot)&&e.classList.contains("ion-activatable"))return e}}else return o.target.closest(".ion-activatable")},S=o=>o.classList.contains("ion-activatable-instant"),U=o=>{if(o.shadowRoot){const i=o.shadowRoot.querySelector("ion-ripple-effect");if(i)return i}return o.querySelector("ion-ripple-effect")},f="ion-activated",q=200,b=200,g=2500;export{F as startTapClick};
