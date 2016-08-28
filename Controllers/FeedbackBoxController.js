var feedbackBox = new FeedbackBoxController();

function FeedbackBoxController(){

	var self = $("#feedback");
	var correctListDiv = $("#list-correct");
	var missedListDiv = $("#list-missed");
	var title = {
		num: $(".modal-title").children("#feedback-num"),
		total: $(".modal-title").children("#feedback-total"),
		percent: $(".modal-title").children("#feedback-percent")
	}
	var active = false;
	this.continueButton = $("#feedback-continue-button");
	this.newButton = $("#feedback-new-button");
	this.closeButton = $("#feedback-close");
	var missedList = [];
	var correctList = [];
	var totalScore = 0;
	var totalOutOf = 0;

	this.numMissed = function(){
		return missedList.length;
	}

	this.numCorrect = function(){
		return correctList.length;
	}

	this.numTested = function(){
		return missedList.length + correctList.length;
	}

	this.update = function(string, score){
		if (score===1){
			correctList.push(string);
		}
		else{
			missedList.push(string);
		}
		totalScore += score;
		totalOutOf += 1;
	}

	this.setup = function() {
		var percent = totalScore*100.0/totalOutOf;
		title.num.text(totalScore);
		title.total.text(totalOutOf);
		title.percent.text(percent.toFixed(1));
		
		if (percent==100){
			var quote = quoteGenerator.randomQuote();
			missedListDiv.html(quote);
		}
		else{
			var missedUL = formatBulletList(missedList);
			missedListDiv.html(missedUL);
		}
		var correctUL = formatBulletList(correctList);	
		correctListDiv.html(correctUL);
	}


	this.show = function(){
		self.modal({
			show: true,
			backdrop: 'static'
		});
		active = true;
	}
	
	this.getState = function(){
		return active;
	}
	
	this.setState = function(state){
		active = state;
	}

	this.canContinue = function(yes){
		if(yes){
			this.continueButton.removeClass('hidden');
			this.closeButton.disabled = false;

		}
		else{
			this.continueButton.addClass('hidden');
			this.closeButton.disabled = true;
		}
	}

	function formatBulletList(stringList){
		var listHTML = "<ul>";
		$.each(stringList, function(i){
			listHTML += "<li>"+stringList[i]+"</li>";
		});
		listHTML += "</ul>";
		return listHTML;
	}

	this.reset = function(){
		missedList = [];
		correctList = [];
		totalScore = 0;
		totalOutOf = 0;
	}

}

var quoteGenerator = new QuoteGenerator();

function QuoteGenerator(){
	
	var quotes = [""];
		
	var request = $.ajax({
		url: "/testing/quotes.json",
		dataType: "json",
	});  
	//Watch out - the request will not succeed if the JSON file has any syntax errors.
	//Check all JSON files for errors.
	request.success(function(json){
		console.log("Got the quotes");
		quotes = json.quotes;
	});
	request.error(function(){
		console.log("Could not find JSON file of quotes");
	});

	this.randomQuote = function(){
		var idx = Math.floor(Math.random()*quotes.length);
		return('<b>Молодец! </b>' + quotes[idx]);
	}
}
