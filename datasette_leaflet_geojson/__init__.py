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
    # plugin interferes with it
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
        # Reduce floating point accuracy to something sensible
        return json.dumps(round_floats(data))
    return None


def round_floats(o):
    if isinstance(o, float):
        return round(o, 5)
    if isinstance(o, dict):
        return {k: round_floats(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [round_floats(x) for x in o]
    return o


@hookimpl
def extra_js_urls(columns, datasette):
    if not columns:
        return None
    return [
        {
            "url": datasette.urls.static_plugins(
                "datasette-leaflet-geojson", "datasette-leaflet-geojson.js"
            ),
            "module": True,
        }
    ]


@hookimpl
def extra_body_script(datasette, database, table):
    config = (
        datasette.plugin_config(
            "datasette-leaflet-geojson", database=database, table=table
        )
        or {}
    )
    return "window.DATASETTE_LEAFLET_GEOJSON_DEFAULT_MAPS_TO_LOAD = {};".format(
        json.dumps(config.get("default_maps_to_load") or 10)
    )
