ymaps.ready(init);

function init() {
	let objMap = {},
		count = 0,
		time = new Date();

	let myMap = new ymaps.Map("map", {
		center: [59.93534158, 30.32645055],
		zoom: 14,
	});

	window.clusterer = new ymaps.Clusterer({
		preset: 'islands#invertedVioletClusterIcons',
		clusterDisableClickZoom: true,
		clusterBalloonContentLayout: "cluster#balloonCarousel"

	});

	myMap.geoObjects.add(clusterer);
	myMap.events.add('click', (e) => {

		if (window.balloon) {
			balloon.close();
		}

		let coords = e.get('coords');
		bolloonTemp(coords);

	});

	clusterer.events.add('click', (e) => {
		let object = e.get('target');
		let coordsMap = e.get('coords');

		if (object.getGeoObjects) {
			let geoObjects = object.getGeoObjects();
			setTimeout(() => {
				const balloonContent = document.querySelector('.balloon__layout');
				balloonContent.classList.add('active');
			}, 100);
		} else {

			bolloonTemp(object.geometry._coordinates, object);

		}

	});

	document.addEventListener('click', (e) => {

		if (e.target.className == 'linkCoords') {
			let arrCoord = e.target.dataset.coords.split(',');
			let addr = [Number(arrCoord[0]), Number(arrCoord[1])];
			let flag = 'Y';
			myMap.balloon.close();
			bolloonTemp(addr, flag);
		}

	});

	function bolloonTemp(coords, object) {
		let date = [];

		if (object && object != 'Y') {
			for (let key in objMap) {
				if (objMap.hasOwnProperty(key)) {

					let eq = JSON.stringify(objMap[key].coords) == JSON.stringify(object.geometry._coordinates);
					if (eq) {
						date.push(objMap[key]);
					}
				}
			}

		} else if (object == 'Y') {
			let object = coords;
			for (let key in objMap) {
				if (objMap.hasOwnProperty(key)) {

					let eq = JSON.stringify(objMap[key].coords) == JSON.stringify(object).replace(/"/g, '');
					if (eq) {
						date.push(objMap[key]);
					}
				}
			}
		}

		ymaps.geocode(coords)
			.then(function (res) {
				const points = res.geoObjects.get(0).properties.get('text');
				localStorage.point = points;
				let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					`<div class="form">
               <div class="header"> ${points} </div>
                   <div class="body">
                   
                   </div>
                   <p class="title">Ваш отзыв</p>
               <form>
                   <div><input id="name" type="text" placeholder="Ваше имя"/></div>
                   <div><input id="point" type="text" placeholder="Укажите место" /></div>
                   <div>
                        <textarea id="message" placeholder="Поделись впечатлениями">
                        </textarea></div>
                   <div class="button">
                   <button id="btn">Отправить</button>
                   </div>
               </form>
           </div>`, {
					build: function () {
						BalloonContentLayout.superclass.build.call(this);
						let that = this;
						if (date.length > 0) {
							for (const key in date) {
								if (date.hasOwnProperty(key)) {
									const body = document.querySelector('.body');
									const div = document.createElement('div');
									div.innerHTML = date[key].message;
									body.appendChild(div);
								}
							}
						}
						document.getElementById('btn').addEventListener('click', (e) => {
							e.preventDefault();
							const name = document.getElementById('name').value;
							const point = document.getElementById('point').value;
							const message = document.getElementById('message').value;
							const body = document.querySelector('.body');
							const div = document.createElement('div');
							div.innerHTML = `<div id="review"><b>${name}</b>
                    <span>${point}</span>
                    <span class="data">
                    ${time.getDate()}
                    .${time.getMonth()}
                    .${time.getFullYear()}
                    .${time.getHours()}
                    .${time.getMinutes()}
                    </span>
                    <p>${message}</p>
                    </div>`;

							body.appendChild(div);
							that.onContent(name, point, message);
						});
					},

					clear: function () {

						BalloonContentLayout.superclass.clear.call(this);
					},

					onContent: function (name, point, message) {

						objMap[count++] = {
							coords: coords, name: name, date: time.toString(), message:
								`<div id="review"><b>${name}</b> 
                 <span>${point}</span>
                 <span class="data">${time.getDate()}
                 .${time.getMonth()}
                 .${time.getFullYear()} 
                 .${time.getHours()}
                 .${time.getMinutes()}</span>
                 <p>${message}</p>
                 </div>`};

						let Placemark = new ymaps.Placemark(coords, {
							balloonContentHeader: `<b>${point}</b>`,
							balloonContentBody: `<div id="review">
                   <a class="linkCoords" href="javascript:void(0);" data-coords="${coords}">${points}</a>
                    <p>${message}</p>
                    </div>`,
							balloonContentFooter: `
                    ${time.getDate()}
                   .${time.getMonth()}
                   .${time.getFullYear()} 
                   .${time.getHours()}
                   .${time.getMinutes()}`,
							hintContent: `<b>${point}</b>`,
						}, {
							balloonContentBodyLayout: BalloonContentLayout,
							balloonPanelMaxMapArea: 0,
							hasBalloon: false
						});

						window.clusterer.add(Placemark);

					}
				});

				window.balloon = new ymaps.Balloon(myMap, {
					contentLayout: BalloonContentLayout
				});
				balloon.options.setParent(myMap.options);
				balloon.open(coords);
			});
	}
}

