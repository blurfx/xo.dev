$(function(){  
$normal = $('.bg-normal');
$blur = $('.bg-blur');
$(window).on('scroll', function() {
   $st = $(this).scrollTop();
   if((0 + $st/150) > 1) $blur.css({ 'opacity' : 1 });
   else {
   $blur.css({ 'opacity' : (0 + $st/150) });
}
});});
