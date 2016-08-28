var breadcrumbs = new BreadcrumbsController();

function BreadcrumbsController(){
	var crumbs = $(".breadcrumb");
	
	this.setCrumbs = function(array){
		crumbs.empty();
		crumbs.append($("<li/>").html('<a href="index.html">BYU Russian Drills</a>'));
		array = [].concat(array);
		n = array.length;
		for(var i = 0; i < n; i++){
			var $listItem = $("<li/>")
				.text(array[i]);
			if (i === 0){
				$listItem.addClass("active");
			}
			crumbs.append($listItem);
		}
	}

}

