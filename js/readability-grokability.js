var gdbg = function(s) {
    if(typeof console !== 'undefined') {
        console.log("Grokability: " + s);
    }
};

var grokability = {
	init: function(){
		grokability.abstractize($('div#readability-content > div').children().toArray());
		grokability.collapse();
	},
	abstractize: function(elements){
		var pre = Array(); 
		var abstrct = Array(); var body = Array();
		var post = Array();
		var idx = 0;
		//1. select "pre"
		while(idx < elements.length && !grokability.isAbstractStart(elements[idx])) idx++;
		
		if(idx < elements.length){
			
			//2a. select "abstract"
			abstrct.push(elements[idx]); idx++;
			if(idx < elements.length && grokability.isPlainTag(elements[idx])){
				abstrct.push(elements[idx]); idx++;
			}
			var startLevel = grokability.elementLevel(abstrct[0]);
			//2b. select "body"
			while(idx < elements.length && grokability.elementLevel(elements[idx]) > startLevel){
				body.push(elements[idx]);
				idx++;
			}
			gdbg("abstract:" + $(abstrct[0]).text() + "; body: " + body.length);
			
			if(body.length > 0){
				
				//wrap selected elements into grokability divs
				grokability.wrapElements(abstrct.concat(body), "<div class='grokabilitySection'/>");
				grokability.wrapElements(abstrct, "<div class='grokabilityAbstract'/>");
				grokability.wrapElements(body, "<div class='grokabilityBody'/>");
				
				//being recursive
				grokability.abstractize(body);
			}
			
			gdbg("abstract:" + $(abstrct[0]).text() + "; left: " + (elements.length-idx));
			
			if(idx < elements.length){
				//3. select "post"
				grokability.abstractize(elements.slice(idx, elements.length));
			}
		}
	},
	
	collapse: function(){
		$('.grokabilityBody').hide();
		$('.grokabilityAbstract').each(function(){
			var body = $(this).next();
            var words = body.text().split(/\s+/).length;
			var plnk = $('<p class="grokabilityCollapse"><a href="#">+</a> (' + body.children().length + ' more items, ' + words + ' words)</p>')
			$(this).after(plnk);
			plnk.find('a').click(function(){
				$(this).text($(this).text() == '+' ? '-' : '+');
				body.toggle();
				return false;
			});
		});
	},
	
	HEADERS: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
	PLAIN: ['P', 'UL', 'OL', 'DIV', 'PRE'],
	
	isAbstractStart: function(el){
		return grokability.arrayIndex(grokability.HEADERS, el.tagName) != null;
	},
	
	isPlainTag: function(el){
		return grokability.arrayIndex(grokability.PLAIN, el.tagName) != null;
	},
	
	elementLevel: function(el){
		return grokability.arrayIndex(grokability.HEADERS, el.tagName) || grokability.HEADERS.length;
	},
	
	wrapElements: function(array, what){
		jQuery(array).wrapAll(what);
	},
	
	arrayIndex: function(array, obj){
		for(var i = 0; i < array.length; ++i){
			if(array[i] == obj) return i;
		}
		return null;
	}
};

grokability.init();
