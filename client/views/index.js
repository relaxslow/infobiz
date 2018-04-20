Init = (param) => {
    let { parent } = param;

    xs.addNew({ styles: ["Head"], element: parent, file: "/client/views/head" });
   
    let body = xs.aDiv({ styles: ["MainBody"], parent: parent });
    xs.addNew({
        element: body,
        file: "/client/views/welcomeMain",
        plug: 'current'
    });
    xs.addNew({ styles: ["Foot"], element: body, file: "/client/views/foot" });

};

