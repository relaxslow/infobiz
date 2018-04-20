Init = (data) => {
    let { parent, currentfile } = data;


    // let fixedBanner = aDiv({});
    // let content = aDiv({ styles: ["Content"] });
    // addChild(parent, [fixedBanner, content]);


    fixedBannerData = { img: "", title: "banner0-title", subtitle: "" };
    xs.addNew({ styles: ["FixedBanner"], data: fixedBannerData, element: parent, file: "/client/views/fixedBanner" });


    let currentMenu=localStorage.getItem('currentMenu');
    xs.sendRequest({
      
        url: `/getMenuPath/${currentMenu}`, fun: function (menuPathTxt) {
            let menuPath = JSON.parse(menuPathTxt);
            let content = xs.aDiv({ parent: parent, styles: ["Content"] });
            xs.addNew({ styles: ["SideMenuBox"], data: menuPath, element: content, file: "/client/views/sideMenu" });
            xs.addNew({ styles: ["DetailPageDetailBox"], data: menuPath, element: content, file: "/client/views/detailBox" });


        }
    });
};