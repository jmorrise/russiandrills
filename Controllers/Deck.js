var currentDeck = new Deck();

function Deck(){
	var that = this;
	var questions = new Array;
	var currentIndex = 0;
	var scored = {
		missedQuestions: new Array,
		correctQuestions: new Array
	} //Might want this functionality later
	var numTested = 0;

	this.fillDeckOld = function(json){
		//Accept a JSON object
		//Split the JSON into individual question objects, and add them to an array.
		var type = json.input_type;
		var promptList = json.prompts;
		var answerList = json.answers;
		var instructions = json.instructions;
		for (j=0; j<promptList.length; j++){
			//Create a new question with a prompt, matching answer, instruction, and level
			var w = calcQuestionWeight(j);
			var newCard = new Card(promptList[j], answerList[j], instructions, 0, w, type);
			//Add question to deck
			questions.push(newCard);
		}
		
	}

	this.fillDeck = function(json){
		//Accept a JSON object
		//Split the JSON into individual question objects, and add them to an array.
		var type = json.input_type;
		var questionList = json.questions;
		var instructions = json.instructions;
		for (var j=0; j<questionList.length; j++){
			newQuestion = createQuestion(type,questionList[j], instructions);
			newQuestion.weight = calcQuestionWeight(j);
			questions.push(newQuestion);
		}
	}
	
	function calcQuestionWeight(level){
		var w =  Math.random();
		if (w < 0){w = 0;}
		return w;
	}

	this.size = function(){
		return questions.length;
	}

	this.setForNewRound = function(){
		this.reshuffle();
		scored.missedQuestions.length = 0;
		scored.correctQuestions.length = 0;
		currentIndex = 0;
	}

	this.draw = function(){
		//Returns the question on the top of the working deck, and removes it from the working deck.
		//If working deck is empty, returns a random question from the array of all questions.
		len =  questions.length;
		if (len > 0){
			var index = Math.floor(Math.random() * len/4);
			//return questions[index];
			return questions[currentIndex];
		}
		else{
			console.log("Empty deck.");		
			return null;
		}
	}

	this.update = function(wasCorrect){
		numTested += 1;
		var len = this.size();
		if(wasCorrect){
			questions[currentIndex].weight = 1.0;
			scored.correctQuestions.push(questions[currentIndex]);
		}
		else{
			questions[currentIndex].weight = Math.random()*0.5;
			scored.missedQuestions.push(questions[currentIndex]);
		}
		if (currentIndex < len-1){
			currentIndex += 1;
		}
		else{
			//Loop back through deck		
			this.reshuffle();
			currentIndex = 0;
		}
	}

	this.reshuffle = function(){
		var len = this.size();
		var step = calculateStep();
		for(i=0;i<len;i++){
			questions[i].weight -= (step + (Math.random()-0.5)*0.2);
			if (questions[i].weight < 0){
				questions[i].weight = 0;
			}
		}
		questions = questions.sort(sortQuestions);
	}

	function calculateStep(){
		return (scored.correctQuestions.length)/questions.length;
	}

	this.toString = function(){
		string = "Deck: ";
		for(i=0; i<this.size(); i++){
			string = string + '\n' + questions[i].prompt + ': ' + questions[i].weight.toFixed(3);
		}
		return string;
	}

	var sortQuestions = function(question1, question2){
		return question1.weight - question2.weight;
	}

}

