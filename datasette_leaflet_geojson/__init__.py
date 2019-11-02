from datasette import hookimpl
import json

GEOJSON_TYPES = {
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
    "Feature",
    "FeatureCollection",
}


@hookimpl(tryfirst=True)
def render_cell(value):
    # If value is JSON that looks like geojson, return it so no other
    # plugin inteferes with it
    # https://github.com/simonw/datasette-leaflet-geojson/issues/3
    try:
        data = json.loads(value)
    except (ValueError, TypeError):
        return None
    if not isinstance(data, dict):
        return None
    if "type" not in data:
        return None
    if data["type"] in GEOJSON_TYPES:
        return value
    return None


@hookimpl
def extra_css_urls():
    return [
        {
            "url": "https://unpkg.com/leaflet@1.5.1/dist/leaflet.css",
            "sri": "sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==",
        }
    ]


@hookimpl
def extra_js_urls():
    return [
        {
            "url": "https://unpkg.com/leaflet@1.5.1/dist/leaflet.js",
            "sri": "sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==",
        },
        "/-/static-plugins/datasette_leaflet_geojson/datasette-leaflet-geojson.js",
    ]
