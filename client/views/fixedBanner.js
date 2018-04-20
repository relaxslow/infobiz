Init = (param) => {
    let {data, parent } = param;
    let { img, title, subtitle } = data;
    // let imgBox=xs.aDiv({
    //     styles: ["FixedBannerImgBox"], childs: [
    //         xs.aImg({ styles: ["FixedBannerImg"], src: img })
    //     ]
    // });
    let textBox=xs.aDiv({
        styles: ["FixedBannerText"], childs: [
            xs.aText({ styles: ["FixedBannerTitle"], txt: title, translate: "content" }),
            xs.aText({ styles: ["FixedBannerSubtitle"], txt: subtitle, translate: "content" }),
        ]
    });
    
    xs.addChild(parent,[textBox]);
    
};