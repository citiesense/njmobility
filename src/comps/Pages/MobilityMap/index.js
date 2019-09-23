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
      className="p-2"
      css={css(`
      .h_wrapper {
        width:100%;height:100%;margin:0 auto;background:#CCC; min-height: 800px;
      }
      .h_iframe {
        position:relative;width:100%;height:100%;margin:0 auto;background:#CCC; min-height: 800px;
      }

    `)}
    >
      <h5 className="page-title text-uppercase">New Jersey Mobility Map</h5>
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
          src="https://www.citiesense.com/dashboards/338/embed?filter%5Bbbox%5D=-74.62912917137147%2C40.46087054580426%2C-73.79966139793397%2C41.06208632868658&filter%5BareaId%5D=835&filter%5Btype%5D%5B0%5D=StreetscapeAsset&mapConfig%5Bzoom%5D=10&areaId=835&deck%5BTransportation%5D%5BNJ%20Railroad%20Stations%5D=on&deck%5BAdministrative%20Boundaries%5D%5BNJ%20Railroad%20Stations%5D=on&load%5BdashboardId%5D=338&load%5Bbbox%5D=-74.62912917137147%2C40.46087054580426%2C-73.79966139793397%2C41.06208632868658&load%5BshowDrawingTool%5D=true&load%5BshowBoundary%5D=false&load%5BpanelName%5D=&load%5BshowShapes%5D=false"
        />
        <div>
          <div id="disqus_thread" />
        </div>
      </div>
    </div>
  );
}
