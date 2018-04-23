Init = (param) => {
    let { parent } = param;
    let logos = parent.getElementsByClassName('ClientLogo');
    // console.log(logos);
    let logoNameIndex = [
        "XX Department",
        "YY Agency",
        "HP",
    ];
    for (let i = 0; i < logos.length; i++) {
        const logo = logos[i];
        logo.index = i;
        logo.indexName = logoNameIndex[i];
        logo.addEventListener('click', clickLogo);
    }
    function clickLogo(evt) {
        let logo = evt.currentTarget;
        xs.directToUrl({ url: `/detail/${logo.indexName}`, operation: "click Logo" });

    }
};