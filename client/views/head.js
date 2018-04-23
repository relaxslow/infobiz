
Init = (data) => {
    let { parent, currentfile } = data;
    //all
    xs.addWindowEventListener(parent.root, {
        event: "scroll", fun: function (evt) {
            let scrollHeight;
            if (window.scrollY > 35)
                scrollHeight = 35;
            else
                scrollHeight = window.scrollY;
            parent.style.top = -scrollHeight + "px";
        }
    });
    //languageButton
    setLanguageButton();
    function setLanguageButton() {

        let ImgSrc;
        let text;
        let language = localStorage.getItem("language");
        if (language === "CHN") {
            ImgSrc = "/assets/img/Flag_of_the_United_States.svg";
            text = "United States";
        }
        else if (language === "USA") {
            ImgSrc = "/assets/img/Flag_of_the_People's_Republic_of_China.svg";
            text = "China";
        }
        let languageImg = parent.getElementsByClassName('LanguageIcon')[0];
        let languageText = parent.getElementsByClassName('LanguageText')[0];
        languageImg.style.backgroundImage = `url(${ImgSrc})`;
        languageText.innerHTML = text;
    }

    let languageButton = parent.getElementsByClassName('LanguageButton')[0];
    languageButton.addEventListener('click', function (evt) {
        let language = localStorage.getItem('language');
        if (language === "CHN") {
            xs.changeLanguage("USA");
        }
        else if (language === "USA") {
            xs.changeLanguage("CHN");
        }
    });
    //logo
    let logo = parent.getElementsByClassName('NavLogo')[0];
    logo.addEventListener('click', function () {
        xs.directToUrl({ url: '/', operation: "click logo" });
    });

    //menu
    xs.addStep('initMainMenu');
    xs.sendRequest({
        url: "/getMainMenu", fun: function (mainMenuTxt) {


            let mainMenu = JSON.parse(mainMenuTxt);
            let menuBox = parent.getElementsByClassName('NavMenuBox')[0];
            initMainMenu(menuBox, mainMenu);
            initIconmenu(mainMenu);
            setAnimation(menuBox);
            xs.finishStep("initMainMenu");

        }
    });
    function initMainMenu(container, mainMenu) {

        for (let i = 0; i < mainMenu.length; i++) {
            xs.addNew({
                styles: ["NavMenuItem"],
                data: mainMenu[i],
                element: container,
                file: '/client/views/component/menuItem',

            });
        }

    }
    function setAnimation(menuBox) {
        let NavMenuItems = menuBox.getElementsByClassName('NavMenuItem');
        let delayTime = 0;
        for (let i = 0; i < NavMenuItems.length; i++) {
            const menuItem = NavMenuItems[i];
            menuItem.index = i;
            delayTime += 100;
            animateSingle(menuItem, { delayTime: delayTime });

        }
        function animateSingle(menuItem, data) {

            menuItem.timer = new xs.aTimer({
                parent: parent, interval: data.delayTime, fun: function (timer) {
                    timer.stop();

                    xs.animate({
                        element: menuItem,
                        animationData:
                            [
                                {
                                    property: "transform",
                                    translation: { from: [300, 0, 0], to: [0, 0, 0] },
                                    scale: { from: [0.5, 0.5, 1], to: [1, 1, 1] },
                                    // rotate: { from: [0, 0, 30], to: [0, 0, 0] }
                                },
                                {
                                    property: "opacity",
                                    from: 0,
                                    to: 1
                                }
                            ],
                        duration: 200,
                        fun: enterAnimationEnd
                    });
                }
            });

        }
        function closeNavItem(navItem) {
            if (navItem.animation.status === "closing")
                return;
            navItem.animation.status = "closing";
            let responseArea = navItem.childNodes[0];
            xs.setStyles(responseArea, ["responseArea"]);
            let pulldownMenu = navItem.getElementsByClassName('pullDownMenu')[0];
            let container = pulldownMenu.getElementsByClassName("MenuItemContainer")[0];
            let realHeight = container.getBoundingClientRect().height;
            xs.animate({
                element: pulldownMenu,
                animationData:
                    [
                        {
                            property: "height",
                            from: realHeight,
                            to: 0,
                            unit: "px"
                        }
                    ],
                duration: 200,
                begin: 1 - pulldownMenu.animation.progress

            });
        }
        function closeAllexceptOne(navItem) {
            for (let i = 0; i < NavMenuItems.length; i++) {
                const item = NavMenuItems[i];
                if (item != navItem) {
                    if (item.animation != undefined && item.animation.status === "openning")
                        closeNavItem(item);
                }

            }
        }
        function openNavItem(navItem) {
            if (navItem.animation.status === "openning")
                return;
            navItem.animation.status = "openning";

            closeAllexceptOne(navItem);
            let responseArea = navItem.childNodes[0];
            xs.setStyles(responseArea, ["responseArea"]);
            let pulldownMenu = navItem.getElementsByClassName('pullDownMenu')[0];
            let container = pulldownMenu.getElementsByClassName("MenuItemContainer")[0];
            let realHeight = container.getBoundingClientRect().height;

            xs.setStyles(responseArea, ["responseAreaPullDownOpen"]);
            xs.animate({
                element: pulldownMenu,
                animationData:
                    [
                        {
                            property: "height",
                            from: 0,
                            to: realHeight,
                            unit: "px"
                        }
                    ],
                duration: 200,
                begin: 1 - pulldownMenu.animation.progress,

            });
        }
        function enterAnimationEnd(menuItem) {
            let pulldownMenu = menuItem.getElementsByClassName('pullDownMenu')[0];
            let container = pulldownMenu.getElementsByClassName("MenuItemContainer")[0];
            xs.initAnimation(pulldownMenu);
            menuItem.addEventListener("mouseover", function (evt) {

                openNavItem(menuItem);

            });
            menuItem.addEventListener("mouseout", function (evt) {
                if (xs.mouseIsInRect(evt, container) || xs.mouseIsInRect(evt, menuItem))
                    return;

                closeNavItem(menuItem);
            });

        }
    }
    function initIconmenu(mainMenu) {
        //NavMenuIconPullDownMenu
        let container = parent.getElementsByClassName('container')[0];
        let pulldownMenu = parent.getElementsByClassName('NavMenuIconPullDownMenu')[0];
        xs.initAnimation(pulldownMenu);
        for (let i = 0; i < mainMenu.length; i++) {
            let menuItem = xs.aButton({
                styles: ["IconMenuItem"],
                name: mainMenu[i].name,
                onClick: clickIconMenuItem
            });
            menuItem.nameIndex = mainMenu[i].name;
            xs.addChild(container, [menuItem]);

        }
        function clickIconMenuItem(evt) {
            let menuItem = evt.currentTarget;
            xs.directToUrl({ url: `/detail/${menuItem.nameIndex}`, operation: "click icon menu" });
        }
        //menuIcon
        let menuIcon = parent.getElementsByClassName('NavMenuIcon')[0];

        menuIcon.status = "close";
        menuIcon.addEventListener('click', function (evt) {
            let menuIcon = evt.currentTarget;
            if (menuIcon.status === "close") {
                menuIcon.status = 'open';
                openIconMenu(menuIcon);
            } else if (menuIcon.status === "open") {
                closeIconMenu(menuIcon);
                menuIcon.status = 'close';
            }
        });
        function openIconMenu(menuIcon) {

            let pullDownMenu = menuIcon.getElementsByClassName('NavMenuIconPullDownMenu')[0];
            let container = pulldownMenu.getElementsByClassName('container')[0];
            let realHeight = container.getBoundingClientRect().height;
            xs.animate({
                element: pulldownMenu,
                animationData:
                    [
                        {
                            property: "height",
                            from: 0,
                            to: realHeight,
                            unit: "px"
                        }
                    ],
                duration: 200,
                begin: 1 - pulldownMenu.animation.progress,

            });
        }
        function closeIconMenu(menuIcon) {
            let pulldownMenu = menuIcon.getElementsByClassName('NavMenuIconPullDownMenu')[0];
            let container = pulldownMenu.getElementsByClassName('container')[0];
            let realHeight = container.getBoundingClientRect().height;
            xs.animate({
                element: pulldownMenu,
                animationData:
                    [
                        {
                            property: "height",
                            from: realHeight,
                            to: 0,
                            unit: "px"
                        }
                    ],
                duration: 200,
                begin: 1 - pulldownMenu.animation.progress,

            });
        }
    }


};