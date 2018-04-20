let xs = {};

xs.initStep = (param) => {
    let { msg, num } = param;

    if (msg != undefined) {
        console.log(`***${msg}`);
    }
    if (num == undefined)
        document.step = 0;
    else
        document.step = num;
};
xs.addStep = (msg, num) => {
    if (num == undefined)
        num = 1;
    document.step += num;
    console.log(`---${document.step}.begin ${msg}---`);
};
xs.finishStep = (msg, num) => {
    if (num == undefined)
        num = 1;
    document.step -= num;
    console.log(`---${document.step}.finish ${msg} ---`);
    if (document.step == 0) {
        if (xs.currentTask != undefined)
            xs.currentTask.next();
    }
};
xs.loadNewPage = (param) => {
    "use strict";
    let { msg, styles, file, cssfile, socketElement } = param;
    resetDocumentDataContainer();
    removeAllJsComponent(socketElement.currentPlug);

    function* Tasks() {

        yield construct();
        let newPageCss = countNeededCss(socketElement);
        if (newPageCss.length != 0)
            yield addAllCss(socketElement, newPageCss);
        if (document.body.translateNode.length != 0) {
            yield xs.translateAll(localStorage.getItem('language'));
        }
        document.body.translateNode.length = 0;
        swapPage(socketElement);
        xs.currentTask = undefined;
    }
    xs.currentTask = Tasks();
    xs.currentTask.next();


    function construct() {
        xs.initStep({ msg: msg });
        xs.addNew({
            styles: styles,
            file: file,
            cssfile: cssfile,
            element: socketElement,
            plug: "new"
        });
    }


    function resetDocumentDataContainer() {
        document.body.translateNode.length = 0;
        document.body.scheduleTimer.length = 0;
        document.body.refreshFrame.length = 0;
    }

    function removeAllJsComponent(Root) {

        if (Root == undefined)
            return;
        removeJsComponentFromRoot(Root);
        if (Root.childRoot != undefined) {
            for (let i = 0; i < Root.childRoot.length; i++) {
                const childRoot = Root.childRoot[i];
                new removeAllJsComponent(childRoot);
            }
        }

        function removeJsComponentFromRoot(Root) {
            if (Root.jsComponents == undefined)
                return;
            for (let i = 0; i < Root.jsComponents.length; i++) {
                const js = Root.jsComponents[i];
                js.ref.parentNode.removeChild(js.ref);
            }
            Root.jsComponents.length = 0;
        }
    }
    function countNeededCss(socketElemt) {
        let parentRootCss = [];
        iterateCss({
            Root: document.body,
            skipRoot: [socketElemt.newPlug, socketElemt.currentPlug],
            fun: function (cssComponent) {
                parentRootCss.push(cssComponent);
            }
        });
        let newPageCss = [];
        iterateCss({
            Root: socketElemt.newPlug,
            fun: function (cssComponent) {
                let isAlreadyAddInCurrentPlug = false;
                iterateArr({
                    Arr: newPageCss, fun: function (css) {
                        if (css.name === cssComponent.name) {
                            isAlreadyAddInCurrentPlug = true;
                            return true;
                        }

                    }
                });
                let isAlreadyAddInParentPlug = false;
                iterateArr({
                    Arr: parentRootCss, fun: function (css) {
                        if (css.name === cssComponent.name) {
                            isAlreadyAddInParentPlug = true;
                            return true;
                        }
                    }
                });
                if (!isAlreadyAddInCurrentPlug && !isAlreadyAddInParentPlug)
                    newPageCss.push(cssComponent);
            }
        });
        return newPageCss;
    }
    function addAllCss(socketElemt, newPageCss) {


        xs.initStep({ msg: "loadAllCss", num: newPageCss.length });


        iterateArr({
            Arr: newPageCss, fun: function (cssComponent) {
                checkExist(cssComponent);
            }
        });
        for (let i = 0; i < newPageCss.length; i++) {
            const cssComponent = newPageCss[i];

        }


        function checkExist(cssComponent) {
            let neededCss = cssComponent.name;
            xs.fileExist(neededCss, "css", function (isExist) {
                if (isExist === "yes") {
                    addCSS(function (cssLink) {
                        cssComponent.ref = cssLink;
                        xs.finishStep(`loading ${neededCss}.css`);
                    });
                }
                else {
                    xs.finishStep(`loading ${neededCss}.css`);
                }
            });
            function addCSS(fun) {
                let cssName = neededCss + ".css";
                let cssLink = document.createElement("link");
                cssLink.setAttribute("rel", "stylesheet");
                cssLink.setAttribute("type", "text/css");
                cssLink.setAttribute("href", cssName);
                cssLink.onload = function (evt) {

                    if (fun != undefined)
                        fun(cssLink);
                };
                document.getElementsByTagName("head")[0].appendChild(cssLink);
            }
        }

    }
    function swapPage(socket) {
        console.log("***swap page");
        xs.hide(socket.currentPlug);
        xs.hang(socket.currentPlug);
        xs.insert(socket.newPlug);
        xs.show(socket.newPlug);


        stopAllTimer(socket.currentPlug);
        removeAllWindowListener(socket.currentPlug);

        removeOldCss(socket.currentPlug);
        disconnectPlug(socket.currentPlug);

        socket.currentPlug = socket.newPlug;
        socket.newPlug = null;


        window.focus();

        beginAllTimer();
        showAllFrames();
        beginAllScheduledAnimation();
        checkUrlContentMatch();
        console.log("document process complete----------------------------------------------------------------------------------");
        document.status = "done";
        function checkUrlContentMatch() {
            let decodedUrl = decodeURI(window.location.pathname);
            let decodedActualUrl = decodeURI(localStorage.getItem('currentUrl'));
            if (decodedUrl !== decodedActualUrl) {
                xs.directToUrl({ url: window.location.pathname, operation: "correct url mismatch caused by quick user click " });
            }
        }
        //scheduled functions
        function beginAllScheduledAnimation() {
            console.log("beginAnimation");
            for (let i = 0; i < document.body.scheduledAnimations.length; i++) {
                const animation = document.body.scheduledAnimations[i];
                animation();
            }
            document.body.scheduledAnimations.length = 0;
        }
        function showAllFrames() {
            console.log("refresh frames...");
            for (let i = 0; i < document.body.refreshFrame.length; i++) {
                const refresh = document.body.refreshFrame[i];
                refresh();
            }
            document.body.refreshFrame.length = 0;
        }
        function beginAllTimer() {
            console.log("begin timer...");
            for (let i = 0; i < document.body.scheduleTimer.length; i++) {
                const timer = document.body.scheduleTimer[i];
                timer.begin();
            }
            document.body.scheduleTimer.length = 0;
        }
        function stopAllTimer(plug) {
            console.log("stop timer in old plug!");
            if (plug != undefined) {
                iterateTimer({
                    root: plug, fun: function (timer) {
                        timer.stop();
                    }
                });
            }

            function iterateTimer(param) {
                let { root, fun } = param;

                for (let i = 0; i < root.timers.length; i++) {
                    const timer = root.timers[i];
                    fun(timer);
                }
                if (root.childRoot != undefined) {
                    for (let j = 0; j < root.childRoot.length; j++) {
                        const childRoot = root.childRoot[j];
                        new iterateTimer({ root: childRoot, fun: fun });
                    }
                }
            }

        }
        function removeAllWindowListener(plug) {
            if (plug != undefined) {
                iterateWindowEvent({
                    root: plug, fun: function (windowEvent) {
                        window.removeEventListener(windowEvent.event, windowEvent.fun);
                    }
                });
            }

            function iterateWindowEvent(param) {
                let { root, fun } = param;
                for (let i = 0; i < root.windowEvent.length; i++) {
                    const windowEvent = root.windowEvent[i];
                    fun(windowEvent);
                }
                if (root.childRoot != undefined) {
                    for (let j = 0; j < root.childRoot.length; j++) {
                        const childRoot = root.childRoot[j];
                        new iterateWindowEvent({ root: childRoot, fun: fun });
                    }
                }
            }

        }

        function disconnectPlug(plug) {
            if (plug != undefined) {
                plug.parentNode.removeChild(plug);

                let deleteIndex;
                for (let i = 0; i < plug.parentRoot.childRoot.length; i++) {
                    const childRoot = plug.parentRoot.childRoot[i];
                    if (childRoot == plug)
                        deleteIndex = i;
                    break;
                }
                plug.parentRoot.childRoot.splice(deleteIndex, 1);
            }
        }
        function removeOldCss(plug) {
            if (plug == undefined)
                return;
            iterateCss({
                Root: plug,
                fun: function (cssComponent) {
                    if (cssComponent.ref != undefined)
                        cssComponent.ref.parentNode.removeChild(cssComponent.ref);
                }
            });
        }
    }
    function iterateCss(param) {
        let { Root, fun, skipRoot } = param;
        for (let i = 0; i < Root.cssComponents.length; i++) {
            const cssComponent = Root.cssComponents[i];

            fun(cssComponent);

        }
        if (Root.childRoot != undefined) {
            for (let i = 0; i < Root.childRoot.length; i++) {
                const childRoot = Root.childRoot[i];
                let skip = false;
                if (skipRoot != undefined) {
                    for (let j = 0; j < skipRoot.length; j++) {
                        const r = skipRoot[j];
                        if (r == childRoot || r == undefined) {
                            skip = true;
                            break;
                        }


                    }
                }
                if (skip == false)
                    new iterateCss({ Root: childRoot, fun: fun, skipRoot: skipRoot });
            }
        }
    }
    function iterateArr(param) {
        let { Arr, fun } = param;
        for (let i = 0; i < Arr.length; i++) {
            const elemt = Arr[i];
            let breakCondition = fun(elemt);
            if (breakCondition == true)
                break;

        }
    }

};




xs.b64DecodeUnicode = (str) => {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};
xs.b64EncodeUnicode = (str) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    }));
};

xs.sendRequest = (obj) => {//attempt change to obj parameter

    let { url, method, jsonObj, fun, type } = obj;
    xs.addStep(`sendRequest:${url}`, 0);
    if (type == undefined)
        type = "none";
    if (url == undefined) throw " need url to send request ";

    var xhttp = new XMLHttpRequest();
    if (method == undefined) method = "GET";
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");

    addCustomHeader(xhttp, "type", type);
    if (method === "GET") {
        if (jsonObj != undefined)
            url += "?data=" + encodeURIComponent(JSON.stringify(jsonObj));
        xhttp.setRequestHeader("Content-Type", "text/plain");
        xhttp.send();
    } else if (method === "POST") {
        xhttp.setRequestHeader("Content-Type", "text/plain");

        xhttp.send(jsonObj);
    } else if (method === "PUT") {
        xhttp.setRequestHeader("Content-Type", "text/plain");
        xhttp.send(jsonObj);
    }
    else if (method === "DELETE") {
        xhttp.send();
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            xs.finishStep(`sendRequest:${url}`, 0);
            if (fun != undefined)
                fun(this.responseText);

        }

    };
    function addCustomHeader(xhttp, headName, headContent) {
        if (headContent != undefined)
            xhttp.setRequestHeader(headName, headContent);
    }
};

xs.directToUrl = (param) => {
    let { url, operation } = param;
    if (document.status === "loading") {
        return;
    }
    document.status = "loading";
    let historyRec = { index: ++xs.historyLastIndex, operation: operation, url: url, time: xs.getCurrentTimeString() };

    let encode = xs.b64EncodeUnicode(url);
    xs.sendRequest({
        url: `/directToUrl/:${encode}`,
        method: "POST",
        jsonObj: JSON.stringify({ id: localStorage.getItem("id"), history: historyRec }),
        fun: function (userdataStr) {
            let parsedUserInfo = JSON.parse(userdataStr);
            localStorage.setItem('currentView', parsedUserInfo.currentView);
            localStorage.setItem('currentUrl', parsedUserInfo.currentUrl);
            localStorage.setItem('currentMenu', parsedUserInfo.currentMenu);
            if (operation != "backOrForward") {
                changeUrl(parsedUserInfo.currentUrl);
            }
            let mainBody = document.body.getElementsByClassName('MainBody')[0];
            xs.loadNewPage({
                msg: "refresh main body",
                socketElement: mainBody,
                file: parsedUserInfo.currentView,
            });


        }
    });
    function changeUrl(url) {

        window.history.pushState({ index: ++xs.historyLastIndex, url: `${url}` }, "Title", `${url}`);
    }
};
xs.checkInit = (data) => {
    let { parent, currentfile } = data;
    if (Init == undefined) {
        console.log(`!!!Init not define in ${currentfile} js`);
    }
    else {
        xs.addStep(`run init in ${currentfile} `, 0);
        Init(data);
        xs.finishStep(`run init in ${currentfile} `, 0);
        Init = undefined;
    }
};
let Init;
// let Init = (data) => {
//     let { parent, currentfile } = data;
//     xs.addNew({ styles: ["Main"], element: parent, file: localStorage.getItem('currentView') });
// };

xs.fileExist = (filePath, filetype, fun) => {
    xs.sendRequest({
        url: `/fileExist${filePath}/${filetype}`, fun: function (isExist) {
            fun(isExist);

        }
    });
};
/**dynamic add components
* @param  cssfile additional cssfile path 
* @param  element parent object of this component
* @param  plug set "new"/"current"/undefined, if add component use plug mode
*  rootElement replaceable root element,change each time when replace set to true
*/
xs.addNew = (param) => {
    let { id, styles, data, element, file, cssfile, plug } = param;
    xs.addStep(`load ${file} module`, 2);//loadhtml//loadJs//

    let shortName = file.slice(file.lastIndexOf("/") + 1);
    if (styles == undefined) {
        styles = [`${shortName}Box`];
    }

    let div = xs.aDiv({ id: id, styles: styles });

    div.dataset.file = `${file}`;//**debug
    //plugable

    if (plug == undefined) {
        element.appendChild(div);
        div.root = element.root;
    }
    else {

        if (div.jsComponents == undefined)
            div.jsComponents = [];

        if (div.cssComponents == undefined)
            div.cssComponents = [];

        if (div.childRoot == undefined)
            div.childRoot = [];
        if (div.timers == undefined)
            div.timers = [];
        if (div.windowEvent == undefined)
            div.windowEvent = [];
        div.root = div;
        div.parentRoot = element.root;
        element.root.childRoot.push(div);
        if (plug === "current") {
            element.appendChild(div);
            element.currentPlug = div;
        } else if (plug === "new") {
            element.insertBefore(div, element.currentPlug);
            element.newPlug = div;
            xs.hide(div);
            xs.hang(div);
        }
    }



    let loadHtml = false;


    addHtml({

        okFun: function () {
            loadHtml = true;
            addrootToHtmlDiv();
            beginLoadJs(file, div);
            xs.finishStep(`${file}.html`);

        },
        failFun: function () {
            beginLoadJs(file, div);
            xs.finishStep(`${file}.html`);
        }
    });
    return div;
    function beginLoadJs(file, div) {
        addJs({
            div: div,
            file: file,
            okfun: function () {
                xs.checkInit({ data: data, parent: div, currentfile: file });
                xs.collectTranslateNode(div);
                recordCss();

                xs.finishStep(`loading ${file}.js`);
            },
            failfun: function () {
                if (loadHtml == false) {
                    console.log(`!!! ${file}(js or html) not defined`);
                    xs.finishStep(`loading ${file}.js`);

                }
                else {
                    xs.collectTranslateNode(div);
                    recordCss();
                    xs.finishStep(`loading ${file}.js`);
                }
            }
        });
        function addJs(param) {
            let { file, okfun, failfun, div } = param;
            addComponent({
                file: file,
                okfun: okfun,
                failfun: failfun
            });

            function addComponent(param) {
                let { file, okfun, failfun } = param;
                xs.fileExist(file, "js", function (isExist) {
                    if (isExist === "yes") {
                        let jsComponent = { name: file };
                        div.root.jsComponents.push(jsComponent);
                        addScript(`${file}.js`, function (script) {
                            jsComponent.ref = script;
                            okfun();
                        });
                    } else {
                        console.log(` ${file}.js not exist`);
                        failfun();
                    }
                });
            }
        }
    }

    function addScript(file, fun) {
        let script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", file);
        script.onload = function (evt) {
            fun(script);
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    function addrootToHtmlDiv() {
        let allChildDiv = div.getElementsByTagName("DIV");
        for (let i = 0; i < allChildDiv.length; i++) {
            const childDiv = allChildDiv[i];
            childDiv.root = div.root;
        }
    }


    function addHtml(param) {
        let { okFun, failFun } = param;
        xs.fileExist(file, "html", function (isExist) {
            if (isExist === "yes") {
                xs.sendRequest({
                    url: `/readHtmlFile${file}`, fun: function (htmlStr) {
                        div.innerHTML = htmlStr;
                        okFun();
                    }
                });
            }
            else {
                failFun();
            }
        });
    }


    function recordCss() {

        addCssComponent(file);
        if (cssfile != undefined) {
            for (let i = 0; i < cssfile.length; i++) {
                const aCSSfile = cssfile[i];
                addCssComponent(aCSSfile);
            }
        }

        function addCssComponent(neededCss) {
            let cssComponent = { name: neededCss };
            div.root.cssComponents.push(cssComponent);
        }
    }
};

xs.addWindowEventListener = (root, eventInfo) => {
    window.addEventListener(eventInfo.event, eventInfo.fun, false);
    root.windowEvent.push(eventInfo);
};
xs.removeWindowEventListener = (root, eventInfo) => {
    window.removeEventListener(eventInfo.event, eventInfo.fun);
    let index;
    for (let i = 0; i < root.windowEvent.length; i++) {
        const event = root.windowEvent[i];
        if (event.fun == eventInfo.fun)
            index = i;
    }
    root.windowEvent.splice(index, 1);
};

xs.hang = (plug) => {
    if (plug == undefined)
        return;
    plug.style.position = "fixed";
};
xs.insert = (plug) => {
    if (plug == undefined)
        return;
    plug.style.position = "static";
};

xs.show = (element) => {
    if (element == undefined)
        return;
    if (element.show == true)
        return;
    element.style.visibility = "visible";
    element.show = true;
};
xs.hide = (element) => {
    if (element == undefined)
        return;
    element.style.visibility = "hidden";
    element.show = false;
};


xs.newFrame = (param) => {
    let { styles, msg, parent, src, originWidth, originHeight, width, height, fun, screen } = param;

    xs.addStep(msg);
    let iframe = document.createElement("IFRAME");
    iframe.frameBorder = "0";
    iframe.scrolling = "no";

    xs.addStyle(iframe, styles);


    if (originWidth != undefined && originHeight != undefined) {
        iframe.style.width = `${originWidth}px`;
        iframe.style.height = `${originHeight}px`;
        if (screen == "full") {
            let scaleRatio = document.body.clientWidth / originWidth;
            parent.style.width = `${originWidth * scaleRatio}px`;
            parent.style.height = `${originHeight * scaleRatio}px`;
            parent.style.overflow = `hidden`;
            iframe.style.transformOrigin = " top left";
            iframe.style.transform = `scale(${scaleRatio})`;
        }
    }
    if (width != undefined && height != undefined) {
        iframe.style.width = width;
        iframe.style.height = height;
    }


    iframe.src = src;
    iframe.onload = function () {
        if (fun != undefined)
            fun(iframe);
        xs.finishStep(msg);
    };
    parent.appendChild(iframe);
    return iframe;
};

//element
xs.aTimer = (function () {
    function timer(data) {
        let { fun, parent, interval } = data;
        if (interval == undefined)
            interval = 1000;
        let id = 0;
        this.counter = 0;
        parent.root.timers.push(this);
        document.body.scheduleTimer.push(this);

        this.begin = function () {
            id = setInterval(() => {
                fun(this);
            }, interval);
        };
        this.stop = function () {
            clearInterval(id);
            this.reset();
            id = 0;
        };
        this.reset = function () {
            this.counter = 0;
        };
        this.run = function () {
            this.counter += interval;
        };
        this.getTimeCount = function () {
            return this.counter;
        };
        this.isStopped = function () {
            if (id == 0)
                return true;
            else return false;
        };

    }
    return timer;
})();

xs.aDiv = (obj) => {
    let { id, parent, styles, childs, data } = obj;
    let div = xs.createElement(id, 'div');
    xs.addStyle(div, styles);

    if (parent != undefined) {
        parent.appendChild(div);
        div.root = parent.root;

    }
    xs.addChild(div, childs);


    xs.addTouch(div, obj);
    if (data != undefined) {
        div.data = data;
    }

    return div;

};
xs.deleteSpaces = (fileName) => {
    return fileName.replace(/\s+/g, '');
};

xs.addChild = (function () {
    function ac(element, childArr) {
        if (childArr == undefined)
            return;
        for (let i = 0; i < childArr.length; i++) {
            const child = childArr[i];
            if (Array.isArray(child) == true) {
                new ac(element, child);
            } else {
                if (childArr[i] != undefined)//null == undefined
                    element.appendChild(child);
                if (element.root == undefined) {
                    if (document.followerList == undefined)
                        document.followerList = [];
                    if (child != undefined)
                        document.followerList.push(child);
                }
                else {
                    if (child != undefined)
                        child.root = element.root;
                    if (document.followerList != undefined) {
                        for (let i = 0; i < document.followerList.length; i++) {
                            const follower = document.followerList[i];
                            follower.root = element.root;
                        }
                    }


                }
            }

        }


    }
    return ac;
})();




xs.addTouch = (element, obj) => {
    let { onMouseover, onMouseout, onClick } = obj;
    if (onMouseover != undefined)
        element.addEventListener("mouseover", function (evt) {
            onMouseover(evt);
            evt.stopPropagation();
        }, false);
    if (onMouseout != undefined)
        element.addEventListener("mouseout", function (evt) {
            onMouseout(evt);
            // evt.stopPropagation();
        }, false);
    if (onClick != undefined)
        element.addEventListener("click", function (evt) {
            onClick(evt);
            evt.stopPropagation();
        }, false);

};




xs.addStyle = (element, styleArr) => {
    if (styleArr == undefined) {
        //         console.log("style not defined");
        return;
    }
    for (let i = 0; i < styleArr.length; i++) {
        const style = styleArr[i];
        if (style == undefined)
            continue;
        if (style === "")
            continue;
        element.classList.add(style);
    }
};
xs.removeStyle = (element, styleArr) => {
    if (styleArr == undefined) {
        return;
    }
    for (let i = 0; i < styleArr.length; i++) {
        const style = styleArr[i];
        if (style == undefined)
            continue;
        if (style === "")
            continue;
        element.classList.remove(style);
    }
};
xs.setStyles = (element, styleArr) => {
    if (styleArr == undefined) {
        console.log("style not defined");
        return;
    }
    // 	element.classList.length=0;
    let classNum = element.classList.length;
    for (let i = 0; i < classNum; i++) {
        const style = element.classList[0];
        element.classList.remove(style);
    }
    for (let i = 0; i < styleArr.length; i++) {
        const style = styleArr[i];
        element.classList.add(style);
    }

};

xs.createElement = (idStr, elementType) => {
    let element;
    if (idStr != undefined) {
        element = document.getElementById(idStr);
        if (element == null)
            element = document.createElement(elementType);
        else {
            if (element.nodeName === elementType.toUpperCase()) {
                return element;
            }

            else {
                throw "id conflict";

            }
        }
        element.id = idStr;
    } else {
        element = document.createElement(elementType);
    }

    return element;
};

xs.aImg = (data) => {
    let { id, src, styles, onClick, onLoad } = data;
    if (src == undefined || src == "") {
        // console.log("src not defined");
        return null;
    }
    let img = createElement(id, "img");
    if (img == null)
        return null;
    img.src = src;
    addStyle(img, styles);
    addTouch(img, data);
    if (onLoad != undefined)
        img.onload = onLoad;
    return img;
};


xs.aText = (data) => {
    let { txt, translate, type, id, styles } = data;
    if (txt == undefined || txt === "")
        return null;
    if (type == undefined)
        type = "p";
    let text = xs.createElement(id, type);
    if (text == null)
        return null;
    if (translate !== "no") {
        if (translate == undefined) {
            text.dataset.translate = "UI";
        }
        else if (translate === "content") {
            text.dataset.translate = "content";
        }
        else if (translate === "invert") {
            text.dataset.translate = "invert";
        }
        document.body.translateNode.push(text);
    }
    text.innerHTML = txt;
    xs.addStyle(text, styles);
    return text;
};
xs.aButton = (data) => {
    let { name, id, styles, translate } = data;
    let button = xs.createElement(id, "button");
    if (translate == undefined) {
        button.dataset.translate = "UI";
        document.body.translateNode.push(button);
    }
    button.innerHTML = name;
    button.indexName = name;
    xs.addTouch(button, data);
    xs.addStyle(button, styles);
    return button;
};


xs.getCurrentTimeString = () => {
    var d = new Date();
    d.setTime(d.getTime());
    return d.toUTCString();
};


