var progressBar = new ProgressBarController();

function ProgressBarController(){
	var correctBar = $("#correct-bar.progress-bar");
	var incorrectBar = $("#incorrect-bar.progress-bar");
	var minWidth = 3;

	this.update = function(percentCorrect, percentIncorrect){
		if ((percentCorrect + percentIncorrect) > 3){
			correctBar.css("min-width","0%");
		}
		else{
			correctBar.css("min-width", minWidth.toString() +"%");
		}
		//document.getElementById("correct-bar").style.width = percentCorrect +'%';
		//document.getElementById("incorrect-bar").style.width = percentIncorrect +'%';
		correctBar.css("width",percentCorrect +'%');
		incorrectBar.css("width",percentIncorrect +'%');
	}

}
