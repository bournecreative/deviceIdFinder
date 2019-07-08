(function(){

var model = {
    currentDeviceID: null,
    currentDeviceName: null,
    deviceIDList: JSON.parse(localStorage.getItem('collection')) || []
}

var controller = {
    init: function () {
        this.findPDPJSON();
        setCSS.init();
        setPanelView.init();
        requestedDataView.init();
    },
    findPDPJSON: function () {
        if (typeof pdpJSON !== 'undefined') {
            model.currentDeviceID = pdpJSON.output.pageData.productDetails.deviceId
            model.currentDeviceName = pdpJSON.output.pageData.productDetails.displayName
        }
    },
    getDeviceID: function () {
        return model.currentDeviceID;
    },
    getDeviceName: function () {
        return model.currentDeviceName;
    },
    copyID: function (e) {
        e.preventDefault();
        var copyText = document.querySelector(".device-id");
        //console.log(copyText)
        copyText.select();
        document.execCommand("copy");
    },
    addID: function(){
        var deviceObj = {
            count: model.deviceIDList.length + 1 + ".",
            id: controller.getDeviceID(),
            name: controller.getDeviceName()
        }
        model.deviceIDList.push(deviceObj)
        collectionView.init();
    },
    getList: function(){
        return model.deviceIDList
    },
    setLocalStorage: function(){
        localStorage.setItem('collection', JSON.stringify(model.deviceIDList))
    },
    clearList: function(){
        model.deviceIDList = [];
        collectionView.renderCollection();
    },
    searchDevices: function () {
        var searchURL = "https://search.verizonwireless.com/onesearch/search?q="
        var searchValue = requestedDataView.searchFeild.value
        var searchTerms = searchValue.split(' ')
        if (searchTerms.length < 2) {
            window.location = searchURL + searchTerms
            return
        } else {
            var path = ""
            for (var i = 0; i < searchTerms.length; i++) {
                if (searchTerms[i] === searchTerms.length) {
                    path = path + searchTerms[i]
                } else {
                    path = path + "+" + searchTerms[i] 
                }
            }
        }
        window.location = searchURL + path.trim()
    }
}

var clearPanelView = {
    clearPanel: function(){
        document.body.removeChild(setPanelView.infoPanelContainer)
        setCSS.remove();
    }
}

var setPanelView = {
    init: function () {
        this.infoPanelContainer = document.createElement('div')
        this.infoTitle = document.createElement('h1')
        this.closePanel = document.createElement('span')
        this.render()
    },
    render: function () {
        this.infoPanelContainer.classList.add('info-panel-container')
        this.infoTitle.classList.add('info-title')
        this.infoTitle.textContent = "id Collector"
        this.closePanel.classList.add('close-panel')
        document.body.appendChild(this.infoPanelContainer)
        this.infoPanelContainer.appendChild(this.infoTitle)
        this.infoPanelContainer.appendChild(this.closePanel)
        this.closePanel.addEventListener('click', clearPanelView.clearPanel)
    }
}

var requestedDataView = {
    init: function () {
        this.returnMsg = document.createElement('p')
        this.returnMsg.classList.add('returnMsg')
        this.deviceData = document.createElement('input')
        this.deviceData.classList.add('device-id')
        this.copyBtn = document.createElement('button')
        this.copyBtn.classList.add('copyBtn')
        this.copyBtn.addEventListener('click', controller.copyID)
        this.listBtn = document.createElement('button');
        this.listBtn.classList.add('listBtn')
        this.listBtn.addEventListener('click', controller.addID, {once: true})
        this.searchContainer = document.createElement('div')
        this.searchContainer.classList.add('search')
        this.searchFeild = document.createElement('input')
        this.searchBtn = document.createElement('button')
        this.searchBtn.classList.add('searchBtn')
        this.searchBtn.addEventListener('click', controller.searchDevices)
        this.render();
    },
    render() {
        var deviceID = controller.getDeviceID();
        var deviceName = controller.getDeviceName();
        if (deviceID === null) {
            this.returnMsg.textContent = "NO pdpJSON on this page...Move along."
            setPanelView.infoPanelContainer.appendChild(this.returnMsg)
            this.searchFeild.placeholder = "Enter Device Search Verizon"
            this.searchBtn.textContent = "Search for Devices"
            setPanelView.infoPanelContainer.appendChild(this.searchContainer)
            this.searchContainer.appendChild(this.searchFeild)
            this.searchContainer.appendChild(this.searchBtn)
        } else {
            this.returnMsg.innerHTML = 'Device Found: <br>' + '<span class="device-name">' + deviceName + '</span>'
            setPanelView.infoPanelContainer.appendChild(this.returnMsg)
            this.deviceData.value = deviceID
            this.copyBtn.textContent = "COPY"
            this.listBtn.textContent = "Save to List"
            this.searchFeild.placeholder = "Enter Device Search Verizon"
            this.searchBtn.textContent = "Search for Devices"
            setPanelView.infoPanelContainer.appendChild(this.deviceData)
            setPanelView.infoPanelContainer.appendChild(this.copyBtn)
            setPanelView.infoPanelContainer.appendChild(this.listBtn)
            setPanelView.infoPanelContainer.appendChild(this.searchContainer)
            this.searchContainer.appendChild(this.searchFeild)
            this.searchContainer.appendChild(this.searchBtn)
        }
    }
}

var collectionView = {
    init: function(){
        this.collectionTitle = document.createElement('h2')
        this.collection = document.createElement('ul')
        this.collection.classList.add('id-collection')
        this.clearBtn = document.createElement('button')
        this.clearBtn.classList.add('list-btn')
        this.clearBtn.addEventListener('click', controller.clearList)
        this.renderCollection();
        this.render();
    },
    renderCollection: function(){
        var list = controller.getList()
        collectionView.collection.innerHTML = list.map(function(listItem){
            return "<li>" + listItem.count + " " + listItem.name + "<span class='seperator'>|</span>" + listItem.id + "</li>"
        }).join('')
        controller.setLocalStorage();
    },
    render: function(){
        this.collectionTitle.textContent = "Previous IDs Collected"
        this.clearBtn.textContent = "Clear Collection"
        setPanelView.infoPanelContainer.appendChild(this.collectionTitle)
        setPanelView.infoPanelContainer.appendChild(this.collection)
        setPanelView.infoPanelContainer.appendChild(this.clearBtn)
    }
}

var setCSS = {
    init: function(){
        this.mysheet = document.createElement('style');
        this.mysheet.classList.add('idFinderStyles')
        this.mysheet.innerHTML = "body .info-panel-container,html .info-panel-container{margin:0;font-family:Roboto,sans-serif}.info-panel-container div{box-sizing:unset}.info-panel-container :focus{outline:1px dashed #fff;outline-offset:2px}.info-panel-container{position:fixed;top:0;right:0;width:50%;height:100%;padding:20px;background:#000;opacity:.9;z-index:10000;color:#9e9e9e;overflow:scroll}.info-panel-container .close-panel{position:absolute;top:10px;right:10px;transition:.2s;transform:rotate(45deg);color:#ceff51;font-size:32px}.info-panel-container .close-panel:before{content:'+'}.info-panel-container .close-panel:hover{transform:rotate(226deg) scale(1.4)}.info-panel-container .info-title,h2{font-size:28px;margin:0;text-align:center;color:#ceff51}.info-panel-container .returnMsg{font-size:20px;line-height:2;color:#ceff51}.info-panel-container .device-name{font-size:24px;color:#9e9e9e;font-weight:700;padding-bottom:5px;border-bottom:2px solid #ceff51}input{background:#000;height:30px;border:none;border-bottom:2px solid#ceff51;color:#ceff51;font-size:16px}.info-panel-container button{position:relative;padding:8px 15px;margin-left:10px;font-weight:700;border:2px solid #ceff51;background:#000;color:#ceff51}.info-panel-container button:hover{color:#000;background:#ceff51;border:2px solid #000}.info-panel-container .search{border-top:1px solid #ceff51;padding-top:20px;margin:40px 0}.info-panel-container .search input{font-size:12px;min-width:50%}.info-panel-container .id-collection{list-style-type:none;padding:0;transition:all 1s}.info-panel-container .id-collection li{margin:10px 0;padding:10px 0;background:#171414;color:#fff}.info-panel-container .id-collection li:nth-child(even){color:#ceff51}.info-panel-container .seperator{padding:0 10px}.info-panel-container .list-area{display:inline-block;max-width:60%;min-height:100px;vertical-align:middle}@media screen and (max-width:768px){.info-panel-container{width:80%}}@media screen and (max-width:560px){.info-panel-container{width:100%}}";
        this.render();
    },
    render: function(){
        document.head.appendChild(this.mysheet);
    },
    remove: function(){
        this.cssTarget = document.querySelector('.idFinderStyles')
        document.head.removeChild(this.cssTarget )
    }
}

controller.init()
})()