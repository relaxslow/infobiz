Init = (param) => {
    let { parent, data } = param;
    let responseArea = parent.getElementsByClassName('responseArea')[0];
    responseArea.indexName = data.name;
    responseArea.addEventListener('click', function (evt) {
        let resArea = evt.currentTarget;
        xs.directToUrl({ url: `/detail/${resArea.indexName}`, operation: "clickHeadMenuItem" });
    });

    let menuText = parent.getElementsByClassName('NavMenuText')[0];
    menuText.innerHTML = data.name;
    let menuItemContainer = parent.getElementsByClassName('MenuItemContainer')[0];
    if (data.subMenu != undefined) {
        for (let i = 0; i < data.subMenu.length; i++) {
            const submenu = data.subMenu[i];
            let button = xs.aButton({
                styles: ["pullDownMenuItem"],
                name: submenu.name,
                onClick: clickPullDownMenuItem
            });
            xs.addChild(menuItemContainer, [button]);

        }
    }
    function clickPullDownMenuItem(evt) {
        let button = evt.currentTarget;
        xs.directToUrl({ url: `/detail/${button.indexName}`, operation: "clickHeadMenuItem" });

    }



};