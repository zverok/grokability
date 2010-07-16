$(document).ready(function(){
	$('.grokabilityBody').hide();
	$('.grokabilityAbstract').each(function(){
		var body = $(this).next(); //sibling('.grokabilityBody');
		var lnk = $('<a href="#">»</a>')
		$(this).after(lnk);
		lnk.click(function(){
			$(this).text($(this).text() == '»' ? '«' : '»');
			body.toggle();
			return false;
		});
	});
});
