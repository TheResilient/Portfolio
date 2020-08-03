import * as THREE from "three";

/* #region LIGHTS */

const lightList = () => {

    let lights = new Array();

    const ambient = new THREE.AmbientLight(0xacbefe, 0.35);
    ambient.name = "Ambient";

    const sun = new THREE.DirectionalLight(0xd3d3d3, 1.5);
    sun.position.x = 0;
    sun.position.y = 500;
    sun.position.z = 200;
    sun.name = "Sun";

    const moon = new THREE.DirectionalLight(0xacbefe, 0);
    moon.position.x = -600;
    moon.position.y = 500;
    moon.position.z = 200;
    moon.name = "Moon";

    lights.push(ambient, sun, moon);

    return lights;
}
const lightColors = [
    new THREE.Color(0xd3d3d3),
    new THREE.Color(0xd7d4cc),
    new THREE.Color(0xdbd5c4),
    new THREE.Color(0xe0d7ba),
    new THREE.Color(0xe4d9b1),
    new THREE.Color(0xe8daa7),
    new THREE.Color(0xeddc9b),
    new THREE.Color(0xf1df8e),
    new THREE.Color(0xf6e17e),
    new THREE.Color(0xfde664),
    new THREE.Color(0xfde664),
];

/* #endregion */

/* #region VARIABLES */

const loadScene = new THREE.LoadingManager();
const lights = lightList();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, autoClear: true });
renderer.gammaOutput = true;

/* #endregion */

const setScene = (env, worm, title, mobile) => {

    if (!isDevice()) {

        let mainScene = env.scene;
        mainScene.name = title;

        //-- Background
        let sky = createSky();
        let night = createNight();
        mainScene.add(sky);
        mainScene.add(night);
        moveSky(sky);

        //-- Worm
        mainScene.getObjectByName("AppleGroup").add(worm.scene);

        //-- Setting lights
        for (let i = 0; i < lights.length; i++) {
            mainScene.add(lights[i]);
        }

        //-- Animations
        const animation = new THREE.AnimationMixer(env.scene);
        const action = animation.clipAction(env.animations[0]);
        action.play();

        //-- Worm Animation
        const clock = new THREE.Clock();
        const wormDance = new THREE.AnimationMixer(worm.scene);
        const wormAction = wormDance.clipAction(worm.animations[0]);
        wormAction.play();

        return { mainScene, renderer, animation, wormDance, clock };

    } else {

        let mainScene = new THREE.Scene();
        mainScene.name = title;

        //-- Camera
        let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1000, 6000);
        camera.updateProjectionMatrix();

        //-- Background
        let sky = createSky();
        let night = createNight();

        mainScene.add(camera);
        mainScene.add(sky);
        mainScene.add(night);
        moveSky(sky);

        return { mainScene, renderer, camera };

    }

}

const createSky = () => {

    let cube = new THREE.BoxGeometry(1500, 1500, 1500);
    let texCloud = new THREE.TextureLoader().load('assets/3D/sky/clouds.png', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, isDevice() ? -0.6 : -0.55);
        texture.repeat.set(2, 2);
    });

    let materialSky = new THREE.MeshBasicMaterial({
        map: texCloud,
        transparent: true,
        opacity: isDevice() ? 0 : 0.4,
        color: 0xFFFFFF,
        side: THREE.BackSide
    });

    let cubeSky = new THREE.Mesh(cube, materialSky);
    cubeSky.name = "sky";

    return cubeSky;

}

const createNight = () => {

    const mobile = isDevice();

    let geo = new THREE.Geometry();

    let starNumber = mobile ? 2000 : 6000;

    for (let i = 0; i < starNumber; i++) {

        let star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(mobile ? 4000 : 1500);
        star.y = THREE.Math.randFloatSpread(1500);
        star.z = mobile ? THREE.Math.randFloat(-700, -1700) : THREE.Math.randFloat(-200, -800);

        geo.vertices.push(star);

    }

    let starsMaterial = new THREE.PointsMaterial({ size: mobile ? 3 : 2, opacity: mobile ? 1 : 0, transparent: true });

    let geoNight = new THREE.Points(geo, starsMaterial);

    geoNight.name = "nightSky";

    return geoNight;

}

const moveSky = (sky) => {
    let offset = 0;

    setInterval(function () {
        sky.material.map.offset.x = offset;
        offset = offset - 0.0003;
    }, 30);
}

const isDevice = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

export { setScene, isDevice, lightColors, loadScene };
