function TutorialController(key){

    this.constructor = function(key){
        /* Event Listener */
        let self = this;
        document.getElementById("tutorial__button").addEventListener('click', function (e) {
            localStorage.setItem(key, "true");
            self.hide();
        });
    };
    this.hide = function(){
        document.getElementsByClassName("tutorial")[0].style.display = "none";
    };
    this.show = function(){
        document.getElementsByClassName("tutorial")[0].style.display = "block";
    };
    this.constructor(key);
}