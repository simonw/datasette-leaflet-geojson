from datasette_leaflet_geojson import render_cell
import json
import pytest


@pytest.mark.parametrize(
    "value,should_render",
    (
        ("", False),
        (3, False),
        ("{not-json", False),
        ("{}", False),
        ("{}", False),
        ('{"type": "Bad"}', False),
        ('{"type": "Polygon"}', True),
        ('{"type": "FeatureCollection"}', True),
    ),
)
def test_render_cell(value, should_render):
    expected = value if should_render else None
    actual = render_cell(value)
    assert expected == actual


def test_render_cell_truncates_floating_points():
    value = json.dumps(
        {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [-122.3300578616492, 37.44676099830318],
                        [-122.3287538805132, 37.44793926867058],
                    ]
                ]
            ],
        }
    )
    actual = render_cell(value)
    assert {
        "type": "MultiPolygon",
        "coordinates": [[[[-122.33006, 37.44676], [-122.32875, 37.44794]]]],
    } == json.loads(actual)
