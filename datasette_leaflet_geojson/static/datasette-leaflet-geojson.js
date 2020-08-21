document.addEventListener('DOMContentLoaded', () => {
    const loadDependencies = (callback) => {
        let loaded = [];
        function hasLoaded() {
            loaded.push(this);
            if (loaded.length == 2) {
                callback();
            }
        }
        let stylesheet = document.createElement('link');
        stylesheet.setAttribute('type', 'text/css');
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('href', 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.css');
        stylesheet.setAttribute('integrity', 'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==');
        stylesheet.setAttribute('crossorigin', 'anonymous');
        stylesheet.onload = hasLoaded;
        document.head.appendChild(stylesheet);
        let script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js';
        script.setAttribute('integrity', 'sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==');
        script.setAttribute('crossorigin', 'anonymous');
        script.onload = stylesheet.onload = hasLoaded;
        document.head.appendChild(script);
    };
    const getFullNodeText = (el) => {
        // https://stackoverflow.com/a/4412151
        if (!el) {
            return '';
        }
        if (typeof(el.textContent) != "undefined") {
            return el.textContent;
        }
        return el.firstChild.nodeValue;
    };
    const types = new Set([
        'Point',
        'MultiPoint',
        'LineString',
        'MultiLineString',
        'Polygon',
        'MultiPolygon',
        'GeometryCollection',
        'Feature',
        'FeatureCollection'
    ]);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // Only execute on table, query and row pages
    if (document.querySelector('table.rows-and-columns')) {
        let tds = document.querySelectorAll('table.rows-and-columns td');
        let tdsToUpgrade = [];
        Array.from(tds).filter((td) => (
            td.firstChild && td.firstChild.nodeValue &&
            (td.firstChild.nodeValue.trim().indexOf('{') === 0)
        )).forEach((td) => {
            let data;
            try {
                data = JSON.parse(getFullNodeText(td));
            } catch {
                return;
            }
            if (!types.has(data.type)) {
                return;
            }
            tdsToUpgrade.push({
                td: td,
                data: data
            });
        });
        if (tdsToUpgrade.length) {
            loadDependencies(() => {
                tdsToUpgrade.forEach(tdData => {
                    let td = tdData.td;
                    let data = tdData.data;
                    // OK, it should be GeoJSON - display it with leaflet
                    let el = document.createElement('div');
                    el.style.width = '100%';
                    el.style.minWidth = '400px';
                    el.style.height = '100%';
                    el.style.minHeight = '400px';
                    while (td.firstChild){
                        td.removeChild(td.firstChild);
                    }
                    td.appendChild(el);
                    let map = L.map(el, {layers: [L.tileLayer(tilesUrl, {
                        maxZoom: 19,
                        detectRetina: true,
                        attribution: attribution
                    })]});
                    let layer = L.geoJSON(data);
                    layer.addTo(map);
                    map.fitBounds(layer.getBounds(), {
                        maxZoom: 14
                    });
                });
            });
        }
        window.dispatchEvent(new Event('resize'));
    }
});
