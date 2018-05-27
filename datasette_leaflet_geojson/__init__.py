from datasette import hookimpl


@hookimpl
def extra_css_urls():
    return [{
        "url": "https://unpkg.com/leaflet@1.3.1/dist/leaflet.css",
        "sri": "sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
    }]


@hookimpl
def extra_js_urls():
    return [{
        "url": "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js",
        "sri": "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw=="
    }, "/-/static-plugins/datasette_leaflet_geojson/datasette-leaflet-geojson.js"]
