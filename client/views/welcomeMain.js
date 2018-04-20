Init = (data) => {
    let { parent } = data;

    xs.addNew({ styles: ["BannerBox"], element: parent, file: "/client/views/bannerBox" });

    let DetailBoxData = [
        // { name: "About", cssfile: ["/client/views/detail/Paragraph"] },
        { name: "Service", cssfile: ["/client/views/detail/Paragraph"] },
        {
            name: "Client",
       
        },
        { name: "Contact Us" }
    ];

    for (let i = 0; i < DetailBoxData.length; i++) {
        let welcomeGuideBox = xs.aDiv({ styles: ["WelcomeGuideBox"] });
        xs.addChild(parent, [welcomeGuideBox]);
        xs.addNew({ data: [DetailBoxData[i]], cssfile: DetailBoxData[i].cssfile, element: welcomeGuideBox, file: "/client/views/detailBox" });

    }




};

