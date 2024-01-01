document.addEventListener("DOMContentLoaded", () => {
  const loadDependencies = (callback) => {
    let loaded = [];
    function hasLoaded() {
      loaded.push(this);
      if (loaded.length == 2) {
        callback();
      }
    }
    let stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", datasette.leaflet.CSS_URL);
    stylesheet.onload = hasLoaded;
    document.head.appendChild(stylesheet);
    import(datasette.leaflet.JAVASCRIPT_URL).then(hasLoaded);
  };
  const getFullNodeText = (el) => {
    // https://stackoverflow.com/a/4412151
    if (!el) {
      return "";
    }
    if (typeof el.textContent != "undefined") {
      return el.textContent;
    }
    return el.firstChild.nodeValue;
  };
  const types = new Set([
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
    "Feature",
    "FeatureCollection",
  ]);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tilesUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  function upgradeTd({ td, data }, activate) {
    // OK, it should be GeoJSON - display it with leaflet
    let el = document.createElement("div");
    el.style.width = "100%";
    el.style.minWidth = "400px";
    el.style.height = "100%";
    el.style.minHeight = "400px";
    el.style.backgroundColor = "#eee";
    while (td.firstChild) {
      td.removeChild(td.firstChild);
    }
    td.appendChild(el);
    function addMap() {
      let map = L.map(el, {
        layers: [
          L.tileLayer(tilesUrl, {
            maxZoom: 19,
            detectRetina: true,
            attribution: attribution,
          }),
        ],
      });
      try {
        let layer = L.geoJSON(data);
        layer.addTo(map);
        map.fitBounds(layer.getBounds(), {
          maxZoom: 14,
        });
      } catch (error) {
        console.warn("GeoJSON parse failed", data, error);
        let div = document.createElement("div");
        div.innerHTML = "Error while displaying map: " + error;
        div.style.color = "#666";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.height = "400px";

        map.remove();
        el.appendChild(div);
      }
    }
    if (activate) {
      addMap();
    } else {
      let a = document.createElement("a");
      a.innerHTML = "Click to show map";
      a.href = "#";
      a.style.color = "#666";
      a.style.display = "flex";
      a.style.justifyContent = "center";
      a.style.alignItems = "center";
      a.style.height = "400px";
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        a.parentNode.removeChild(a);
        addMap();
      });
      el.appendChild(a);
    }
  }
  // Only execute on table, query and row pages
  if (document.querySelector("table.rows-and-columns")) {
    let tds = document.querySelectorAll("table.rows-and-columns td");
    let tdsToUpgrade = [];
    Array.from(tds)
      .filter(
        (td) =>
          td.firstChild &&
          td.firstChild.nodeValue &&
          td.firstChild.nodeValue.trim().indexOf("{") === 0
      )
      .forEach((td) => {
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
          data: data,
        });
      });
    if (tdsToUpgrade.length) {
      loadDependencies(() => {
        let numDone = 0;
        tdsToUpgrade.forEach((item) => {
          try {
            upgradeTd(
              item,
              numDone < window.DATASETTE_LEAFLET_GEOJSON_DEFAULT_MAPS_TO_LOAD
            );
            numDone += 1;
          } catch (error) {
            console.warn("Failed to add map for", item, error);
          }
        });
      });
    }
    // don't throw an error if another JS library expect Events to be attached to the DOM.
    // Happens with Plot/D3
    try {
      window.dispatchEvent(new Event("resize"));
    } catch {}
  }
});
