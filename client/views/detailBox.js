Init = (param) => {
    let { data, parent } = param;
    let detailBox = aDetailBox(data);
    xs.addChild(parent, [detailBox]);

    function aDetailBox(menuPath) {
        let currentMenu = menuPath[menuPath.length - 1];
        
        let head = xs.aDiv({
            styles: ["DetailBoxHead"], childs: [
                xs.aText({ styles: ["DetailBoxHeadText"], txt: currentMenu.name, type: "h2" }),
                xs.aDiv({
                    styles: ["DetailBoxHeadLinksBox"], childs:
                        (function () {
                            let linkGroup = [];
                            if (menuPath.length == 1) {
                                linkGroup.push(xs.aText({ styles: ["DetailBoxHeadLinksText"], txt: "more" }));
                                linkGroup.push(xs.aText({ styles: ["DetailBoxHeadLinksConnector"], txt: ">", translate: "no" }));
                            } else {
                                for (let i = 0; i < menuPath.length; i++) {
                                    const menu = menuPath[i];
                                    linkGroup.push(aLinkText(menu));
                                    if (i != menuPath.length - 1)
                                        linkGroup.push(xs.aText({ styles: ["DetailBoxHeadLinksConnector"], txt: ">", translate: "no" }));
                                }
                            }

                            return linkGroup;
                            function aLinkText(menu) {
                                return xs.aText({
                                    styles: ["DetailBoxHeadLinksText"], txt: menu.name,
                                    onMouseover: function () {

                                    },
                                    onMouseout: function () {

                                    },
                                    onClick: function () {

                                    }
                                });
                            }
                        })()
                })
            ]
        });
        let content = xs.aDiv({ styles: ["DetailBoxContent"], });
        xs.addChild(parent, [head, content]);
        let fileName = xs.deleteSpaces(currentMenu.name);
        xs.addNew({
            data:currentMenu,
            styles: [`${fileName}Box`],
            cssfile:["/client/views/detail/Paragraph"],
            file: `/client/views/detail/${fileName}`,
            element: content,
        });

       
    }

};