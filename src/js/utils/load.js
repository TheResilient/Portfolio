import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as utils from "./scene";
import { stateScene } from "./ui";
import * as dat from 'dat.gui';

/* #region VARIABLES */

const loader = new GLTFLoader(utils.loadScene);

//- Standard
let camera, scene, renderer;

//- Apple
let anim, sun, moon, appleGroup, picciolo, badAppleObj;

//- Worm
let worm, wormObj, wormDance, clock;

//- Utils
let mouseMove = 0;
let triggerScroll = false;

/* #endregion */

/* #region FUNCTIONS */

const changeBack = () => {

  let backgroundSky = scene.getObjectByName("sky");
  let backgroundNight = scene.getObjectByName("nightSky");

  if (stateScene.night.progress() > 0 && !triggerScroll) {

    backAnimate(backgroundSky, false, 0.4);
    backAnimate(backgroundNight, true, 1);
    triggerScroll = true;

  } else if (stateScene.night.progress() <= 0 && triggerScroll) {

    backAnimate(backgroundSky, true, 0.4);
    backAnimate(backgroundNight, false, 1);
    triggerScroll = false;

  }

}

const noScroll = () => {
  window.scrollTo(0, 0);
}

const appleAnimate = (obj, min, max) => {

  let interval = setInterval(step, 2);

  function step() {
    if (min >= max) {
      clearInterval(interval);
      window.removeEventListener('scroll', noScroll);
    } else {
      min = min + 2;
      position(min);
    }
  }

  function position(num) {
    obj.position.y = num;
  }

}

const backAnimate = (obj, show, op) => {

  let min = 0;
  let max = op;

  let interval = setInterval(step, 5);

  function step() {
    if (show) {

      if (min >= max) {
        clearInterval(interval);
      } else {
        min = min + 0.01;
        update(min);
      }

    } else {

      if (max <= min) {
        clearInterval(interval);
      } else {
        max = max - 0.01;
        update(max);
      }

    }
  }

  function update(num) {
    obj.material.opacity = num;
    obj.matrixAutoUpdate = false;
    obj.updateMatrix();
  }

}

const lightSet = () => {

  //- Get duration from the start of the morning to the end of the sunset
  let sunDuration = stateScene.morning.duration() + stateScene.sunset.duration() + stateScene.morning.offset();

  //- Get duration from the start to the end of the sunset
  let scrollSunset = stateScene.sunset.progress();

  //- Change Sun light
  sun.position.x = calcScroll(sunDuration, false) * 8;
  sun.position.y = calcScroll(sunDuration, true) * 5;
  sun.intensity = 1.5 - (scrollSunset * 1.5);
  sun.color = scrollSunset >= 0 ? utils.lightColors[Math.floor(scrollSunset / 10)] : utils.lightColors[0];

  //- Enable Moon light
  moon.intensity = stateScene.night.progress() * 0.7;

  //- Camera change
  let progressRot = progNumbers(284.3, 270, stateScene.morning.progress());
  if (progressRot > 270) {
    camera.position.z = Math.round(progressRot);
  }

}

const rottenApple = () => {

  //- Initial keyframes
  setTime(anim, calcScroll(document.body.scrollHeight / 2, false) * 0.005);

  //- Alpha Map & Opacity
  badAppleObj.material.opacity = stateScene.sunset.progress() * 2;

  //- Worm
  wormObj.position.x = stepNumbers(0, 26, stateScene.night.progress());
  wormObj.position.y = stepNumbers(-15, -24, stateScene.night.progress());

}

/* #endregion */

/* #region EVENT LISTENERS */

const onScrollPage = (event) => {

  changeBack();

  lightSet();

  rottenApple();

}

const onMouseMove = (event) => {
  //-- Thanks to this example https://threejs.org/examples/#webgl_materials_cubemap_balls_reflection
  mouseMove = (event.clientX - (window.innerWidth / 2)) / 12; //-- Camera moving
}

const onResize = (event) => {

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

}

const onMobileOrientation = (eventData) => {

  mouseMove = Math.round(eventData.gamma) * 10;

}

/* #endregion */

/* #region WINDOW UTILS */

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.calcScroll = function (height, reverse) {
  //- From 0 to 100 or 100 to 0
  if (!reverse) {
    return Math.floor(document.documentElement.scrollTop / (height - document.documentElement.clientHeight) * 100);
  } else {
    return (100 - Math.floor(document.documentElement.scrollTop / (height - document.documentElement.clientHeight) * 100));
  }
}

window.progNumbers = function (x, y, progress) {
  return x - ((x - y) * progress);
}

window.stepNumbers = function (x, y, progress) {
  return (Math.abs(y - x) * progress) + Math.min(x, y);
}

window.setTime = function (mixer, timeInSeconds) {

  // Allows you to seek to a specific time in an animation (copied from the latest verion of three).
  mixer.time = 0; // Zero out time attribute for AnimationMixer object;

  for (var i = 0; i < mixer._actions.length; i++) {
    mixer._actions[i].time = 0; // Zero out time attribute for all associated AnimationAction objects.
  }

  return mixer.update(timeInSeconds); // Update used to set exact time. Returns AnimationMixer object.

}

window.addEventListener('scroll', noScroll);


/* #endregion */

/* #region MAIN */

const afterLoad = () => {

  if (!utils.isDevice()) {

    let introTl = new TimelineMax({
      delay: 1,
      ease: Linear.easeNone
    });

    introTl.to("#loading", 0.3, { opacity: 0 });
    introTl.to("#logo", 0.5, { opacity: 1 }, ">1");
    introTl.to("#dots", 0.3, { right: 0 }, "<");
    introTl.to("#scroll", 0.3, { left: 0 }, "<");
    introTl.to("#mainObj", 0.8, { opacity: 1 }, ">0.9");
    introTl.add(function () {
      appleAnimate(appleGroup, -90, 8);
    });

  } else {

    let introMobTl = new TimelineMax({
      delay: 2,
      ease: Linear.easeNone
    });

    introMobTl.to("#loading", 0.3, { opacity: 0 });
    introMobTl.to("#logo", 0.5, { opacity: 1 }, ">1");
    introMobTl.to("#swipe", 0.3, { bottom: 45 }, "<");
    introMobTl.to("#content", 0.3, { opacity: 1 }, "<");
    introMobTl.to("#mainObj", 0.8, { opacity: 1 }, ">");

  }

}

const init = (env, device) => {

  const canvas = document.getElementById("mainObj");

  if (!device) {

    const apple = utils.setScene(env, worm, "SLF-badAss");

    scene = apple.mainScene;
    renderer = apple.renderer;
    anim = apple.animation;
    wormDance = apple.wormDance;
    clock = apple.clock;

    sun = scene.getObjectByName("Sun");
    moon = scene.getObjectByName("Moon");
    picciolo = scene.getObjectByName("Picciolo");

    //-- Apples
    const appleObj = scene.getObjectByName("MelaBackup");
    badAppleObj = scene.getObjectByName("MelaRotten");
    appleGroup = scene.getObjectByName("AppleGroup");

    //-- Remove metalness
    appleObj.material.flatShading = true;
    appleObj.material.metalness = 0;
    appleObj.material.roughness = 0.6;

    badAppleObj.material.opacity = 0;
    badAppleObj.material.metalness = 0;
    badAppleObj.material.roughness = 0.7;

    picciolo.children[0].material.metalness = 0;

    //-- Alpha Map
    badAppleObj.material.transparent = true;

    //-- Worm
    wormObj = scene.getObjectByName("Worm");
    wormObj.material.metalness = 0;
    wormObj.material.roughness = 0.5;

    //-- Init
    appleGroup.position.y = -100;

    //-- Initialize camera
    camera = scene.getObjectByName("CameraC4D");
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //-- Append
    canvas.appendChild(renderer.domElement);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //-- Events
    document.addEventListener('scroll', onScrollPage, false);
    document.addEventListener('mousemove', onMouseMove, false);

    sceneRender();

  } else {

    const sceneMobile = utils.setScene(null, "SLF-badAss", true);

    scene = sceneMobile.mainScene;
    renderer = sceneMobile.renderer;
    camera = sceneMobile.camera;

    camera.aspect = window.innerWidth / window.innerHeight;

    //-- Append
    canvas.appendChild(renderer.domElement);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('deviceorientation', onMobileOrientation, false);

    mobileRender();

  }

  window.addEventListener('resize', onResize, false);

};

const sceneRender = () => {

  requestAnimationFrame(sceneRender);

  //- Move camera on x Axis
  camera.position.x += (mouseMove - camera.position.x) * .05;
  camera.lookAt(3, 15, 0);

  //- Picciolo bug solver
  picciolo.rotation.z = 6;

  //- Worm Dance
  wormDance.update(clock.getDelta());

  //- Obj Render
  renderer.render(scene, camera);

}

const mobileRender = () => {

  requestAnimationFrame(mobileRender);

  //- Move camera on Orientation
  camera.position.x += (mouseMove - camera.position.x) * .1;

  renderer.render(scene, camera);

}

if (!utils.isDevice()) {

  //-- Loading apple
  utils.loadScene.onProgress = function (item, loaded, total) {
    if (loaded / total == 1) {
      afterLoad();
    }
  };

  //- Load Worm
  loader.load("assets/3D/WormGL.gltf", function (gltf) {
    worm = gltf;
  });

  //- Show Apple
  loader.load("assets/3D/MelaGL.gltf", function (gltf) {
    init(gltf, false);
  });

} else {

  //- Show Camera + Background
  init(null, true);
  afterLoad();

}

/* #endregion */