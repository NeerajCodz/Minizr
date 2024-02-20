import React from 'react';

function AdSenseAd() {
  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1783970539210840"
        data-ad-slot="6077276386"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );
}

export default AdSenseAd;
