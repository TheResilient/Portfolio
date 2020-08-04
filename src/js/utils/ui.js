import { TweenMax, ScrollToPlugin, Linear, TimelineMax } from 'gsap/all';
import ScrollMagic from 'scrollmagic';
import Swiper from 'swiper';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

let slfBlacks; //-- Logo black levels svg 
let stateScene; //-- Scenes of each state
let animState = false; //-- Set the Slf logo anim state  

/* #region UI */

const scrollAnim = () => {

    handleClick(document.querySelectorAll("a"), true);

    let controller = new ScrollMagic.Controller({ loglevel: -1 });

    const globalOffset = 100;
    const sectHeight = Math.round(document.body.scrollHeight / 3) - (globalOffset * 3);
    const sceneHeight = Math.round(sectHeight / 6);

    controller.scrollTo(function (time, newpos) {
        TweenMax.to(window, time, { scrollTo: { y: newpos }, ease: Linear.easeNone });
    });

    let firstMorning = TweenMax.to(".morning.fLeft span", 1, { marginLeft: 0, opacity: 1 });
    let secondMorning = TweenMax.to(".morning.fRight span", 1, { marginRight: 0, opacity: 1 });
    let exitMorning = TweenMax.to(".morning", 1, { scale: 1.1, opacity: 0 });

    let firstSunset = TweenMax.to(".sunset.fRight span", 1, { marginRight: 0, opacity: 1, scale: 1 });
    let secondSunset = TweenMax.to(".sunset.fLeft", 1, { scale: 1, opacity: 1 });
    let exitSunset = TweenMax.to(".sunset", 1, { scale: 1.1, opacity: 0 });

    let firstNight = TweenMax.to(".night.fLeft span", 1, { marginLeft: 0, opacity: 1, scale: 1 });
    let secondNight = TweenMax.to(".night.fRight span, .night.fRight p", 1, { marginRight: 0, marginTop: 0, opacity: 1, });

    //-- Scroll speed of the dots
    let scrollTimeM = 1.5;
    let scrollTimeS = 2.5;
    let scrollTimeN = 4;

    //-- MORNING

    let morningScene = new ScrollMagic.Scene({ duration: sectHeight, offset: globalOffset })
        .on('enter', function (e) {
            activeDot("Morning", true);
            document.getElementById("scroll").classList.add("scrolled");
            scrollTimeM = 1.5;
            scrollTimeN = 4;
        })
        .on('leave', function (e) {
            if (e.scrollDirection == "REVERSE") {
                document.getElementById("scroll").classList.remove("scrolled");
            } else {
                if (!animState) { logoAnim(); animState = true; };
            }
            activeDot("Morning", false)
        })
        .addTo(controller);

    let firstsScene = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: 0 })
        .setTween(firstMorning)
        .addTo(controller);

    let secondScene = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: sceneHeight * 2 + globalOffset })
        .setTween(secondMorning)
        .addTo(controller);

    let morningExit = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: sceneHeight * 5 })
        .setTween(exitMorning)
        .addTo(controller);

    //-- SUNSET

    let sunsetScene = new ScrollMagic.Scene({ duration: sectHeight, offset: sectHeight + globalOffset })
        .on('enter', function (e) {
            activeDot("Sunset", true);
            scrollTimeM = 2.5;
            scrollTimeN = 3.5;
            handleClick(document.querySelectorAll(".sunset a"), false);
        })
        .on('leave', function (e) {
            activeDot("Sunset", false);
            handleClick(document.querySelectorAll(".sunset a"), true);
        })
        .addTo(controller);

    let projectSentence = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: sectHeight + globalOffset })
        .setTween(firstSunset)
        .addTo(controller);

    let projectScene = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: sectHeight + sceneHeight + globalOffset })
        .setTween(secondSunset)
        .addTo(controller);

    let sunsetExit = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: sectHeight + (sceneHeight * 5) })
        .setTween(exitSunset)
        .addTo(controller);

    //---- arrow clicks
    const arrows = document.querySelectorAll("#arrows .arrow");
    sliderPrj(arrows);

    //-- NIGHT

    let nightScene = new ScrollMagic.Scene({ duration: sectHeight, offset: sectHeight * 2 + globalOffset })
        .on('enter', function (e) {
            activeDot("Night", true);
            scrollTimeM = 4;
            scrollTimeN = 1.5;
            handleClick(document.querySelectorAll(".night a"), false);
            if (slfBlacks != null) {
                TweenMax.to(slfBlacks, 0.4, { fill: "#fff", opacity: 0.3 });
            }
        })
        .on('leave', function (e) {
            activeDot("Night", false);
            handleClick(document.querySelectorAll(".night a"), true);
            TweenMax.to(slfBlacks, 0.4, { fill: "#333", opacity: 0.5 });
        })
        .addTo(controller);

    let contactFirst = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: (sectHeight * 2) + globalOffset })
        .setTween(firstNight)
        .addTo(controller);

    let contactSecond = new ScrollMagic.Scene({ duration: sceneHeight / 2, offset: (sectHeight * 2) + (sceneHeight * 2) })
        .setTween(secondNight)
        .addTo(controller);

    document.querySelector(".lnkMorning .dot").addEventListener("click", function () { controller.scrollTo(scrollTimeM, secondScene.duration() + secondScene.offset()) });
    document.querySelector(".lnkSunset .dot").addEventListener("click", function () { controller.scrollTo(scrollTimeS, projectScene.duration() + projectScene.offset()) });
    document.querySelector(".lnkNight .dot").addEventListener("click", function () { controller.scrollTo(scrollTimeN, nightScene.duration() + nightScene.offset()) });

    stateScene = {
        morning: morningScene,
        sunset: sunsetScene,
        night: nightScene
    }
}

const activeDot = (time, active) => {

    let selector = document.querySelector(".lnk" + time + " .dot");

    if (active) {
        selector.classList.add("active");
    } else {
        selector.classList.remove("active");
    }

}

const sliderPrj = (arrows) => {

    if (!isDevice()) {
        removeHtml("#projects h3.mobView");
    } else {
        removeHtml("#projects h3.largeView");
    }

    let index = 0;
    let prj = document.querySelectorAll("#projects h3");

    let prev = arrows[0];
    let next = arrows[1];

    prev.addEventListener("click", function () {
        removeClasses(arrows, "disabled");

        if (index > 0) {
            index = index - 1;
            removeClasses(prj, "active");
            prj[index].classList.add("active");
        }

        if (index <= 0) {
            prev.classList.add("disabled");
        }
    });

    next.addEventListener("click", function () {
        removeClasses(arrows, "disabled");

        if (index < prj.length - 1) {
            index = index + 1;
            removeClasses(prj, "active");
            prj[index].classList.add("active");

        }

        if (index >= prj.length - 1) {
            next.classList.add("disabled");
        }
    });

}

const removeClasses = (elem, className) => {
    elem.forEach(function (el, index) {
        elem[index].classList.remove(className);
    });
}

const removeHtml = (className) => {
    document.querySelectorAll(className).forEach(function (el, index) {
        el.remove();
    });
}

const handleClick = (elem, disable) => {
    elem.forEach(function (atag) {
        if (disable) {
            atag.setAttribute("onclick", "return false");
        } else {
            atag.removeAttribute("onclick");
        }
    });
}

/* #endregion */

/* #region LOGO + FLIES */

class flyFella {

    constructor(content) {
        this.nose = content.getElementById("Nasp");
        this.section = document.getElementsByTagName("main")[0];
        this.fellaCoord = flyFella.fellaCoord(this.section, this.nose);
    }

    static fellaCoord(section, nose) {

        const logoRect = document.getElementById("logo").getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const noseRect = nose.getBoundingClientRect();
        const flySpacer = (window.innerWidth - sectionRect.width) / 2;

        let noseLimit = {
            x: logoRect.x + noseRect.x + noseRect.width,
            y: logoRect.y + noseRect.y + noseRect.height
        };

        let xPos = noseLimit.x - flySpacer - 12; // 12 width of the littleFly
        let yPos = noseLimit.y - 18; // 18 height of the littleFly

        let coords = { y: yPos, x: xPos };

        return coords;
    }

    idFella() {

        let matrix = document.getElementById("matrix");
        let clone = matrix.cloneNode(true);

        if (!this.latestId) { this.latestId = 1 }
        else { this.latestId++ }

        let idClone = "fella" + this.latestId;
        clone.id = idClone;
        this.section.insertBefore(clone, matrix);

        document.getElementById(idClone).style.top = this.fellaCoord.y;
        document.getElementById(idClone).style.left = this.fellaCoord.x;

        return idClone;
    }

    fellaCreation() {

        const id = this.idFella();

        let randomPos = {
            rx: Math.floor(Math.random() * 140) + 40,
            ry: Math.floor(Math.random() * 5) - 2
        }

        let nasoAnim = new TimelineMax({
            delay: 1,
            ease: Linear.easeNone
        });

        let flyMoving = this.fellaMove(randomPos, id);
        let flyDie = this.fellaDie(id);

        nasoAnim
            .to(this.nose, 0.9, { rotation: 7, scale: 0.85 })
            .to(this.nose, 0.3, { rotation: -5, scale: 1.1 })
            .add(function () {

                TweenMax.to("#" + id, 1, {
                    x: randomPos.rx,
                    y: randomPos.ry,
                    opacity: 1,
                    scale: 1,
                    ease: Linear.easeNone,
                    onComplete: function () {
                        TweenMax.set("#" + id, { x: randomPos.rx, y: randomPos.ry });
                        flyMoving.play();
                    }
                });

            })
            .to(this.nose, 0.3, { rotation: 0, scale: 1 });
    }

    fellaMove(initialPos, id) {

        let startPointX = Math.floor(initialPos.rx / 2);
        let startPointY = Math.floor(initialPos.ry / 2);

        let mobile = window.innerWidth < 800;

        const xLimitMin = !mobile ? - (this.section.clientWidth / 2) + 20 : - this.section.clientWidth + 40;
        const xLimitMax = !mobile ? (this.section.clientWidth / 2) - 200 : this.section.clientWidth - 50; //- To have some padding

        const yLimitMin = !mobile ? -50 : -10;
        const yLimitMax = !mobile ? (this.section.clientWidth / 2) - 200 : this.section.clientHeight;

        let randomMove = function (min, max) {
            let num = Math.floor(Math.random() * (max - min) + min);
            return num;
        }

        let flyMove = new TimelineMax({
            yoyo: false,
            ease: Linear.easeNone,
            repeat: -1,
            paused: true
        });

        flyMove.to("#" + id, 20, {
            ease: Linear.easeNone,
            bezier: {
                values: [
                    { x: initialPos.rx, y: initialPos.ry },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: randomMove(xLimitMin, xLimitMax), y: randomMove(yLimitMin, yLimitMax) },
                    { x: initialPos.rx, y: initialPos.ry }
                ]
            }
        });

        return flyMove;

    }

    fellaDie(id) {

        let flyNames = ['Paolo', 'Martina', 'Giulia', 'Agostino', 'Tommaso', 'Giacomo', 'Andrea', 'Valerio'];

        document.getElementById(id).addEventListener('click', function () {
            if (isDevice()) navigator.vibrate(200);
            document.getElementById(id).remove();
            console.log("Hai ucciso " + flyNames[id.match(/\d/g)] + "!");
        });

    }
}

const logoAnim = () => {

    const logo = document.getElementById("slf");
    const slfCode = logo.contentDocument;

    if (slfCode) {

        animState = true;

        alaMove(slfCode);

        slfBlacks = slfCode.querySelectorAll(".cls-10, .cls-11, .cls-12, .cls-13");

        //- Create some fellas
        let counter = 0;
        let fella = new flyFella(slfCode);

        //- First one
        setTimeout(function () {
            fella.fellaCreation();
        }, 4000);

        //- Repeater fellas
        let repFella = setInterval(function () {
            if (counter < 8) {
                fella.fellaCreation();
                counter = counter + 1;
            } else {
                clearInterval(repFella);
            }
        }, 20000);

    }

}

const alaMove = (content) => {

    const alaSx = content.getElementById("Ala1");
    const alaDx = content.getElementById("Ala2");

    //-- General features
    let count = 0;
    let timelineWings = new TimelineMax({
        delay: 1,
        repeat: -1,
        yoyo: true,
        ease: Linear.easeNone,
        onRepeat: function () {
            if (count >= 25) {
                timelineWings.restart(true);
                count = 0;
            } else {
                count++;
            }
        }
    });

    timelineWings.to(alaSx, 0.05, {
        rotation: -9,
        transformOrigin: "100% 100%"
    }, 0);

    timelineWings.to(alaDx, 0.05, {
        rotation: 9,
        transformOrigin: "bottom left"
    }, 0);

}

/* #endregion */

/* #region MOBILE */

const dragMobile = () => {

    handleClick(document.querySelectorAll("a"), true);
    document.querySelector("#content .sunset.fRight").remove();

    let mobileDrag = new Swiper('#content', {
        loop: false,
        setWrapperSize: true,
        fadeEffect: {
            crossFade: true
        },
        effect: 'fade'
    });

    mobileDrag.on('slideChange', function () {
        //- Disable all clicks
        handleClick(document.querySelectorAll("a"), true);

        //- Change z-index
        for (let i = 0; i < mobileDrag.slides.length; i++) {
            mobileDrag.slides[i].style.zIndex = 1;
        }
        mobileDrag.slides[mobileDrag.realIndex].style.zIndex = 2;

        //- Stop dragging on the last element
        //- Enable click night
        if (mobileDrag.activeIndex == 4) {
            mobileDrag.allowSlideNext = false;
            handleClick(document.querySelectorAll(".night a"), false);
        } else {
            mobileDrag.allowSlideNext = true;
        }

        //- Enable click sunset
        if (mobileDrag.activeIndex == 2) {
            handleClick(document.querySelectorAll(".sunset a"), false);
        }

        //- Remove Swipe
        if (mobileDrag.activeIndex == 0) {
            document.getElementById("swipe").classList.remove("swiped");
        } else {
            document.getElementById("swipe").classList.add("swiped");
        }

        //- Start Flyfella and remove the swipe
        if (!animState) {
            logoAnim();
            document.getElementById("swipe").classList.add("swiped");
            animState = true;
        };
    });

    const arrows = document.querySelectorAll("#arrows .arrow");
    sliderPrj(arrows);

}

const isDevice = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

/* #endregion */

//-- Main
if (!isDevice()) {
    scrollAnim();
} else {
    dragMobile();
}

export { stateScene };