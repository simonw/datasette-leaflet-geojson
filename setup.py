from setuptools import setup
import os

VERSION = "0.8.1"


def get_long_description():
    with open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "README.md"),
        encoding="utf8",
    ) as fp:
        return fp.read()


setup(
    name="datasette-leaflet-geojson",
    description=" A Datasette plugin that renders GeoJSON columns using Leaflet",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    author="Simon Willison",
    url="https://github.com/simonw/datasette-leaflet-geojson",
    license="Apache License, Version 2.0",
    version=VERSION,
    packages=["datasette_leaflet_geojson"],
    entry_points={"datasette": ["leaflet_geojson = datasette_leaflet_geojson"]},
    package_data={"datasette_leaflet_geojson": ["static/datasette-leaflet-geojson.js"]},
    install_requires=["datasette>=0.54", "datasette-leaflet>=0.2"],
    extras_require={"test": ["pytest", "pytest-asyncio"]},
    tests_require=["datasette-leaflet-geojson[test]"],
)
