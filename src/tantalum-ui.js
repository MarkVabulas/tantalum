(function(exports) {
    function stripClass(node, className) {
        node.className = node.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
    }
    function addClass(node, className) {
        if (node.className.indexOf(className) == -1)
            node.className += " " + className;
    }

    exports.ProgressBar = function(targetId) {
        var target = document.getElementById(targetId);
        if (!target)
            return;
            
        var progressBackground = document.createElement("div");
        progressBackground.className = "progress";
        
        this.progressBar = document.createElement("div");
        this.progressBar.className = "progress-bar";
        progressBackground.appendChild(this.progressBar);
        
        this.setProgress(0.0);
        
        var parent = target.parentNode;
        parent.replaceChild(progressBackground, target);
    }
    
    exports.ProgressBar.prototype.getProgress = function() {
        return this.progressFraction;
    }

    exports.ProgressBar.prototype.setProgress = function(progressFraction) {
        this.progressFraction = progressFraction;
        this.progressPercentage = Math.min(Math.max(Math.floor(progressFraction*100.0), 0), 100);
        this.progressBar.style.width = this.progressPercentage.toString() + "%";
    }
    
    exports.ProgressBar.prototype.setProgressWithoutTransition = function(progressFraction) {
        addClass(this.progressBar, "notransition");
        this.setProgress(progressFraction);
        this.progressBar.offsetHeight; /* Flush CSS changes */
        stripClass(this.progressBar, "notransition");
    }

    exports.ProgressBar.prototype.getProgressPercentage = function() {
        return this.progressPercentage;
    }

    exports.MouseListener = function(target, callback) {
        this.target = target;
        this.callback = callback;
        this.mouseUpHandler = this.mouseUp.bind(this);
        this.mouseMoveHandler = this.mouseMove.bind(this);
        
        target.addEventListener('mousedown', this.mouseDown.bind(this));
    }

    exports.MouseListener.prototype.mouseDown = function(evt) {
        evt.preventDefault();
        this.mouseStart = this.mapMouseEvent(evt);
        this.callback(this.mouseStart, this.mouseStart);
        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
    }

    exports.MouseListener.prototype.mouseUp = function(evt) {
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('mousemove', this.mouseMoveHandler);
    }

    exports.MouseListener.prototype.mouseMove = function(evt) {
        this.callback(this.mouseStart, this.mapMouseEvent(evt));
    }

    exports.MouseListener.prototype.mapMouseEvent = function(evt) { 
        var rect = this.target.getBoundingClientRect();
        return [evt.clientX - rect.left, evt.clientY - rect.top];
    }
})(window.tui = window.tui || {});