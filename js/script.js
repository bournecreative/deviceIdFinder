(function () {

    var model = {
        currentDeviceID: null,
        currentDeviceName: null,
        deviceIDList: JSON.parse(localStorage.getItem('collection')) || []
    }

    var controller = {
        init: function () {
            this.findPDPJSON();
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
            this.searchContainer.classList.add('idF-search');
            this.searchFeild.placeholder = "Enter Device Search Verizon";
            this.searchBtn.classList.add('idF-searchBtn');
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
            this.clearBtn.classList.add('idF-listBtn');
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
    controller.init()
})()