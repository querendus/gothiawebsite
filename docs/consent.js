/*
 * Cookie-Consent (Opt-in) für die Gothia-Website.
 * Google Analytics wird AUSSCHLIESSLICH nach aktiver Zustimmung geladen.
 * Auswahl wird lokal im Browser (localStorage) gespeichert.
 * Erneut öffnen/Widerruf: window.gothiaCookieSettings()  (z. B. Footer-Link)
 */
(function () {
    'use strict';

    var GA_ID = 'G-TDHNXVECH4';
    var KEY = 'gothia-consent';           // Werte: 'granted' | 'denied'
    var gaLoaded = false;
    var banner = null;

    /* ── Google Analytics laden (nur nach Zustimmung) ── */
    function loadGA() {
        if (gaLoaded) return;
        gaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
    }

    function readChoice() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function saveChoice(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
    }

    /* ── Banner-Styles (einmalig einfügen) ── */
    function injectStyles() {
        if (document.getElementById('gothia-cc-style')) return;
        var css =
            '.gothia-cc{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:2147483000;' +
            'max-width:720px;margin:0 auto;background:#002b4c;color:#fff;border-radius:1rem;' +
            'box-shadow:0 20px 60px rgba(0,0,0,.35);padding:1.1rem 1.25rem;' +
            "font-family:'Manrope',system-ui,-apple-system,sans-serif;" +
            'transform:translateY(160%);opacity:0;transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s;}' +
            '.gothia-cc.show{transform:none;opacity:1;}' +
            '.gothia-cc strong{display:block;font-size:1rem;margin-bottom:.35rem;}' +
            '.gothia-cc p{font-size:.88rem;line-height:1.55;margin:0 0 .9rem;color:rgba(255,255,255,.85);}' +
            '.gothia-cc a{color:#d4af37;text-decoration:underline;}' +
            '.gothia-cc .btns{display:flex;gap:.6rem;flex-wrap:wrap;}' +
            '.gothia-cc button{flex:1 1 auto;min-width:150px;cursor:pointer;border:none;border-radius:99px;' +
            'padding:.72rem 1.2rem;font-weight:700;font-size:.9rem;font-family:inherit;transition:background .2s,transform .2s;}' +
            '.gothia-cc .accept{background:#29a520;color:#fff;}' +
            '.gothia-cc .accept:hover{background:#1d7a17;transform:translateY(-1px);}' +
            '.gothia-cc .reject{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);}' +
            '.gothia-cc .reject:hover{background:rgba(255,255,255,.2);}' +
            '@media(max-width:520px){.gothia-cc button{flex-basis:100%;}}';
        var st = document.createElement('style');
        st.id = 'gothia-cc-style';
        st.textContent = css;
        document.head.appendChild(st);
    }

    function buildBanner() {
        var el = document.createElement('div');
        el.className = 'gothia-cc';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', 'Cookie-Hinweis');
        el.innerHTML =
            '<strong>Cookies &amp; Statistik</strong>' +
            '<p>Wir nutzen <b>Google Analytics</b>, um zu verstehen, wie unsere Seite genutzt wird — ' +
            'aber nur mit deiner Zustimmung. Notwendige Funktionen kommen ohne Cookies aus. ' +
            'Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
            '<div class="btns">' +
            '<button type="button" class="reject">Nur notwendige</button>' +
            '<button type="button" class="accept">Akzeptieren</button>' +
            '</div>';
        el.querySelector('.accept').addEventListener('click', accept);
        el.querySelector('.reject').addEventListener('click', reject);
        return el;
    }

    function showBanner() {
        injectStyles();
        if (!banner) {
            banner = buildBanner();
            document.body.appendChild(banner);
        }
        // Reflow erzwingen, dann einblenden
        void banner.offsetWidth;
        banner.classList.add('show');
    }
    function hideBanner() {
        if (banner) banner.classList.remove('show');
    }

    function accept() { saveChoice('granted'); hideBanner(); loadGA(); }
    function reject() { saveChoice('denied'); hideBanner(); }

    /* Öffentlich: Banner erneut öffnen (Auswahl ändern / Einwilligung widerrufen) */
    window.gothiaCookieSettings = function () {
        if (document.body) showBanner();
        else document.addEventListener('DOMContentLoaded', showBanner);
    };

    function init() {
        var c = readChoice();
        if (c === 'granted') loadGA();
        else if (c !== 'denied') showBanner();   // nur zeigen, wenn noch nicht entschieden
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
