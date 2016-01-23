var mobileNav = document.getElementsByClassName('mobile')[0]; 
mobileNav.addEventListener('touchstart', handleTouchStart, false);        
mobileNav.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            controlCube.moveLeft();
        } else {
            /* right swipe */
            controlCube.moveRight();
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            controlCube.moveUp();
        } else { 
            /* down swipe */
            controlCube.moveDown();
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};