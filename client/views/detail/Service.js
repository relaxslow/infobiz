Init = (param) => {
    let { parent } = param;
    let businessCardData = [
        { name: "IT Blueprint", img: "/assets/img/service1.svg", title: "bussiness-1", description: "bussiness-1-description" },
        { name: "Roadmap Design", img: "/assets/img/service2.svg", title: "bussiness-2", description: "bussiness-2-description" },
        { name: "IT Improvement and Governance", img: "/assets/img/service3.svg", title: "bussiness-3", description: "bussiness-3-description" },
        { name: "Cybersecurity Plan and Implementation", img: "/assets/img/service4.svg", title: "bussiness-4", description: "bussiness-4-description" },
    ];
    let cards = parent.getElementsByClassName('businessCard');
    let diagrams = parent.getElementsByClassName("BusinessDiagram");
    let titles = parent.getElementsByClassName("BusinessTitle");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        let diagram = card.getElementsByClassName("BusinessDiagram")[0];
        diagram.style.backgroundImage = `url(${businessCardData[i].img})`;

        let title = card.getElementsByClassName("BusinessTitle")[0];
        title.innerHTML = businessCardData[i].title;

        card.nameIndex = businessCardData[i].name;
        card.addEventListener('click', clickCard);

        xs.initAnimation(card);

        card.entranceAnimation = entranceAnimation;


    }
    function clickCard(evt) {
        let card = evt.currentTarget;
        xs.directToUrl({ url: `/detail/${card.nameIndex}`, operation: "click businessCard" });
    }

    function entranceAnimation() {
        // console.log(this);
        xs.animate({
            element: this,
            animationData: [
                {
                    property: "transform",
                    scale: { from: [0.1, 0.1, 0.1], to: [1, 1, 1] },
                },
                {
                    property: "opacity",
                    from: 0,
                    to: 1
                }
            ],
            duration: 200,
        });

    }
    function showCards() {
        let parentPosition = parent.getBoundingClientRect();
        if (parentPosition.y < 530) {
            runAllCardAnimation();
        } else {
            xs.addWindowEventListener(parent.root, { event: "scroll", fun: scrollFun });

        }
    }
    document.body.scheduledAnimations.push(showCards);

    function runAllCardAnimation() {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card.entranceAnimation();
        }
    }
    function scrollFun() {
        let parentPosition = parent.getBoundingClientRect();
        if (parentPosition.y < 530) {
            runAllCardAnimation();
            xs.removeWindowEventListener(parent.root, { event: "scroll", fun: scrollFun });
        }

      

    }
};