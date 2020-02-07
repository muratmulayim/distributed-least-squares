var Logger = (function () {
    var IS_LOGGING_ENABLED = true;

    var module = {
        id: "distributed-least-squares.webapp.code.Logger",

        log: function (id, msg) {
            if(IS_LOGGING_ENABLED) {
				var date = new Date();
				
				var hours = date.getHours();
				hours = (hours <= 9 ? "0" + hours: hours);
				
				var minutes = date.getMinutes();
				minutes = (minutes <= 9 ? "0" + minutes : minutes);
				
				var seconds = date.getSeconds();
				seconds = (seconds <= 9 ? "0" + seconds : seconds);
				
				var milliseconds = date.getMilliseconds();
				milliseconds = ((milliseconds <= 9) ? "00" + milliseconds : (milliseconds <= 99 ? "0" + milliseconds : milliseconds));
				
				var time = hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
                console.log(time + " - [ " + id + " ] -- " + msg);
            }
        },

        load: function () {
            if(IS_LOGGING_ENABLED){
				module.log(module.id, "load()");
			}
        }
    };

    return module;
}());
