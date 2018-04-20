Init = (param) => {
    let { data, parent } = param;

    let menu = data[0];
    let smallBanner = aSmallBanner({
        img: "",
        text: menu.name
    });
    let currentMenu = data[1];
    let currentDetailMenu = data[data.length - 1];
    let verticalMenu = aVerticalMenu({ menu: menu.subMenu });
    xs.addChild(parent, [smallBanner, verticalMenu]);




    function aSmallBanner(data) {
        let { img, text } = data;
        return xs.aDiv({
            styles: ["SmallBanner"],
            childs: [
                xs.aImg({ styles: ["SmallBannerImg"], img: img }),
                xs.aText({ styles: ["SmallBannerText"], txt: text })
            ]
        });
    }
    function aVerticalMenu(data) {
        let { menu } = data;
        if (menu == undefined)
            return null;


        let verticalMenu = xs.aDiv({
            styles: ["VerticalMenu"], childs:
                (function () {
                    let group = [];


                    for (let i = 0; i < menu.length; i++) {
                        const menuItem = menu[i];
                        let verticalMenuItem = aVerticalMenuItem(menuItem);
                        group.push(verticalMenuItem);

                        let subMenu = aSubMenu(menuItem.subMenu);
                        if (subMenu != null) {
                            xs.initAnimation(subMenu);
                            group.push(subMenu);
                            verticalMenuItem.subMenu = subMenu;
                        }
                        if (menuItem.name === currentMenu.name && subMenu != undefined) {
                            subMenu.open = true;
                            xs.setStyles(subMenu, ["SubMenuConnectorInitOpen"]);
                        }


                    }
                    return group;
                })(),

        });


        return verticalMenu;

        function aVerticalMenuItem(menuItem) {
            return xs.aDiv({
                styles: ["VerticalMenuItem"],
                childs: [
                    xs.aText({ styles: ["VerticalMenuItemText"], txt: menuItem.name }),
                    xs.aDiv({
                        styles: ["VerticalMenuItemResArea"],
                        onMouseover: function (evt) {
                            let verticalMenuItem = evt.currentTarget.parentNode;
                            xs.setStyles(verticalMenuItem, ["VerticalMenuItemMouseover"]);
                            let verticalmenuItemText = verticalMenuItem.childNodes[0];
                            xs.setStyles(verticalmenuItemText, ["VerticalMenuItemTextMouseover"]);
                        },
                        onMouseout: function (evt) {
                            let verticalMenuItem = evt.currentTarget.parentNode;
                            xs.setStyles(verticalMenuItem, ["VerticalMenuItem"]);

                            let verticalmenuItemText = verticalMenuItem.childNodes[0];
                            xs.setStyles(verticalmenuItemText, ["VerticalMenuItemText"]);
                        },
                        onClick: function (evt) {
                            let verticalMenuItem = evt.currentTarget.parentNode;
                            let subMenu = verticalMenuItem.subMenu;
                            if (subMenu == null) {
                                xs.directToUrl({ url: `/detail/${menuItem.name}`, operation: "click vertical menu item" });
                                
                                return;
                            }
                            let realHeight = subMenu.childNodes[0].getBoundingClientRect().height;
                            if (subMenu.open == undefined) {
                                subMenu.open = true;
                                xs.animate({
                                    element: subMenu,
                                    animationData: [
                                        {
                                            property: "height",
                                            from: 0,
                                            to: realHeight,
                                            unit: "px"
                                        }
                                    ],
                                    duration: 200,
                                    begin: 1 - subMenu.animation.progress,
                                });
                            }
                            else {
                                subMenu.open = undefined;
                                xs.animate({
                                    element: subMenu,
                                    animationData: [
                                        {
                                            property: "height",
                                            from: realHeight,
                                            to: 0,
                                            unit: "px"
                                        }
                                    ],
                                    duration: 200,
                                    begin: 1 - subMenu.animation.progress,
                                });
                            }


                        }
                    }),

                ]
            });
        }
        function openSubMenuAtInit(subMenu) {
            subMenu.open = true;
            xs.setStyles(subMenu, ["SubMenuConnectorInitOpen"]);
        }
        function aSubMenu(subMenuData) {
            if (subMenuData == undefined)
                return null;
            let subMenu = xs.aDiv({
                styles: ["SubMenuConnector"], childs: [
                    xs.aDiv({
                        styles: ["SubMenu"], childs: (function () {
                            let group = [];
                            for (let i = 0; i < subMenuData.length; i++) {
                                const menuItem = subMenuData[i];
                                group.push(aSubMenuItem(menuItem));
                            }
                            return group;
                        })()
                    })
                ]
            });

            return subMenu;
            function aSubMenuItem(menuItem) {
                let style;

                let subMenuItem = xs.aDiv({
                    styles: ["SubMenuItem"],
                    childs: [
                        xs.aText({ styles: ["SubMenuItemText"], txt: menuItem.name }),
                        xs.aDiv({ styles: ["SubMenuItemResArea"] }),

                    ],
                    onMouseover: function (evt) {
                        let subMenuItem = evt.currentTarget;
                        let subMenuItemText = subMenuItem.childNodes[0];
                        xs.setStyles(subMenuItem, ["SubMenuItemMouseOver"]);
                        xs.setStyles(subMenuItemText, ["SubMenuItemTextMouseOver"]);
                    },
                    onMouseout: function (evt) {

                        let subMenuItem = evt.currentTarget;
                        if (subMenuItem.selected == true)
                            return;
                        let subMenuItemText = subMenuItem.childNodes[0];
                        xs.setStyles(subMenuItem, ["SubMenuItem"]);
                        xs.setStyles(subMenuItemText, ["SubMenuItemText"]);
                    },
                    onClick: function (evt) {
                        let subMenuItem = evt.currentTarget;
                        xs.directToUrl({ url: `/detail/${menuItem.name}`, operation: "click vertical subMenu item" });
                    }
                });
                if (menuItem.name === currentDetailMenu.name) {
                    subMenuItem.selected = true;
                    let subMenuItemText = subMenuItem.childNodes[0];
                    xs.setStyles(subMenuItem, ["SubMenuItemMouseOver"]);
                    xs.setStyles(subMenuItemText, ["SubMenuItemTextMouseOver"]);
                }
                else {
                    subMenuItem.selected = false;
                }
                return subMenuItem;
            }

        }


    }
};