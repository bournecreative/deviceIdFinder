!function(){var e={currentDeviceID:null,currentDeviceName:null,deviceIDList:JSON.parse(localStorage.getItem("collection"))||[]},n={init:function(){this.findPDPJSON(),c.init(),i.init(),o.init()},findPDPJSON:function(){"undefined"!=typeof pdpJSON&&(e.currentDeviceID=pdpJSON.output.vzwDL.page.deviceId,e.currentDeviceName=pdpJSON.output.vzwDL.productDetails.name)},getDeviceID:function(){return e.currentDeviceID},getDeviceName:function(){return e.currentDeviceName},copyID:function(e){e.preventDefault(),document.querySelector(".device-id").select(),document.execCommand("copy")},addID:function(){var t={count:e.deviceIDList.length+1+".",id:n.getDeviceID(),name:n.getDeviceName()};e.deviceIDList.push(t),a.init()},getList:function(){return e.deviceIDList},setLocalStorage:function(){localStorage.setItem("collection",JSON.stringify(e.deviceIDList))},clearList:function(){e.deviceIDList=[],a.renderCollection()},searchDevices:function(){var e="https://search.verizonwireless.com/onesearch/search?q=",n=o.searchFeild.value.split(" ");if(n.length<2)window.location=e+n;else{for(var t="",i=0;i<n.length;i++)n[i]===n.length?t+=n[i]:t=t+"+"+n[i];window.location=e+t.trim()}}},t=function(){document.body.removeChild(i.infoPanelContainer)},i={init:function(){this.infoPanelContainer=document.createElement("div"),this.infoTitle=document.createElement("h1"),this.closePanel=document.createElement("span"),this.render()},render:function(){this.infoPanelContainer.classList.add("info-panel-container"),this.infoTitle.classList.add("info-title"),this.infoTitle.textContent="id Collector",this.closePanel.classList.add("close-panel"),document.body.appendChild(this.infoPanelContainer),this.infoPanelContainer.appendChild(this.infoTitle),this.infoPanelContainer.appendChild(this.closePanel),this.closePanel.addEventListener("click",t)}},o={init:function(){this.returnMsg=document.createElement("p"),this.returnMsg.classList.add("returnMsg"),this.deviceData=document.createElement("input"),this.deviceData.classList.add("device-id"),this.copyBtn=document.createElement("button"),this.copyBtn.classList.add("copyBtn"),this.copyBtn.addEventListener("click",n.copyID),this.listBtn=document.createElement("button"),this.listBtn.classList.add("listBtn"),this.listBtn.addEventListener("click",n.addID,{once:!0}),this.searchContainer=document.createElement("div"),this.searchContainer.classList.add("search"),this.searchFeild=document.createElement("input"),this.searchBtn=document.createElement("button"),this.searchBtn.classList.add("searchBtn"),this.searchBtn.addEventListener("click",n.searchDevices),this.render()},render(){var e=n.getDeviceID(),t=n.getDeviceName();null===e?(this.returnMsg.textContent="NO pdpJSON on this page...Move along.",i.infoPanelContainer.appendChild(this.returnMsg)):(this.returnMsg.innerHTML='Device Found: <br><span class="device-name">'+t+"</span>",i.infoPanelContainer.appendChild(this.returnMsg),this.deviceData.value=e,this.copyBtn.textContent="COPY",this.listBtn.textContent="Save to List",this.searchFeild.placeholder="Enter Device Search Verizon",this.searchBtn.textContent="Search for Devices",i.infoPanelContainer.appendChild(this.deviceData),i.infoPanelContainer.appendChild(this.copyBtn),i.infoPanelContainer.appendChild(this.listBtn),i.infoPanelContainer.appendChild(this.searchContainer),this.searchContainer.appendChild(this.searchFeild),this.searchContainer.appendChild(this.searchBtn))}},a={init:function(){this.collectionTitle=document.createElement("h2"),this.collection=document.createElement("ul"),this.collection.classList.add("id-collection"),this.clearBtn=document.createElement("button"),this.clearBtn.classList.add("list-btn"),this.clearBtn.addEventListener("click",n.clearList),this.renderCollection(),this.render()},renderCollection:function(){var e=n.getList();a.collection.innerHTML=e.map(function(e){return"<li>"+e.count+" "+e.name+"<span class='seperator'>|</span>"+e.id+"</li>"}).join(""),n.setLocalStorage()},render:function(){this.collectionTitle.textContent="Previous IDs Collected",this.clearBtn.textContent="Clear Collection",i.infoPanelContainer.appendChild(this.collectionTitle),i.infoPanelContainer.appendChild(this.collection),i.infoPanelContainer.appendChild(this.clearBtn)}},c={init:function(){this.mysheet=document.createElement("style"),this.mysheet.innerHTML="body .info-panel-container,html .info-panel-container{margin:0;font-family:Roboto,sans-serif}.info-panel-container div{box-sizing:unset}.info-panel-container :focus{outline:1px dashed #fff;outline-offset:2px}.info-panel-container{position:fixed;top:0;right:0;width:50%;height:100%;padding:20px;background:#000;opacity:.9;z-index:10000;color:#9e9e9e;overflow:scroll}.info-panel-container .close-panel{position:absolute;top:10px;right:10px;transition:.2s;transform:rotate(45deg);color:#ceff51;font-size:32px}.info-panel-container .close-panel:before{content:'+'}.info-panel-container .close-panel:hover{transform:rotate(226deg) scale(1.4)}.info-panel-container .info-title,h2{font-size:28px;margin:0;text-align:center;color:#ceff51}.info-panel-container .returnMsg{font-size:20px;line-height:2;color:#ceff51}.info-panel-container .device-name{font-size:24px;color:#9e9e9e;font-weight:700;padding-bottom:5px;border-bottom:2px solid #ceff51}input{background:#000;height:30px;border:none;border-bottom:2px solid#ceff51;color:#ceff51;font-size:16px}.info-panel-container button{position:relative;padding:8px 15px;margin-left:10px;font-weight:700;border:2px solid #ceff51;background:#000;color:#ceff51}.info-panel-container button:hover{color:#000;background:#ceff51;border:2px solid #000}.info-panel-container .search{border-top:1px solid #ceff51;padding-top:20px;margin:40px 0}.info-panel-container .search input{font-size:12px;min-width:50%}.info-panel-container .id-collection{list-style-type:none;padding:0;transition:all 1s}.info-panel-container .id-collection li{margin:10px 0;padding:10px 0;background:#171414;color:#fff}.info-panel-container .id-collection li:nth-child(even){color:#ceff51}.info-panel-container .seperator{padding:0 10px}.info-panel-container .list-area{display:inline-block;max-width:60%;min-height:100px;vertical-align:middle}@media screen and (max-width:768px){.info-panel-container{width:80%}}@media screen and (max-width:560px){.info-panel-container{width:100%}}",this.render()},render:function(){document.head.appendChild(this.mysheet)}};n.init()}();