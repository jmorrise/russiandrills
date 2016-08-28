var answerFade = new AnswerFadeController();

function AnswerFadeController(){
	var answerDiv = $("#correct-fadeout");

	this.showAnswer = function(answer, userCorrect){
		if(userCorrect){
			answerDiv.addClass('green').removeClass('red');
		}
		else{
			answerDiv.addClass('red').removeClass('green');
		}
		answerDiv.html("<span id='answer'>"+answer+"</span>");
		fadeAnswer(8000);
	}


	function fadeAnswer(ms){
		var divHeight = answerDiv.height();
		answerDiv.css("min-height", divHeight); //Set the min height so the div doesn't shrink after fadeout
		$("#answer").fadeOut(ms);
	}
	
}
