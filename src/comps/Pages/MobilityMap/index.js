/*@flow*/
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';

export default function MobilityMap() {
  useEffect(() => {
    window.disqus_config = function() {
      this.page.url = window.location.href; // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = 'citiesense-1'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() {
      // DON'T EDIT BELOW THIS LINE
      const d = document,
        s = d.createElement('script');
      s.src = 'https://citiesense-1.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }, []);
  return (
    <div
      css={css(`
      .h_wrapper {
        width:100%;height:100%;margin:0 auto;background:#CCC; min-height: 800px;
      }
      .h_iframe {
        position:relative;width:100%;height:100%;margin:0 auto;background:#CCC; min-height: 800px;
      }

    `)}
    >
      <h1 className="page-title">New Jersey Mobility Map</h1>
      <div
        className="map-container"
        css={css(`
          height: 50vh;
          iframe {
            width: 100%;
            height: 100%;
            border-bottom: solid 1px #ccc;
            border-top: solid 1px #ccc;
          }
      `)}
      >
        <iframe
          title="map"
          frameBorder="0"
          src="https://www.citiesense.com/dashboards/338/embed?filter%5Bbbox%5D=-78.19476127624513%2C38.702223920388604%2C-72.23467826843263%2C41.61913191732401&filter%5BareaId%5D=835&filter%5Btype%5D%5B0%5D=StreetscapeAsset&mapConfig%5Bzoom%5D=8&areaId=835&load%5BdashboardId%5D=338&load%5Bbbox%5D=-78.19476127624513%2C38.702223920388604%2C-72.23467826843263%2C41.61913191732401&load%5BshowDrawingTool%5D=true&load%5BshowBoundary%5D=true&load%5BpanelName%5D=&load%5BshowShapes%5D=false"
        />
        <div>
          <div id="disqus_thread" />
        </div>
      </div>
    </div>
  );
}
