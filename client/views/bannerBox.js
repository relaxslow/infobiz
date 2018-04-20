Init = (param) => {
    let { data, parent } = param;
    let countIdle;
    let bannerBox = parent;


    let bannerArr = [
        "/assets/artWork/banner1SVG.html",
        "/assets/artWork/banner2SVG.html",
        "/assets/artWork/banner3SVG.html"
    ];
    bannerBox.bannerRes = [];
    bannerBox.frameOriginWidth = 960;
    bannerBox.frameOriginHeight = 300;
    bannerBox.frameScaleRatio = window.innerWidth / bannerBox.frameOriginWidth;
    setBannerBoxHeight();
    xs.addStep("load SVGS", bannerArr.length);
    for (let i = 0; i < bannerArr.length; i++) {
        const respath = bannerArr[i];
        let banner = aBanner(respath);
        xs.hide(banner);
        bannerBox.bannerRes.push(banner);
    }
    let pageNav = aPageNav(bannerArr.length);
    setPageNavHeight();
    xs.addChild(bannerBox, [bannerBox.bannerRes, pageNav]);
    bannerBox.onmouseover = function (evt) {
        xs.show(pageNav);
    };
    bannerBox.onmouseout = function (evt) {
        if (xs.mouseIsInRect(evt, evt.currentTarget)) {
            return;
        }
        xs.hide(pageNav);
    };


    bannerBox.animation = {};
    bannerBox.currentBanner = bannerBox.bannerRes[0];
    xs.show(bannerBox.currentBanner);
    bannerBox.currentPageIndex = 0;
    bannerBox.animation.bannerStatus = "stop";//moving,paused,
    bannerBox.isMouseOver = false;
    let idleTime = 5000;
    countIdle = new xs.aTimer({
        parent: parent,
        fun: function (timer) {
            if (bannerBox.animation.bannerStatus !== "stop") {
                timer.reset();
                return;
            }
            timer.run();
            //             console.log(timer.getTimeCount());
            if (timer.getTimeCount() > idleTime) {
                timer.reset();
                startScroll({
                    bannerBox: bannerBox,
                    pageNav: pageNav
                });

            }
        },

    });

    xs.addWindowEventListener(parent.root, { event: 'mousemove', fun: windowUserTouchFun });
    xs.addWindowEventListener(parent.root, { event: 'keypress', fun: windowUserTouchFun });
    xs.addWindowEventListener(parent.root, { event: 'focus', fun: windowFocusFun });
    xs.addWindowEventListener(parent.root, { event: 'blur', fun: windowBlurfun });
    xs.addWindowEventListener(parent.root, { event: 'resize', fun: windowResizefun });

    function startScroll(data) {
        let { bannerBox, pageNav } = data;
        let beginPos = document.body.clientWidth;
        let index = bannerBox.currentPageIndex + 1;
        if (index >= bannerBox.bannerRes.length)
            index = 0;
        let pageDotArr = pageNav.childNodes;


        check(pageDotArr, index);

        beginMoveBanner({ bannerBox: bannerBox, newBannerIndex: index, newBannerBeginPos: beginPos });
    }
    function windowUserTouchFun() {
        countIdle.counter = 0;
    }


    function windowBlurfun() {
        //             console.log('blur');
        if (bannerBox.animation.bannerStatus === "moving") {
            bannerBox.animation.bannerStatus = "paused";
            cancelAnimationFrame(bannerBox.animation.ID);
            bannerBox.animation.escape = new Date().getTime();

        } else if (bannerBox.animation.bannerStatus === "stop") {
            bannerBox.animation.bannerStatus = "suspend";
        }
        countIdle.stop();

    }


    function windowFocusFun() {
        //             console.log('focus');
        if (bannerBox.animation.bannerStatus === "paused") {
            bannerBox.animation.escape = new Date().getTime() - bannerBox.animation.escape;
            bannerBox.animation.startTime = bannerBox.animation.startTime + bannerBox.animation.escape;
            requestAnimationFrame(bannerBox.animation.update);
            bannerBox.animation.bannerStatus = "moving";
        }
        if (bannerBox.animation.bannerStatus === "suspend") {
            bannerBox.animation.bannerStatus = "stop";
        }
        if (countIdle.isStopped())
            countIdle.begin();
    }

    function windowResizefun() {
        bannerBox.frameScaleRatio = window.innerWidth / bannerBox.frameOriginWidth;
        setBannerBoxHeight();
        for (let i = 0; i < bannerBox.bannerRes.length; i++) {
            const iframetag = bannerBox.bannerRes[i];
            iframetag.style.transform = `scale(${bannerBox.frameScaleRatio})`;
        }
        setPageNavHeight();
    }
    function setPageNavHeight() {
        let total = bannerBox.frameOriginHeight * bannerBox.frameScaleRatio;
        let top = total - total * 0.15;
        pageNav.style.top = `${top}px`;
    }
    function setBannerBoxHeight() {
        bannerBox.style.height = `${bannerBox.frameOriginHeight * bannerBox.frameScaleRatio}px`;
    }
    function aBanner(resPath) {
    
        let iframetag = document.createElement("IFRAME");
        
        iframetag.frameBorder = "0";
        iframetag.scrolling = "no";
        iframetag.style.position = "absolute";
        iframetag.style.top = "0";
        iframetag.style.left = "0";
        iframetag.style.opacity = 0;
        document.body.refreshFrame.push(function(){
            iframetag.style.opacity = 1;
        });
        iframetag.style.width = `${bannerBox.frameOriginWidth}px`;
        iframetag.style.height = `${bannerBox.frameOriginHeight}px`;


        iframetag.style.transform = `scale(${bannerBox.frameScaleRatio})`;
        iframetag.style.transformOrigin = " top left";
        iframetag.src = resPath;

        iframetag.onload = function () {
            let frameDocument = iframetag.contentDocument;
            xs.collectTranslateNode(frameDocument.body);

            xs.finishStep("loadSVG");
        };
        return iframetag;


    }
    function aPageNav(dotNumber) {
        return xs.aDiv({
            styles: ["PageNav"], childs: buildPageDot(dotNumber)
        });
        function buildPageDot(dotNumber) {
            let pageDotArr = [];
            for (let i = 0; i < dotNumber; i++) {
                let dotButton = xs.aButton({
                    styles: ["PageNavButtonNormal"], name: "",
                    onClick: clickDot,
                    translate: "no"
                });
                dotButton.index = i;
                pageDotArr.push(dotButton);
                check(pageDotArr, 0);

            }
            return pageDotArr;


            function clickDot(evt) {
                let dotButton = evt.currentTarget;
                dotButton.classList.remove("active");
                if (bannerBox.animation.bannerStatus != "stop")
                    return;
                if (bannerBox.currentPageIndex == dotButton.index)
                    return;

                let beginPos = -document.body.clientWidth;//not equal to window.innerWidth
                if (dotButton.index > bannerBox.currentPageIndex) {
                    beginPos *= -1;
                }

                check(pageDotArr, dotButton.index);
                beginMoveBanner({ bannerBox: bannerBox, newBannerIndex: dotButton.index, newBannerBeginPos: beginPos });

            }

        }
    }
    function check(pageDotArr, index) {
        let wantCheck = pageDotArr[index];
        for (let i = 0; i < pageDotArr.length; i++) {
            const dot = pageDotArr[i];
            if (dot == wantCheck) {
                dot.checked = true;
                xs.setStyles(dot, ["PageNavButtonSelected"]);
            }
            else {
                dot.checked = false;
                xs.setStyles(dot, ["PageNavButtonNormal"]);
            }

        }
    }
    function beginMoveBanner(param) {
        let { bannerBox, newBannerIndex, newBannerBeginPos } = param;
        bannerBox.currentBanner.fromX = 0;
        let newBanner = bannerBox.bannerRes[newBannerIndex];
        xs.show(newBanner);
        newBanner.fromX = newBannerBeginPos;
        newBanner.style.left = newBannerBeginPos + "px";
        moveSimultaneously({
            bannerBox: bannerBox,
            banners: [newBanner, bannerBox.currentBanner],
            dist: 0 - newBannerBeginPos,
            duration: 500,
            moveComplete: function () {
                xs.hide(bannerBox.currentBanner);
                bannerBox.currentPageIndex = newBannerIndex;
                bannerBox.currentBanner = newBanner;
                bannerBox.animation.bannerStatus = "stop";
                countIdle.counter = 0;
            }
        });
    }
    function moveSimultaneously(data) {
        let { bannerBox, banners, dist, duration, moveComplete } = data;
        bannerBox.animation.bannerStatus = "moving";
        bannerBox.animation.update = update;
        bannerBox.animation.ID = requestAnimationFrame(function (timestamp) {
            bannerBox.animation.startTime = timestamp;
            update(timestamp);
        });

        function update(timestamp) {

            let runTime = timestamp - bannerBox.animation.startTime;
            let progress = runTime / duration;
            progress = Math.min(progress, 1);
            for (let i = 0; i < banners.length; i++) {
                const banner = banners[i];
                banner.style.left = (banner.fromX + dist * progress) + 'px';
            }
            if (runTime < duration) {

                bannerBox.animation.ID = requestAnimationFrame(update);
            } else {
                if (moveComplete != undefined)
                    moveComplete(banners[1]);
            }
        }
    }
};


