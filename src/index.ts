import * as Cesium from "cesium";
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";

(window as any).CESIUM_BASE_URL = "/";
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNzk3MTk3NS02M2RhLTRlYjItYTlmMi0wYjNhODEzYjY4ODgiLCJpZCI6NzQ1NjAsImlhdCI6MTYzNzg1MDg4M30.8bHL3R8nbB4IQOH42jBycGReeez-OJBjjLkXJAOJeAE";

(async function () {
    const positions = [];
    const x = 0;
    const y = 0;
    const z = -70;
    let roadLayer: Cesium.DataSource = null;
    const translation = Cesium.Cartesian3.fromArray([x, y, z]);
    const m = Cesium.Matrix4.fromTranslation(translation);
    const viewer = new Cesium.Viewer("cesiumContainer", {
        homeButton: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
    });
    /*  position: Cartesian3
     *  x: -2249516.377426562
     *  y: 5059025.299415036
     *  z: 3235945.4051602394
     *
     *
     */
    viewer.scene.debugShowFramesPerSecond = true;
    viewer.camera.setView({
        destination: new Cesium.Cartesian3(
            -2249516.377426562,
            5059025.299415036,
            3235945.4051602394
        ),
        orientation: {
            heading: 6.283185307179581,
            pitch: -1.5686741962373683,
            roll: 0,
        },
    });
    const tiles = new Cesium.Cesium3DTileset({
        url: "./tiles/tileset.json",
        maximumScreenSpaceError: 2, //最大的屏幕空间误差
        maximumMemoryUsage: 100000, //最大加载瓦片个数
        modelMatrix: m, //形状矩阵
    });
    const tileset = viewer.scene.primitives.add(tiles);
    const jsonRes = Cesium.GeoJsonDataSource.load(require("./road.geojson"));
    viewer.dataSources.add(jsonRes).then((layer) => {
        roadLayer = layer;
    });

    const MODE = {
        VIEW: 0,
        THREE_D_ANALYZE: 1,
    };

    function line(
        p1: Cesium.Cartesian3,
        p2: Cesium.Cartesian3,
        color: Cesium.Color
    ) {
        if (viewer !== null) {
            viewer.entities.add({
                polyline: {
                    positions: [p1, p2],
                    width: 2,
                    material: color,
                    depthFailMaterial: color,
                },
            });
        }
    }

    function point(position: Cesium.Cartesian3) {
        if (viewer.entities !== null) {
            viewer.entities.add({
                position: position,
                point: {
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 2,
                    pixelSize: 10,
                },
            });
        }
    }

    window.onload = () => {
        document.getElementById("hide3Dtiles").addEventListener("click", () => {
            if (tileset !== null) {
                tileset.show = !tileset.show;
            }
        });
        document.getElementById("hideroad").addEventListener("click", () => {
            if (roadLayer !== null) {
                roadLayer.show = !roadLayer.show;
            }
        });
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((event) => {
            const position = viewer.scene.pickPosition(event.position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
})();
