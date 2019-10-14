from datasette_leaflet_geojson import extra_css_urls, extra_js_urls


def test_extra_css_urls():
    assert extra_css_urls()[0]["url"].endswith("/leaflet.css")


def test_extra_js_urls():
    assert extra_js_urls()[0]["url"].endswith("/leaflet.js")
