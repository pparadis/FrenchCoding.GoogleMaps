
            var map;
            var globalInfoWindow;
            function attachSecretMessage(marker, element) {
                var message = '<div class="editable" style="width:250px; padding:5px 10px; color:#4e4e4e;">' + element.HtmlInfo + '</div>';
                google.maps.event.addListener(marker, 'click', function () {
                    if (globalInfoWindow) {
                        globalInfoWindow.close();
                    }

                    globalInfoWindow = new google.maps.InfoWindow({
                        content: message
                    });

                    globalInfoWindow.open(map, marker);
                });
            }

            function initialize() {
                var result;
                var path = "";
                var cachekey = "";
                var regionId = "";
                $.get(path, {
                    Cache: cachekey,
                    regionId: regionId
                },
                function (data) {
                    result = $.parseJSON(data);

                    //console.log("Center : " + result.CenterLatitude + ":" + result.CenterLongitude);

                    var mapOptions = {
                        zoom: result.CenterZoomLevel,
                        center: new google.maps.LatLng(result.CenterLatitude, result.CenterLongitude, false),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: false
                    };
                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                    //google.maps.event.addListener(map, 'center_changed', function () {
                    //    console.log(map.getCenter());
                    //});

                    var markers = [];
                    for (var i = 0; i < result.ElementList.length - 1; i++) {
                        var element = result.ElementList[i];
                        var latLng = new google.maps.LatLng(element.Latitude, element.Longitude);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            icon: element.Icon,
                            title: element.Name
                        });

                        attachSecretMessage(marker, element);
                        markers.push(marker);
                    }

                    var bounds = new google.maps.LatLngBounds();
                    for (i = 0; i < markers.length; i++) {
                        if (markers[i].icon.indexOf("Autre") <= 0) {
                            bounds.extend(markers[i].getPosition());
                        }
                    }
                    //console.log(bounds.getCenter());
                    map.setCenter(bounds.getCenter());
                    map.setZoom(result.CenterZoomLevel);
                    //map.fitBounds(bounds);

                    var options = {
                        gridSize: 50,
                        maxZoom: 15,

                        /* Styles pour les icônes */
                        styles: [
                            { //0-9 / Actif
                                opt_textColor: 'white',
                                url: '/userfiles/Images/Ico_GroupeCamp_small.png',
                                height: 50,
                                width: 55,
                                textColor: "white",
                                anchor: [25, 38]

                            },
                            { //10-29 / Actif
                                opt_textColor: 'white',
                                url: '/userfiles/Images/Ico_GroupeCamp_small.png',
                                height: 50,
                                width: 55,
                                textColor: "white",
                                anchor: [25, 34]
                            },
                            { //30+ / Actif
                                opt_textColor: 'white',
                                url: '/userfiles/Images/Ico_GroupeCamp_plus.png',
                                height: 70,
                                width: 75,
                                textColor: "white",
                                anchor: [45, 41]
                            },
                            { //0-9 / Inactif
                                opt_textColor: '#DDDDDD',
                                url: '/userfiles/Images/Ico_GroupeAutre_Vide.png',
                                height: 50,
                                width: 55,
                                textColor: "#DDDDDD",
                                anchor: [25, 38]
                            },
                            { //10-29 / Inactif
                                opt_textColor: '#DDDDDD',
                                url: '/userfiles/Images/Ico_GroupeAutre_Vide.png',
                                height: 50,
                                width: 55,
                                textColor: "#DDDDDD",
                                anchor: [25, 34]
                            },
                            { //30+ / Inactif
                                opt_textColor: '#DDDDDD',
                                url: '/userfiles/Images/Ico_GroupeAutre_Plus.png',
                                height: 70,
                                width: 75,
                                textColor: "#DDDDDD",
                                anchor: [45, 41]
                            }

                        ],
                        calculator: function (markersList, numStyles) {
                            var isInResult = false;

                            for (var i = 0; i < markersList.length; i++) {
                                if (markersList[i].icon.indexOf("Autre") <= 0) {
                                    isInResult = true;
                                    break;
                                }
                            }
                            if (isInResult && markersList.length < 10) {
                                return { text: markersList.length, index: 1 };
                            }

                            if (isInResult && markersList.length >= 10 && markersList.length < 30) {
                                return { text: markersList.length, index: 2 };
                            }

                            if (isInResult && markersList.length >= 30) {
                                return { text: "", index: 3 };
                            }

                            if (!isInResult && markersList.length < 10) {
                                return { text: markersList.length, index: 4 };
                            }

                            if (!isInResult && markersList.length >= 10 && markersList.length < 30) {
                                return { text: markersList.length, index: 5 };
                            }

                            if (!isInResult && markersList.length >= 30) {
                                return { text: "", index: 6 };
                            }

                            return { text: markersList.length, index: 1 };
                        }
                    };

                    var mc = new MarkerClusterer(map, markers, options);
                }, 'Text');
            }

            google.maps.event.addDomListener(window, 'load', initialize);