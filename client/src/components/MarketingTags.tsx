import React, { useEffect } from "react";

type Props = {
  gtmContainerId?: string;
  facebookPixelId?: string;
};

function normalizeGtmId(raw?: string): string | null {
  const s = String(raw ?? "").trim().toUpperCase();
  return /^GTM-[A-Z0-9]+$/u.test(s) ? s : null;
}

function normalizeFbPixelId(raw?: string): string | null {
  const digits = String(raw ?? "").replace(/\D/gu, "");
  return /^\d{5,}$/u.test(digits) ? digits : null;
}

/**
 * Injects GTM + Meta Pixel once (SPA). URLs use CDN defaults; IDs come from Customize (Mongo).
 */
export const MarketingTags: React.FC<Props> = ({
  gtmContainerId,
  facebookPixelId,
}) => {
  useEffect(() => {
    const gtm = normalizeGtmId(gtmContainerId);
    const fbPixel = normalizeFbPixelId(facebookPixelId);

    if (gtm && !document.getElementById("marketing-gtm-inline")) {
      const scr = document.createElement("script");
      scr.id = "marketing-gtm-inline";
      scr.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`;
      document.head.appendChild(scr);

      const nos = document.createElement("noscript");
      nos.id = "marketing-gtm-noscript";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtm)}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      nos.appendChild(iframe);
      document.body.prepend(nos);
    }

    if (fbPixel && !document.getElementById("marketing-fbq-inline")) {
      const fb = document.createElement("script");
      fb.id = "marketing-fbq-inline";
      fb.innerHTML =
        "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
        "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;" +
        "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;" +
        "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}" +
        "(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
        `fbq('init','${fbPixel}');fbq('track','PageView');`;
      document.head.appendChild(fb);

      const nosFb = document.createElement("noscript");
      nosFb.id = "marketing-fb-pixel-noscript";
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.alt = "";
      img.src = `https://www.facebook.com/tr?id=${encodeURIComponent(fbPixel)}&ev=PageView&noscript=1`;
      nosFb.appendChild(img);
      document.body.prepend(nosFb);
    }
  }, [gtmContainerId, facebookPixelId]);

  return null;
};
