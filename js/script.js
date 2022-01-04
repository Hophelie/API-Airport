
var MAP_API = {

	AVIATION_API_URL: "http://localhost:8888/API/api/airports.php",

	map : null,
	airports: null,
	infoWindow: null,
	infoWindowForm : null,

	initMap : function () {

		this.buildMap();
		this.fetchData();
		this.appendAirport()
	},

	buildMap : function () {

		// initialiser la google map

		var paris = { 
            lat: 48.8534, 
            lng: 2.3488 
        };

		this.map = new google.maps.Map(document.getElementById("map"),
		{
			zoom: 8,
			center: paris
		})

		const form = document.getElementById('formAirport')
		const lat = document.querySelector("[name='airportLong']")
		const long = document.querySelector("[name='airportlat']")

		form.addEventListener("submit", e => {

			e.preventDefault()
		
			const airportTmp = {
				name : form.elements["airportName"].value,
				longitude : long.value,
				latitude : lat.value
			}
			
			console.log( "airportTmp", airportTmp )
			fetch(this.AVIATION_API_URL,{
				method:"POST",
				mode:'cors',
				body : JSON.stringify(airportTmp)
			})
			.then( response => response.json() )
			.then( response => {


				console.log( "response", response )
				
				this.airports = response
				this.refreshList()
				
			})


			this.infoWindowForm.close()
			
		})

	
	
	},
	fetchData : function () {

		fetch(this.AVIATION_API_URL)
		.then(response => response.json())
		.then(response => { 
			this.airports = response
			this.airports.forEach(airport => {
				this.appendElementToList(airport)
			});
		})
		.catch()

		
	},

	// Ajoute un élément à la liste des aéroports
	appendElementToList : function ( airport ) {

		this.infoWindow = new google.maps.InfoWindow({
				content: airport.name,
				disableAutoPan: true,
		});
		
		let el =  {
				lat: parseFloat(airport.latitude), 
            	lng: parseFloat(airport.longitude)
			}

			
			
			const icon = {
				url: "./img/plane.svg",
				anchor: new google.maps.Point(10,20),
				scaledSize: new google.maps.Size(20,20)
			};
		

		var li = document.createElement("li")
		//catch l'ajout au click
		li.addEventListener("click", () => {
			this.map.setZoom(8);
			this.map.setCenter(marker.getPosition());
		
		});
		//Catch le delete de l'aéroport au click
		li.addEventListener("dblclick", () => {
			this.deleteAirport(airport)
		});
			
		li.innerHTML = airport.name


		document.getElementById('airports-list').appendChild(li)
		
			const marker = new google.maps.Marker({
				position: el,
				map: this.map,
				icon: icon	
				});

		//Ajoute le marker
		marker.addListener("click", () => {
		this.map.setZoom(8);
		this.map.setCenter(marker.getPosition());
		this.infoWindow.open({
			anchor: marker,
			map,
			shouldFocus: false,
			});
		});		


		
	},

	appendAirport : function(){

		this.map.addListener('dblclick',(mapsMouseEvent)=>{

			//formulaire 
			const form = document.getElementById('formAirport')
			const lat = document.querySelector("[name='airportLong']")
			const long = document.querySelector("[name='airportlat']")

			form.style.display = ""
	
	
			//Values	
			long.value =  mapsMouseEvent.latLng.toJSON().lng,
			lat.value =  mapsMouseEvent.latLng.toJSON().lat
			
	
			this.infoWindowForm = new google.maps.InfoWindow({
				position: mapsMouseEvent.latLng,
			  });

			  if (this.infoWindow) this.infoWindow.close()
			  this.infoWindowForm.close()

			this.infoWindowForm.setContent(form);
			this.infoWindowForm.open(this.map);

			

			});
	},

	deleteAirport: function(airport){

		let id = airport.id;
		
		fetch(this.AVIATION_API_URL, {
			headers: new Headers(),
			method: 'DELETE',
			mode:'cors',
			body : JSON.stringify({"id":id})
		})
		.then(response => response.json())
		.then(response => {
			this.airports = response
			this.refreshList()
		})
		
	},


	refreshList: function(){


			document.getElementById('airports-list').innerHTML = ''

			this.airports.forEach(airport => {
				this.appendElementToList(airport)
			});
			
	},
	refreshPlanes: function(){},
	
	
}
