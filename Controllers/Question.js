function createQuestion(type, questionInfo, instr){
	switch(type){
		case 'text':
			newQuestion = new BasicQuestion(questionInfo, instr);
			break;
		case 'radio':
			newQuestion = new RadioQuestion(questionInfo, instr);
			break;
		case 'text-inline':
			newQuestion = new InlineQuestion(questionInfo, instr);
			break;
	}
	return newQuestion;
}

//-----------------------------------------------------------------------------------------------//
/*
Methods of a Question prototype:
	render - display instructions, prompts, and answer entry fields
	calls:
		renderUpperDiv - instructions
		renderLowerDiv	- entry fields and prompt(s)
	checkUserAnswer - return what was entered, what is correct, and a score in the range [0,1]
	clearFields - clear all instructions and answer entry fields
	feedbackString - return a string indicating the correct answer
	focusInput - focus on the first input field
*/
function Question(){
	this.weight = 0.0; //Default
	this.level = 1;
}

Question.prototype.clearFields = function(){
	this.lowerDiv.empty();
	this.upperDiv.empty();
}
Question.prototype.focusInput = function(){
	//Places focus on the input field.
	$(".focus-input").focus();
}
Question.prototype.init = function(questionInfo, instr){
	//Basic single-answer question	
	this.prompt = questionInfo[0];
	this.answer = questionInfo[1];
	this.instructions = instr;
}
Question.prototype.feedbackString = function(){
	return(this.prompt + " &#8594; " + this.answer);
}
Question.prototype.upperDiv = $("#upper-question-div");
Question.prototype.lowerDiv = $("#lower-question-div");
Question.prototype.render = function(){
	this.clearFields();
	this.renderUpperDiv();
	this.renderLowerDiv();
}
Question.prototype.renderUpperDiv = function(){
	//Render the instructions
	$("#instructions").html("Instructions: <b>"+this.instructions+"</b>");
}
Question.prototype.renderLowerDiv = function(){
	
}

Question.prototype.checkUserAnswer = function(){
	return {
		'entered':'',
		'actual':'',
		'score':0
	};
}

//-------------------------Basic single-answer question-------------------------------//
function BasicQuestion(questionInfo, instr){
	this.init(questionInfo, instr);
}
BasicQuestion.prototype = new Question();
BasicQuestion.prototype.renderLowerDiv = function(){
	$prompt = $("<p />")
		.html("<b>"+this.prompt+"</b>");
	this.upperDiv.append($prompt);

	//Single text input field:
	this.$inputField =  $("<input/>")
		.attr("type","text")
		.addClass("answer-input")
		.addClass("focus-input");
	this.lowerDiv.append(this.$inputField);

	this.focusInput();	
}
BasicQuestion.prototype.checkUserAnswer = function(){
	var userAnswer = this.$inputField.val().toString();
	var actualAnswer = this.answer;
	var correct = (stringsEquivalent(userAnswer, actualAnswer));
	return {
		'entered':userAnswer,
		'actual':actualAnswer,
		'score':(correct?1:0)
	};
}


//--------------------------Radio button question-------------------------------//
function RadioQuestion(questionInfo, instr){
	this.init(questionInfo, instr);
}
RadioQuestion.prototype = new Question();
RadioQuestion.prototype.init = function(questionInfo, instr){
	this.instructions = instr;
	this.prompt = questionInfo.shift();;
	this.choices = questionInfo;
	this.answer = '';
	this.index = 0;
	for(var j=0; j<this.choices.length; j++){
		if (this.choices[j].substr(0,1)==='!'){
			this.index = j;
			this.answer = this.choices[j].substr(1);
			this.choices[j] = this.answer;
			break;
		}
	}
}
RadioQuestion.prototype.renderLowerDiv = function(){
	//Prompt:
	$prompt = $("<p />")
		.html("<b>"+this.prompt+"</b>");
	this.upperDiv.append($prompt);

	for(var i=0; i < this.choices.length; i++){ 
		this.lowerDiv.append(newRadioButton(this.choices[i]));	
	}
	$('#check-button').addClass('disabled');
	this.focusInput();
}
RadioQuestion.prototype.checkUserAnswer = function(){
	var userAnswer = $("input:checked + label").text();
	var actualAnswer = this.answer;
	var correct = (userAnswer===actualAnswer);
	return {
		'entered':userAnswer,
		'actual':actualAnswer,
		'score':(correct?1:0)
	};
}
function newRadioButton(str){
	var $newLabel = $("<label/>")
		.attr("for",str)
		.html(str);
	var $newRadioButton = $("<input/>")
		.attr("type","radio")
		.attr("name","answer-option")
		.attr("id",str);		
		if (i===0){
			$newRadioButton.addClass('focus-input');	
		}
	var $newRadioButtonDiv = $("<div/>")
		.addClass("answer-input")
		.append($newRadioButton)
		.append($newLabel);
	return $newRadioButtonDiv;
}

//--------------------------Inline prompt question-------------------------------//
function InlineQuestion(questionInfo, instr){
	
	this.init(questionInfo, instr);
	
}
InlineQuestion.prototype = new Question();
InlineQuestion.prototype.init = function(questionInfo, instr){
	this.instructions = instr;
	this.prompt = questionInfo.shift();;
	this.answers = questionInfo;
	console.log(this.answers);
}
InlineQuestion.prototype.renderLowerDiv = function(){
	this.inputFields = []; //Store references to the input fields so we can check them later.
	//Prompt:
	var $prompt = $("<p />");
	var sep = '*';
	var promptParts = this.prompt.split(sep);
	if (promptParts[0] === ''){
		this.inputFields.push(newInlineInput(0));
		$prompt = $prompt.append(inputFields[0]);
	}
	for (var i=0; i<promptParts.length; i++){
		$prompt = $prompt.append(promptParts[i]);
		if (this.inputFields.length < this.answers.length){
			this.inputFields.push(newInlineInput(i));
			$prompt = $prompt.append(this.inputFields[i]);
		}
	}
	this.lowerDiv.append($prompt);

	this.focusInput();	
}

InlineQuestion.prototype.checkUserAnswer = function(){
	var perAnswer = 1.0/this.answers.length;
	var score = 0;
	var userAll = [];
	for(var i=0; i<this.answers.length;i++){
		var userAnswer = this.inputFields[i].val().toString();
		var actualAnswer = this.answers[i];
		userAll.push(userAnswer);
		var correct = (stringsEquivalent(userAnswer, actualAnswer));
		if(correct){
			score += perAnswer;
		}
	}
	userAll = userAll.join(', ');
	var actualAll = this.answers.join(', ');
	return {
		'entered':userAll,
		'actual':actualAll,
		'score':(score)
	};
}

InlineQuestion.prototype.feedbackString = function(){
	return(this.prompt + " &#8594; " + this.answers.join(", "));
}

var newInlineInput = function(n){
	var $newInput = $("<input/>")
		.attr("type","text")
		.addClass("answer-input")
		.addClass("inline-input")
		.attr('id', n.toString());
	if (n === 0){
		$newInput = $newInput.addClass("focus-input");
	}
	return $newInput;
}

var stringsEquivalent = function(str1, str2){
	/*
	Function returns true if two strings are equivalent.
	Ignores capitalization, trailing whitespace.
	TODO: Make е and ё count as equivalent in some cases.
	*/

	return ($.trim(str1.toLowerCase()) === $.trim(str2.toLowerCase()));

}



