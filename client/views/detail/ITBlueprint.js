Init = (param) => {
    let { parent, currentfile } = param;
    let menuData = [{ name: "International Introduce" }, { name: "Domestic Introduce" }];
    let contentFolder = "/client/views/detail/ITBlueprint/";
    let contentCssfile = "/client/views/detail/Paragraph";
    let fileName = xs.deleteSpaces(menuData[0].name);
    xs.addNew({
        styles: ["DetailMenuBox"],
        data: {
            menuData: menuData,
            contentFolder: contentFolder,
            contentCssfile: contentCssfile,
        },
        file: `/client/views/detail/DetailMenu`,
        element: parent
    });

    let menuContent = xs.aDiv({ styles: ["DetailMenuContent"], parent: parent });

    xs.addNew({
        styles: [`MenuContent${fileName}`],
        file: `${contentFolder}${fileName}`,
        cssfile: [contentCssfile],
        element: menuContent,
        plug: "current"
    });
};