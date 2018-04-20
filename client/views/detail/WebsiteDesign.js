Init = (param) => {
    let { parent, currentfile } = param;
    //     console.log(parent);
    let menuData = [{ name: "Introduce" }, { name: "Our Research" }, { name: "Client Case" }];
    let contentFolder = "/client/views/detail/websiteDesign/";
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
        styles: [`MenuContentPlug`],
        file: `${contentFolder}${fileName}`,
        cssfile: [contentCssfile],
        element: menuContent,
        plug: "current"
    });



};
