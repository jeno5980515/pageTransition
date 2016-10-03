(function(){
	var self = {} ;

	var list = [] ;
	var mapList = [] ; //get page now index
	var nowIndex = 0 ;
	var width , height ;
	var newIndex = 0 ;
	var isTran = false ;

	var PageTransition = function(el){
		this.init(el);
	}

	PageTransition.prototype.init = function(el){
		document.getElementById('container').style.overflow = "hidden" ;
		//document.getElementById('container').style.transformStyle = "preserve-3d";
		list = document.getElementById('container').querySelectorAll(".page") ;
		for ( var i = 0 ; i < list.length ; i ++ ){
			mapList.push(i) ;
		}
		width = document.getElementById('container').clientWidth ;
		height = document.getElementById('container').clientHeight ;
		for ( var i = 0 ; i < list.length ; i ++ ){
			list[i].style.width = width + "px" ;
			list[i].style.height = height + "px" ;
			list[i].style.display = "none" ;
		}
		list[0].style.display = "" ;
	}

	var addAnimation = function(f){
		window.setTimeout(f, 30);
	}

	var swapElements = function(elm1, elm2) {
	    var parent1, next1,
	        parent2, next2;

	    parent1 = elm1.parentNode;
	    next1   = elm1.nextSibling;
	    parent2 = elm2.parentNode;
	    next2   = elm2.nextSibling;

	    parent1.insertBefore(elm2, next1);
	    parent2.insertBefore(elm1, next2);
	}

	var reorderList = function(){
		swapElements(document.getElementById('container').querySelectorAll(".page")[nowIndex],document.getElementById('container').querySelectorAll(".page")[newIndex]);
		list = document.getElementById('container').querySelectorAll(".page") ;
		var temp = mapList[nowIndex] ;
		mapList[nowIndex] = mapList[newIndex] ;
		mapList[newIndex] = temp ;
		temp = nowIndex ;
		nowIndex = newIndex ;
		newIndex = temp ;
	}

	var endFunction = function(){
    	list[nowIndex].style.display = "none" ;
   		list[newIndex].style.transition = list[newIndex].style.webkitTransition = list[nowIndex].style.transition = list[nowIndex].style.webkitTransition = "" ;
    	list[newIndex].style.transform = list[newIndex].style.webkitTransform = list[nowIndex].style.transform = list[nowIndex].style.webkitTransform = "" ;
	    list[newIndex].removeEventListener("webkitTransitionEnd", endFunction);
		list[newIndex].removeEventListener("transitionend", endFunction);
	    list[nowIndex].removeEventListener("webkitTransitionEnd", endFunction);
		list[nowIndex].removeEventListener("transitionend", endFunction);
    	nowIndex = newIndex ;
    	isTran = false ;

	}

	var addEndFunction = function(){
	    list[newIndex].addEventListener("webkitTransitionEnd", endFunction);
		list[newIndex].addEventListener("transitionend", endFunction);
	    list[nowIndex].addEventListener("webkitTransitionEnd", endFunction);
		list[nowIndex].addEventListener("transitionend", endFunction);
	}

	PageTransition.prototype.changePage = function(data,callback){
		if ( isTran ){
			return ;
		} 
		isTran = true ;
		newIndex = mapList.indexOf(data.page) ;
		if ( nowIndex === newIndex ){
			console.log("same index") ;
			return ;
		} else if ( nowIndex === -1 ){
			console.log("index error") ;
			return ;
		}
		var type = data.type ;
		list[newIndex].style.display = "" ;
		switch(type) {
		    case "moveInUpLinear":
				if ( newIndex < nowIndex ){
					reorderList() ;
				}
		    	addAnimation(function(){
				   	list[newIndex].style.transition = list[newIndex].style.webkitTransition = "all 0.5s linear" ;
				    list[newIndex].style.transform = list[newIndex].style.webkitTransform = "translate(0px,-"+height+"px)" ;
					addEndFunction();
		    	})
		        break;
		    case "moveOutDownLinear":
		    	if ( newIndex > nowIndex ){
					reorderList() ;
				}
				list[nowIndex].style.transform = list[nowIndex].style.webkitTransform = "translate(0px,-"+height+"px)" ;
		    	addAnimation(function(){
				   	list[nowIndex].style.transition = list[nowIndex].style.webkitTransition = "all 0.5s linear" ;
				    list[nowIndex].style.transform = list[nowIndex].style.webkitTransform = "translate(0px,0px)" ;
				    addEndFunction();
		    	})
		        break;
		   	case "moveInLeftLinear":
				if ( newIndex < nowIndex ){
					reorderList() ;
				}
				list[newIndex].style.transform = list[newIndex].style.webkitTransform = "translate("+width+"px,-"+height+"px)" ;
		    	addAnimation(function(){
				   	list[newIndex].style.transition = list[newIndex].style.webkitTransition = "all 0.5s linear" ;
				    list[newIndex].style.transform = list[newIndex].style.webkitTransform = "translate(0px,-"+height+"px)" ;
					addEndFunction();
		    	})
		        break;
		    case "moveOutLeftLinear":
		    	if ( newIndex > nowIndex ){
					reorderList() ;
				}
				list[nowIndex].style.transform = list[nowIndex].style.webkitTransform = "translate(0,-"+height+"px)" ;
		    	addAnimation(function(){
				   	list[nowIndex].style.transition = list[nowIndex].style.webkitTransition = "all 0.5s linear" ;
				    list[nowIndex].style.transform = list[nowIndex].style.webkitTransform = "translate("+width+"px,-"+height+"px)" ;
				    addEndFunction();
		    	})
		        break;
		    default:
		        console.log("error type");
		}
		callback();
	}

	window.PageTransition = PageTransition ;
})();
