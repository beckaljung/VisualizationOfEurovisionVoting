 /*------------------------------------------------------
      The slider - source from: https://codepen.io/MinzCode/pen/MWKgyqb
 ------------------------------------------------------*/

function slider (){
    // Declare the variables
    var inputLeft = document.getElementById("input-left");
    var inputRight = document.getElementById("input-right"); 
    var thumbLeft = document.querySelector(".slider > .thumb.left");
    var thumbRight = document.querySelector(".slider > .thumb.right");
    var range = document.querySelector(".slider > .range");
    var rightVal = 0;
    var leftVal= 0;
          
    // Set the left value
    function setLeftValue() {
        var _this = inputLeft,min = parseInt(_this.min), max = parseInt(_this.max);
        _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
        var percent = ((_this.value - min) / (max - min)) * 100;
        thumbLeft.style.left = percent + "%";
        range.style.left = percent + "%";
        setValues(rightVal, _this.value);
        updateSlider();       
    }
    setLeftValue();
             
    // Set the right value
    function setRightValue() {
        var _this = inputRight,
        min = parseInt(_this.min), max = parseInt(_this.max);
        _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
        var percent = ((_this.value - min) / (max - min)) * 100;
        thumbRight.style.right = (100 - percent) + "%";
        range.style.right = (100 - percent) + "%";
        setValues(_this.value, leftVal);
        updateSlider();            
    }
    setRightValue();
                
    // Event listeners
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);
    inputLeft.addEventListener("mousedown", function() {
        thumbLeft.classList.add("active");
    });
    inputLeft.addEventListener("mouseup", function() {
        thumbLeft.classList.remove("active");
    });   
    inputRight.addEventListener("mousedown", function() {
        thumbRight.classList.add("active");
    });
    inputRight.addEventListener("mouseup", function() {
        thumbRight.classList.remove("active");
    });

    // Set the values
    function setValues(right, left){
        leftVal =left;
        rightVal =right;
    };

    // Get the yearspan to the map and the graph
    this.getValYear = function(){
        return [ leftVal, rightVal];
    };

    // Update the map and the graph when the slider changes
    function updateSlider(){
        map.sliderUpdate();
        
    }

};