

Init = (param) => {
    let { data, parent } = param;
    let { menuData, contentFolder, contentCssfile } = data;
    let menuContent = parent.parentNode.childNodes[1];
    for (let i = 0; i < menuData.length; i++) {
        let menu = xs.aButton({
            styles: ["DetailMenuButton"],
            name: menuData[i].name,
            onClick: clickButton
        });

        menu.index = i;
        menu.selectStatus = false;
        xs.addChild(parent, [menu]);
    }
    function clickButton(evt) {
        let thisElement = evt.currentTarget;
        select(parent, thisElement.index);
        let fileName = xs.deleteSpaces(menuData[thisElement.index].name);
        if (document.status === "loading")
            return;
        document.status = "loading";
        xs.loadNewPage({
            msg: "click Detail Menu",
            socketElement: menuContent,
            file: `${contentFolder}${fileName}`,
            cssfile: [contentCssfile],
            styles: [`MenuContentPlug`]
        });
       

    }
    select(parent, 0);
    function select(menuBox, index) {
        menuBox.currentSelectIndex = index;
        for (let i = 0; i < menuBox.childNodes.length; i++) {
            const item = menuBox.childNodes[i];
            if (item.index == index) {
                xs.setStyles(item, ["DetailMenuButtonSelected"]);
                item.selectStatus = true;
            }
            else {
                xs.setStyles(item, ["DetailMenuButton"]);
                item.selectStatus = false;
            }
        }
    }
};