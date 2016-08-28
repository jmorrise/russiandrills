$(document).ready(function(){
	var currentQuestion;
	var TEST_DEFAULT = 10; //Number of questions to test at a time
	var numToTest;
	var directory = {};

	//---------Initialization and loading questions--------//

	var init = function(){
		// This function runs when the page is loaded.

		// Retrieve the directory from storage
		directory = JSON.parse(localStorage.getItem('russianDrillsDir'));

		// Get the name of the topic and subtopic from the query string, 
		// Create the page's title from these
		// Use them to get and store all the questions for that subtopic


		var query = window.location.search;
		var params = parseQuery(query);
		var pageName = '';
		var parent = directory[params.parent];
		var topic = parent.subtopics[params.id];
		if(params.hasOwnProperty('parent')){
			pageName += parent.title + ': ';
		}
		pageName += topic.title;
		breadcrumbs.setCrumbs(decodeURI(pageName));
		var nFiles = topic.files.length;

		var callbackFun = function(){};
		// For each 
		for (var i = 0; i < nFiles; i++){
			filename = topic.files[i];
			if (i == nFiles-1){
				callbackFun = setNewRound;
			}
			loadList('/testing/Lists/'+filename, callbackFun);
		}
		if (topic.mode=="quiz-mode"){feedbackBox.canContinue(false);}
		else{feedbackBox.canContinue(true);}
	}

	parseQuery = function(query){
		// Skip the leading ?, which should always be there, 
		// but be careful anyway
		if (query.substring(0, 1) == '?') {
			query = query.substring(1);
		}
		var pairs = query.split('&');
		var params = {};
		for(var i = 0; i < pairs.length; i++){
			var pair = pairs[i].split('=');
			params[pair[0]] = pair[1];
		}
		return params;
	}

	loadList = function(listName, callback){
		//Load the JSON file named listName
		//var theURL = "/RussianDrills/NewLists/"+listName;
		var theURL = listName;
		//ajax request for the file
		var listRequest = $.ajax({
			url: theURL,
			dataType: "json",
		});  
		//The ajax request is asynchronous; the success function fills the deck once the request is complete
		//Watch out - the request will not succeed if the JSON file has any syntax errors.
		//Check all JSON files for errors.
		listRequest.success(function(json){
			console.log('ajax promise to Deck object returned successfully');
			currentDeck.fillDeck(json);
			//Callback should be the Display New Question function, and is called once the deck is filled.
			callback();
		});
		listRequest.error(function(){
			console.log("Could not find JSON file " + listName);
		});
	}

	var setNewRound = function(){
		/*
		Called when the page loads, or after dismissing the feedback box and continuing.
		Resets the number of correct and missed questions to 0
		Sets the progress bars to empty
		"Shuffles" the deck
		Draws the next question
		*/
		numToTest = Math.min(TEST_DEFAULT, currentDeck.size());
		currentDeck.setForNewRound();
		console.log(currentDeck.toString());
		progressBar.update(0,0);
		feedbackBox.reset();
		nextQuestion();
	}
	//-------------------------------------------------------//
	

	var nextQuestion = function(){
	/*
	Chooses a new prompt, and displays the parts of the question
	*/
		currentQuestion = currentDeck.draw();
		currentQuestion.render();
		
	}

	check = function(){
		var answerObj = currentQuestion.checkUserAnswer();
		var entered = answerObj.entered;
		var actual = answerObj.actual;
		var userScore = answerObj.score;
		answerFade.showAnswer(actual, userScore===1);
		
		currentDeck.update(userScore);
		feedbackBox.update(currentQuestion.feedbackString(), userScore);
		var numCorrect = feedbackBox.numCorrect();
		var numMissed = feedbackBox.numMissed();
		progressBar.update(numCorrect*100/numToTest, numMissed*100/numToTest);
		
		if (roundComplete()){
			feedbackBox.setup();
			feedbackBox.show();
		}
		else{			
			nextQuestion();
		}
	}

	

	roundComplete = function(){
	/*
	Determines whether it is time to finish the round and show the feedback box
	*/
		return feedbackBox.numTested() >= numToTest;
	}

	/**********Button callback functions**********/
	$('#check-button-div').on('click', '#check-button', function(event) {
	/*Called when the 'Check Answer' button is clicked*/
		check();
	});

	$('#lower-question-div').on('keydown', '.answer-input', function(event) {
	/*Called when the enter key is pressed in an answer input field*/	
		if (event.keyCode==13 && !feedbackBox.getState())
		{	
			console.log("ENTER KEY IN ANSWER BOX");		
			check();
		}
	});

	$('#lower-question-div').on('click', '.answer-input', function(event) {
	/*Called when any answer entry field is clicked*/
		$('#check-button').removeClass('disabled');
	});



	feedbackBox.continueButton.on('click', function(event) {
	/*Called when the 'Continue' button on the modal feedback box is clicked*/
		feedbackBox.setState(false);		
		setNewRound();		
	});

	feedbackBox.newButton.on('click', function(event) {
	/*Called when the 'New Topic' button on the modal feedback box is clicked*/
		feedbackBox.setState(false);	
		window.location.assign("index.html");	
	});

	feedbackBox.closeButton.on('click', function(event) {
	/*Called when the 'Close' button on the modal feedback box is clicked*/
		feedbackBox.setState(false);	
		setNewRound();		
	});


	//Code to run when the page loads.

	//Initialize
	init();


});
