
var highlyAdvisedAnime = {}; // anime that is really advised
var advisedAnime = {}; //adviser list diffrence
var userList = []; //advised id no default user input
var adviserList =[];
var filledList = 0;
var sequelsIDs = []; //memoization
var minimumScore = 8; // minimum score to be advised from in the adviser list
var bestGenres = []; //maps the best genres of the user
var parsedLists = 0;
var errorBool = false;

function getUserList(username){
	var adviserUserName = document.getElementById("adviserInput").value;
	if (adviserUserName === "")
		adviserUserName = 'gafour';

	var userUserName = document.getElementById("userInput").value;
	if (userUserName === ""){
		alert("please type your userName");
		return;
	}

	minimumScore = document.getElementById("scoreInput").value;

	document.getElementById('accueil').style.display = "none";
	document.getElementById('loading').style.display = "block";
	


	var query = `
	query ($userName: String) { # Define which variables will be used in the query (id)
		MediaListCollection (userName: $userName, type: ANIME, status:COMPLETED) {
			lists{
				entries{
					score
					media{
						format
						id
						genres    
					}    
				}        
			}
		}
	}

`;
var variables = {
	userName: userUserName
};
var url = 'https://graphql.anilist.co',
options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	body: JSON.stringify({
		query: query,
		variables: variables
	})
};


    	

    //document.getElementById('page1milieu').innerHTML = '<pre>' + JSON.stringify(result, null, 4) + '</pre>';
    //document.getElementById('page1milieu').innerHTML

    var queryA =`
	query ($userName: String) { # Define which variables will be used in the query (id)
		MediaListCollection (userName: $userName, type: ANIME, status:COMPLETED) {
			lists{
				entries{
					score
					media{
						format
						coverImage {
              				large
            			}
						id
						title{
							romaji
						}
						genres
						relations{
   	    				edges{
   	    					node{
   	    						id
   	    						format
   	    						title{
   	    							romaji
   	    						}
   	    					}
   	    					relationType
   	    				}
   	    			}    
					}    
				}        
			}
		}
	}

`;
    var variablesA = {
    	userName: adviserUserName
    };
    var optionsA = {
    	method: 'POST',
    	headers: {
    		'Content-Type': 'application/json',
    		'Accept': 'application/json',
    	},
    	body: JSON.stringify({
    		query: queryA,
    		variables: variablesA
    	})
    };

    	// Make the HTTP Api request for the user
    	fetch(url, options).then(handleResponse)
    	.then(parseUserList)
    	.catch(handleError);

    	// Make the HTTP Api request for the adviser
    	fetch(url, optionsA).then(handleResponse)
    	.then(parseAdviserList)
    	.catch(handleError);
}

function displayAdvise(){
	//animedisplay going to contain image/ text (class)
	//images contains the image
	//highly advised list[0] = title [1] = image link
	var highlyAdvisedNumber = Object.keys(highlyAdvisedAnime).length; // number of highly advised anime
	var advisedNumber = Object.keys(advisedAnime).length;
	var animeDisplayContainers = document.getElementsByClassName("animeDisplay"); // contains the image/text
	var animeImagesContainers = document.getElementsByClassName("images"); 
	var animeLinksContainers = document.getElementsByClassName("animeLink");

	

	for (var i=0; i<animeDisplayContainers.length; i++){
		//get random anime from the highlyadvisedList if there's still
		if (highlyAdvisedNumber > 0 && i<3){
			var randomAnimeIndex = Math.floor(Math.random() * highlyAdvisedNumber--); // get random index
			const randomKey = Object.keys(highlyAdvisedAnime)[randomAnimeIndex];
			//modify the image
			animeImagesContainers[i].src = highlyAdvisedAnime[randomKey][1];
			//write the anime name
			var titleLength = highlyAdvisedAnime[randomKey][0].length;
			if (titleLength > 19){
			    var wordFromTitle = highlyAdvisedAnime[randomKey][0].split(" ");
			    var lengthOfWordsInLine = 0;
			    var actualLineStr = "";
			    //animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">";
			    for (var j=0; j<wordFromTitle.length; j++){
			    	if (lengthOfWordsInLine + wordFromTitle[j].length + 1 > 19){ // if the word is going out of the line jump to next line
			    		animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + actualLineStr + "</div>";
			    		actualLineStr = wordFromTitle[j] + " ";
			    		lengthOfWordsInLine = wordFromTitle[j].length + 1;
			    	}
			    	else{
			    		actualLineStr += wordFromTitle[j] + " ";
			    	    lengthOfWordsInLine += wordFromTitle[j].length + 1;
			    	}
			    }
			    if (actualLineStr !== ""){
			    	animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + actualLineStr + "</div>";;
			    }
			    
			}
			else
			{	
				animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + highlyAdvisedAnime[randomKey][0] + "</div>";
			}

			//modify the anime link
			animeLinksContainers[i].href = "https://anilist.co/anime/" + randomKey;

			//remove the anime from the list
			delete highlyAdvisedAnime[randomKey];
		} 
		else if (advisedNumber > 0) {

			var randomAnimeIndex = Math.floor(Math.random() * advisedNumber--); // get random index
			const randomKey = Object.keys(advisedAnime)[randomAnimeIndex];
			
			//modify the image
			animeImagesContainers[i].src = advisedAnime[randomKey][1];
			//write the anime name
			var titleLength = advisedAnime[randomKey][0].length;
			if (titleLength > 19){
			    var wordFromTitle = advisedAnime[randomKey][0].split(" ");
			    var lengthOfWordsInLine = 0;
			    var actualLineStr = "";
			    //animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">";
			    for (var j=0; j<wordFromTitle.length; j++){
			    	if (lengthOfWordsInLine + wordFromTitle[j].length + 1 > 19){ // if the word is going out of the line jump to next line
			    		animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + actualLineStr + "</div>";
			    		actualLineStr = wordFromTitle[j] + " ";
			    		lengthOfWordsInLine = wordFromTitle[j].length + 1;
			    	}
			    	else{
			    		actualLineStr += wordFromTitle[j] + " ";
			    	    lengthOfWordsInLine += wordFromTitle[j].length + 1;
			    	}
			    }
			    if (actualLineStr !== ""){
			    	animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + actualLineStr + "</div>";;
			    }
			    
			}
			else
			{	
				animeDisplayContainers[i].innerHTML += "<div class=\"animeText\">" + advisedAnime[randomKey][0] + "</div>";
			}		

			//modify the anime link
			animeLinksContainers[i].href = "https://anilist.co/anime/" + randomKey;
			console.log(animeLinksContainers[i].href);
			//remove the anime from the list
			delete advisedAnime[randomKey];
		} else {
			//not enough anime to advice from
			animeDisplayContainers[i].innerHTML += "<div class=\"animeText\"> Nothing to suggest </div>";

		}

		
	}
	document.getElementById('loading').style.display = "none";
	document.getElementById('page1').style.display = "flex";

}
function handleResponse(response) {
	return response.json().then(function (json) {
		return response.ok ? json : Promise.reject(json);
	});
}

function handleError(error) {
	console.log('Error, check console ');
	alert("Error, probably wrong input, please Retry");
	errorBool = true;
	document.getElementById('accueil').style.display = "block";
	document.getElementById('loading').style.display = "none";
	document.getElementById('page1').style.display = "none";
	console.error(error);
}

function parseUserList(data){
	//console.log("parsing the user's list")
	//console.log(data); // data contains the user' lists

	var genresMap = new Map();

	for (var i = 0; i<data.data.MediaListCollection.lists[0].entries.length; i++){
		userList.push(data.data.MediaListCollection.lists[0].entries[i].media.id);
	

		for (var j=0; j<data.data.MediaListCollection.lists[0].entries[i].media.genres.length; j++){ // iterate through the genres

			if (genresMap.has(data.data.MediaListCollection.lists[0].entries[i].media.genres[i])){
				//genre already is in the table increment it by one
				genresMap.set(data.data.MediaListCollection.lists[0].entries[i].media.genres[i], genresMap.get(data.data.MediaListCollection.lists[0].entries[i].media.genres[i])+1);
			}else{
				genresMap.set(data.data.MediaListCollection.lists[0].entries[i].media.genres[i], 1)
			}


		}
	}

	//userlist is ready 
	const sortedGenres = new Map([...genresMap.entries()].sort((a, b) => b[1] - a[1]));

	for (const k of sortedGenres.keys()){
		bestGenres.push(k);
	}
	parsedLists++;
}

function parseAdviserList(data) {
	//console.log(data); //data contains the adviser's list
	for (var i = 0; i<data.data.MediaListCollection.lists[0].entries.length; i++){
		adviserList.push(data.data.MediaListCollection.lists[0].entries[i].media.id);
	}

	while(parsedLists < 1){
		if (errorBool)
			return;
	}

	for (var k=0; k<data.data.MediaListCollection.lists[0].entries.length; k++){
   	    			parseAdviserAnime(data, k);
	}

	parsedLists++;
	if (parsedLists >= 2){
		displayAdvise();
	}
   /* //for each anime we'll query it's relations 
	for(var i = 0; i < data.data.MediaListCollection.lists[0].entries.length; i++)
	{
   	    // for each media we're going to iterate
   	    if (data.data.MediaListCollection.lists[0].entries[i].media.format == 'TV' && data.data.MediaListCollection.lists[0].entries[i].score > minimumScore){
   	    	//media is an anime that is pretty well graded, now we need to check if this is a sequel
   	    		
   	    	
    }
   		//adviserList.push(data.data.MediaListCollection.lists[0].entries[i].media.title.romaji);
   		//document.getElementById('page1').innerHTML += '<div  class="milieu">' + data.data.MediaListCollection.lists[0].entries[i].media.title.romaji + '</div>';
   	}
*/
    //document.getElementById('page1milieu').innerHTML = '<pre>' + JSON.stringify(data, null, 4) + '</pre>';
    
}

//only for adviser list
//only takes prequels in consideration

function parseAdviserAnime(data, k){
	if (data.data.MediaListCollection.lists[0].entries[k].media.format !== 'TV' || data.data.MediaListCollection.lists[0].entries[k].score < minimumScore)
		return;


	if (sequelsIDs.includes(data.data.MediaListCollection.lists[0].entries[k].media.id) || (userList.includes(data.data.MediaListCollection.lists[0].entries[k].media.id))) // check if we already know if this is a sequel via memoization
		return;

	for (var i=0; i<data.data.MediaListCollection.lists[0].entries[k].media.relations.edges.length; i++){
		if (data.data.MediaListCollection.lists[0].entries[k].media.relations.edges[i].relationType === 'PREQUEL' && adviserList.includes(data.data.MediaListCollection.lists[0].entries[k].media.relations.edges[i].node.id)) {// anime has a prequel we can move on and remove highlyAdvisedAnime
			return;
			}

		if ((data.data.MediaListCollection.lists[0].entries[k].media.relations.edges[i].node.format === 'TV') && !(sequelsIDs.includes(data.data.MediaListCollection.lists[0].entries[k].media.relations.edges[i].node.id)))
			sequelsIDs.push(data.data.MediaListCollection.lists[0].entries[k].media.relations.edges[i].node.id) // we know this is not the first prequel, won't bother with it
	}

	//this is the first anime in a series and user user never saw it	
	
	//now to check if this anime has one of the users favorite genres
	for (var i=0; i<data.data.MediaListCollection.lists[0].entries[k].media.genres.length; i++){

		var loopLength = (bestGenres.length>3)?3:bestGenres.length;

		for (var j=0; j<loopLength; j++){
			if (data.data.MediaListCollection.lists[0].entries[k].media.genres[i] === bestGenres[j]){		
				highlyAdvisedAnime[data.data.MediaListCollection.lists[0].entries[k].media.id] = [data.data.MediaListCollection.lists[0].entries[k].media.title.romaji, data.data.MediaListCollection.lists[0].entries[k].media.coverImage.large];
				return;
			}
		}
		

	}

	advisedAnime[data.data.MediaListCollection.lists[0].entries[k].media.id] = [data.data.MediaListCollection.lists[0].entries[k].media.title.romaji, data.data.MediaListCollection.lists[0].entries[k].media.coverImage.large];
	return;
			
}

function hasEndedBefore(leftYear, leftMonth, leftDay, rightYear, rightMonth, rightDay){
	if (leftYear < rightYear)
		return true;
	else if (rightYear > leftYear)
		return false;

	if (leftMonth < rightMonth)
		return true;
	else if (rightMonth > leftMonth)
		return false;

	if (leftDay < rightDay)
		return true;
	else if (rightDay > leftDay)
		return false;

	return true;

}
