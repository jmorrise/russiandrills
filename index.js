$(document).ready(function(){

	function createMenus(dir){
		// Build the HTML for the menus and then add them to the page.
		// dir is a directory object containing a dictionary of topics.
		var buttonDiv = $('#button-div');
		buttonDiv.empty();
		if (Object.keys(dir).length==0){
			displayNoTopics();
			return 0;
		}

		for(var topicID in dir){
			newTopicDiv = createTopicButtons(topicID, dir[topicID]);
			buttonDiv.append(newTopicDiv);
		}
	}

	function displayNoTopics(){
		// Display a warning message to the user if there are no topics.
		var $buttonDiv = $('#button-div');
		var $message = $('<div/>')
			.addClass('alert')
			.addClass('alert-danger')
			.text('There are no topics to display. :(')
		$buttonDiv.append($message);
	}

	function createTopicButtons(id, topic){
		// Build the HTML for a group of buttons.
		// Return this HTML string to be used by createMenus.
		// id is the id or tag of the topic
		// topic is a JS object containing a title and a dictionary of subtopics
		var topicDiv = $('<div/>')
			.addClass('topic-div');
		var mainTopicButton = $('<button>')
			.addClass('btn btn-primary main-topic')
			.attr('id', id)
			.text(topic.title);
		var subtopicGroup = $('<div/>')
			.addClass('btn-group-vertical subtopic-group');
		for(var subID in topic.subtopics){
			var newButton = $('<button/>')
				.addClass('btn')
				.attr('id', subID)
				.text(topic.subtopics[subID].title);
				//Set button color
				if (topic.subtopics[subID].color === 'dark'){
					newButton.addClass('btn-primary');
				}
				else if(topic.subtopics[subID].color === 'red'){
					newButton.addClass('btn-danger');
				}
				else{
					newButton.addClass('btn-info');
				}
			subtopicGroup.append(newButton);

		}
		return topicDiv.append(mainTopicButton).append(subtopicGroup);
	}

	function loadDirectoryFile(dirName){
		//Load the JSON file named dirName
		// This directory file should contain a dictionary of topics, each of which should 
		// contain a dictionary of subtopics.

		//ajax request for the file
		var listRequest = $.ajax({
			url: dirName,
			dataType: "json",
		});  
		//The ajax request is asynchronous; the success function fills the deck once the request is complete
		//Watch out - the request will not succeed if the JSON file has any syntax errors.
		//Check all JSON files for errors (recommend using the utility at jsonformatter.curiousconcept.com).
		listRequest.success(function(json){
			directory = json;
			localStorage.setItem('russianDrillsDir', JSON.stringify(json));

			// Now that we have the directory, use it to build the HTML for the buttons.
			createMenus(json);


			// Set the button callback functions after the menus have been created.
			$('.main-topic').on('click', function(e) {
				mainButtonCallback(e);
			});
			
			$('.subtopic-group').hide();
			
			$('.subtopic-group').on('click', '.btn', function(e) {
				buttonCallback(e);
			});
		});

		listRequest.error(function(){
			console.log("Could not find JSON file at " + dirName);
		});
	}


	function setNewDirectory(newClass){
		//Change the directory that is being used. 
		function setClass(className){
			currentClass = newClass;
			localStorage.setItem('russianDrillsClass', className)
			$('#current-class').text(newClass);
		}

		if (currentClass===newClass){
			return
		}
 		switch(newClass) {
		    case 'RUSS 321':
		        currentDirectoryName = 'Russ321Directory.json';
		        setClass(newClass);
		        break;
		    case 'RUSS 322':
		        currentDirectoryName = 'Russ322Directory.json';
		        setClass(newClass);
		        break;
		}
		loadDirectoryFile('Directories/' + currentDirectoryName);
	}

	function getPageURL(ID, parentID){
		// Build the URL string for the page we are going to navigate to, and return it.
		var url = '/testing/drills.html?id='+ID;
		if (parentID){
			url += '&parent='+parentID;
		}
		return url;
	}


	///////// Callback Functions /////////

	function mainButtonCallback(event){
		// Open or close the dropdown buttons when a parent button is clicked on.
		var subGroup = $(event.target).closest('.topic-div').children('.subtopic-group');
		var isOpen = subGroup.is(':visible');
		$('.subtopic-group').each(function(){
			if ($(this).css('display') == 'inline-block'){
				$(this).slideUp(slideTime);
			}
		});
		if (!isOpen){
			subGroup.slideDown(slideTime);
		}

	}

	function buttonCallback(event){
		// Open the new page when a subtopic button is clicked
		var selectedID = event.target.id;
		var topicID = $(event.target).closest('.topic-div').children('.main-topic').attr('id');
		var url = getPageURL(selectedID, topicID);
		console.log(url);
		window.location.assign(url);
	}

	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

		//This code executes when anything is selected in the dropdown for 'Select Class'
		// Assumes there is only one dropdown on the page, which could be a problem
		// later, so this should probably be changed.
 
	    var $target = $( event.currentTarget );
	 	var newClass = $target.text()
	    $target.closest( '.btn-group' )
	        .find( '[data-bind="course-label"]' ).text( "Select Class: " + newClass )
	            .end()
	        	.children( '.dropdown-toggle' ).dropdown( 'toggle' );
	 	
	 	//Change the directory
	 	setNewDirectory(newClass);

	    return false;
	 
	});




	var slideTime = 300;
	var directory = {};
	var currentClass;
	var storedClass = localStorage.getItem('russianDrillsClass');
	console.log('stored class:');
	console.log(storedClass)
	if (storedClass){
		setNewDirectory(storedClass);
	}
	else{
		setNewDirectory('RUSS 321');
	}

});
