(function () {

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
        },
        findPDPJSON: function () {
            if (typeof pdpJSON !== 'undefined') {
                model.currentDeviceID = pdpJSON.output.pageData.productDetails.deviceId;
                model.currentDeviceName = pdpJSON.output.pageData.productDetails.displayName;
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
            copyText.select();
            document.execCommand("copy");
        },
        addID: function () {
            var deviceObj = {
                count: model.deviceIDList.length + 1 + ".",
                id: controller.getDeviceID(),
                name: controller.getDeviceName()
            };
            model.deviceIDList.push(deviceObj);
            collectionView.init();
        },
        getList: function () {
            return model.deviceIDList;
        },
        setLocalStorage: function () {
            localStorage.setItem('collection', JSON.stringify(model.deviceIDList));
        },
        clearList: function () {
            model.deviceIDList = [];
            collectionView.renderCollection();
        },
        searchDevices: function () {
            var searchURL = "https://search.verizonwireless.com/onesearch/search?q=",
                searchValue = searchView.searchFeild.value,
                searchTerms = searchValue.split(' ');
            if (searchTerms.length < 2) {
                window.location = searchURL + searchTerms;
                return;
            } else {
                var path = "";
                for (var i = 0; i < searchTerms.length; i++) {
                    if (searchTerms[i] === searchTerms.length) {
                        path = path + searchTerms[i];
                    } else {
                        path = path + "+" + searchTerms[i];
                    }
                }
            }
            window.location = searchURL + path.trim();
        }
    }

    var clearPanelView = {
        clearPanel: function () {
            document.body.removeChild(setPanelView.infoPanelContainer);
            setCSS.remove();
        }
    }

    var setPanelView = {
        init: function () {
            // create elements
            this.infoPanelContainer = document.createElement('div');
            this.infoTitle = document.createElement('h1');
            this.closePanel = document.createElement('span');
            this.returnMsg = document.createElement('p');
            // set attributes and classes
            this.infoPanelContainer.classList.add('info-panel-container');
            this.infoTitle.classList.add('info-title');
            this.infoTitle.textContent = "id Collector";
            this.closePanel.classList.add('close-panel');
            this.returnMsg.classList.add('returnMsg');
            // append to DOM
            document.body.appendChild(this.infoPanelContainer);
            this.infoPanelContainer.appendChild(this.infoTitle);
            this.infoPanelContainer.appendChild(this.closePanel);
            this.closePanel.addEventListener('click', clearPanelView.clearPanel);
            this.setView();
        },
        setView: function () {
            var deviceID = controller.getDeviceID();
            var deviceName = controller.getDeviceName();
            if (deviceID === null) {
                noDataView.init();
            } else {
                dataResponseView.init(deviceID, deviceName)
            }
        }
    }

    var dataResponseView = {
        init: function (id, name) {
            // create elements
            this.deviceData = document.createElement('input');
            this.copyBtn = document.createElement('button');
            this.listBtn = document.createElement('button');
            // set attributes, classes, event listeners
            this.deviceData.classList.add('device-id');
            this.deviceData.value = id
            this.copyBtn.classList.add('copyBtn');
            this.copyBtn.addEventListener('click', controller.copyID);
            this.copyBtn.textContent = "COPY";
            this.listBtn.classList.add('listBtn');
            this.listBtn.textContent = "Save to List";
            this.listBtn.addEventListener('click', controller.addID, { once: true });
            setPanelView.returnMsg.innerHTML = 'Device Found: <br>' + '<span class="device-name">' + name + '</span>';
            // append to DOM
            setPanelView.infoPanelContainer.appendChild(setPanelView.returnMsg);
            setPanelView.infoPanelContainer.appendChild(this.deviceData);
            setPanelView.infoPanelContainer.appendChild(this.copyBtn);
            setPanelView.infoPanelContainer.appendChild(this.listBtn);
            searchView.init();
        }
    }

    var noDataView = {
        init: function () {
            setPanelView.returnMsg.textContent = "NO pdpJSON on this page...Move along.";
            setPanelView.infoPanelContainer.appendChild(setPanelView.returnMsg);
            searchView.init();
        }
    }

    var searchView = {
        init: function () {
            // create elements
            this.searchContainer = document.createElement('div');
            this.searchFeild = document.createElement('input');
            this.searchBtn = document.createElement('button');
            // set attributes, classes, event listeners
            this.searchContainer.classList.add('search');
            this.searchFeild.placeholder = "Enter Device Search Verizon";
            this.searchBtn.classList.add('searchBtn');
            this.searchBtn.textContent = "Search for Devices";
            this.searchBtn.addEventListener('click', controller.searchDevices);
            // append to DOM
            setPanelView.infoPanelContainer.appendChild(this.searchContainer);
            this.searchContainer.appendChild(this.searchFeild);
            this.searchContainer.appendChild(this.searchBtn);
        }
    }

    var collectionView = {
        init: function () {
            // create elements
            this.collectionTitle = document.createElement('h2');
            this.collection = document.createElement('ul');
            this.clearBtn = document.createElement('button');
            // set classes, event listeners
            this.collection.classList.add('id-collection');
            this.clearBtn.classList.add('list-btn');
            this.clearBtn.addEventListener('click', controller.clearList);
            this.renderCollection();
        },
        renderCollection: function () {
            var list = controller.getList();
            collectionView.collection.innerHTML = list.map(function (listItem) {
                return "<li>" + listItem.count + " " + listItem.name + "<span class='seperator'>|</span>" + listItem.id + "</li>";
            }).join('');
            controller.setLocalStorage();
            this.render();
        },
        render: function () {
            // set text values
            this.collectionTitle.textContent = "Previous IDs Collected";
            this.clearBtn.textContent = "Clear Collection";
            // append to DOM
            setPanelView.infoPanelContainer.appendChild(this.collectionTitle);
            setPanelView.infoPanelContainer.appendChild(this.collection);
            setPanelView.infoPanelContainer.appendChild(this.clearBtn);
        }
    }

    var setCSS = {
        init: function () {
            this.mysheet = document.createElement('style');
            this.mysheet.classList.add('idFinderStyles');
            this.mysheet.innerHTML = "body .info-panel-container,html .info-panel-container{margin:0;font-family:Roboto,sans-serif}.info-panel-container div{box-sizing:unset}.info-panel-container :focus{outline:1px dashed #fff;outline-offset:2px}.info-panel-container{position:fixed;top:0;right:0;width:50%;height:100%;padding:20px;background:#000;opacity:.9;z-index:10000;color:#9e9e9e;overflow:scroll}.info-panel-container .close-panel{position:absolute;top:10px;right:10px;transition:.2s;transform:rotate(45deg);color:#ceff51;font-size:32px}.info-panel-container .close-panel:before{content:'+'}.info-panel-container .close-panel:hover{transform:rotate(135deg) scale(1.2)}.info-panel-container .info-title,.info-panel-container h2{font-size:28px;margin:0;text-align:center;color:#ceff51}.info-panel-container .returnMsg{font-size:20px;line-height:2;color:#ceff51}.info-panel-container .device-name{font-size:24px;color:#9e9e9e;font-weight:700;padding-bottom:5px;border-bottom:2px solid #ceff51}.info-panel-container input{background:#000;height:30px;border:none;border-bottom:2px solid#ceff51;color:#ceff51;font-size:16px}.info-panel-container button{position:relative;padding:8px 15px;margin-left:10px;font-weight:700;border:2px solid #ceff51;background:#000;color:#ceff51}.info-panel-container button:hover{color:#000;background:#ceff51;border:2px solid #000}.info-panel-container .search{border-top:1px solid #ceff51;padding-top:20px;margin:40px 0}.info-panel-container .search input{font-size:12px;min-width:50%}.info-panel-container .id-collection{list-style-type:none;padding:0;transition:all 1s}.info-panel-container .id-collection li{margin:10px 0;padding:10px 0;background:#171414;color:#fff}.info-panel-container .id-collection li:nth-child(even){color:#ceff51}.info-panel-container .seperator{padding:0 10px}.info-panel-container .list-area{display:inline-block;max-width:60%;min-height:100px;vertical-align:middle}@media screen and (max-width:768px){.info-panel-container{width:80%}}@media screen and (max-width:560px){.info-panel-container{width:100%}}";
            this.render();
        },
        render: function () {
            document.head.appendChild(this.mysheet);
        },
        remove: function () {
            this.cssTarget = document.querySelector('.idFinderStyles');
            document.head.removeChild(this.cssTarget);
        }
    }
    controller.init()
})()