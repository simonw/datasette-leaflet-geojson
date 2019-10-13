document.addEventListener('DOMContentLoaded', () => {
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
        Array.from(tds).filter((td) => (
            td.firstChild && td.firstChild.nodeValue &&
            (td.firstChild.nodeValue.trim().indexOf('{') === 0)
        )).forEach((td) => {
            let data;
            try {
                data = JSON.parse(td.firstChild.nodeValue);
            } catch {
                return;
            }
            if (!types.has(data.type)) {
                return;
            }
            // OK, it should be GeoJSON - display it with leaflet
            let el = document.createElement('div');
            el.style.width = '100%';
            el.style.minWidth = '400px';
            el.style.height = '100%';
            el.style.minHeight = '400px';
            td.replaceChild(el, td.firstChild);
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
        window.dispatchEvent(new Event('resize'));
    }
});
