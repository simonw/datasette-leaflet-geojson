from datasette_leaflet_geojson import render_cell
import pytest


@pytest.mark.parametrize("value,should_render", (
    ("", False),
    (3, False),
    ("{not-json", False),
    ("{}", False),
    ("{}", False),
    ('{"type": "Bad"}', False),
    ('{"type": "Polygon"}', True),
    ('{"type": "FeatureCollection"}', True),
))
def test_render_cell(value, should_render):
    expected = value if should_render else None
    actual = render_cell(value)
    assert expected == actual
