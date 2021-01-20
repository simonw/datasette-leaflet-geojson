from datasette.app import Datasette
import pytest


@pytest.mark.parametrize(
    "setting,expected",
    [
        (None, 10),
        (20, 20),
    ],
)
@pytest.mark.asyncio
async def test_plugin_configuration(setting, expected):
    ds = Datasette(
        [],
        memory=True,
        metadata={
            "plugins": {"datasette-leaflet-geojson": {"default_maps_to_load": setting}}
        },
    )
    html = (await ds.client.get("/")).text
    assert (
        "<script>window.DATASETTE_LEAFLET_GEOJSON_DEFAULT_MAPS_TO_LOAD = {};</script>".format(
            expected
        )
        in html
    )
