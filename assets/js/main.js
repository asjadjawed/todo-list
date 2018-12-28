"use strict";
var ulMainList = document.querySelector("ul");
var adder = document.querySelector("#taskAdder");
var show = document.querySelector("#addShow");
var removeFadeOut = function (el, speed) {
    var seconds = speed / 1000;
    el.style.transition = "opacity " + seconds + "s linear";
    el.style.opacity = "0";
    setTimeout(function () {
        var parent = el.parentNode;
        parent.removeChild(el);
    }, speed);
};
var pullUp = function (el, speed) {
    var seconds = speed / 1000;
    el.style.transition = "font-size " + seconds + "s linear";
    el.style.lineHeight = "0";
    el.style.fontSize = "0";
    setTimeout(function () {
        el.hidden = true;
    }, speed);
};
var pullDown = function (el, speed) {
    var seconds = speed / 1000;
    el.style.transition = "all " + seconds + "s linear";
    el.hidden = false;
    setTimeout(function () {
        el.style.fontSize = "2rem";
    }, speed * 0);
    setTimeout(function () {
        el.style.lineHeight = "3rem";
        adder.focus();
    }, speed);
    el.focus();
};
var MainList = /** @class */ (function () {
    function MainList() {
        this.content = [];
    }
    MainList.prototype.addTask = function (aTask) {
        var _this = this;
        var objThis = this;
        this.content.push(aTask);
        this.taskSave();
        if (aTask.done) {
            aTask.liCenter.classList.toggle("completed");
        }
        aTask.liInput.style.display = "none";
        aTask.liDelete.addEventListener("click", function () {
            removeFadeOut(aTask.liTask, 200);
            // const liParent = aTask.liTask.parentElement as HTMLUListElement;
            // liParent.removeChild(aTask.liTask);
            _this.content = _this.content.filter(function (t) { return t !== aTask; });
            _this.taskSave();
        });
        aTask.liInput.addEventListener("keypress", function (k) {
            if (k.key === "Enter") {
                aTask.text = this.value;
                aTask.liText.textContent = this.value;
                aTask.liInput.style.display = "none";
                aTask.liLeft.style.display = "inline-block";
                aTask.liCenter.style.display = "inline-block";
                objThis.taskSave();
            }
        });
        aTask.liEdit.addEventListener("click", function () {
            aTask.liInput.value = aTask.liText.textContent;
            aTask.liInput.style.display = "inline-block";
            aTask.liLeft.style.display = "none";
            aTask.liCenter.style.display = "none";
            aTask.liInput.focus();
        });
        aTask.liCenter.addEventListener("click", function () {
            this.classList.toggle("completed");
            aTask.done = !aTask.done;
            objThis.taskSave();
        });
        ulMainList.appendChild(aTask.liTask);
    };
    MainList.prototype.taskSave = function () {
        localStorage.setItem("content", JSON.stringify(this.content));
    };
    return MainList;
}());
// tslint:disable-next-line:max-classes-per-file
var Task = /** @class */ (function () {
    function Task(text, done) {
        if (done === void 0) { done = false; }
        this.text = text;
        this.done = done;
        this.text = text;
        this.liTask = document.createElement("li");
        this.liLeft = document.createElement("span");
        this.liLeft.classList.add("left");
        this.liDelete = document.createElement("span");
        this.liDelete.innerHTML = "<i class=\"far fa-trash-alt\"></i>";
        this.liDelete.classList.add("delete");
        this.liLeft.appendChild(this.liDelete);
        this.liEdit = document.createElement("span");
        this.liEdit.classList.add("edit");
        this.liEdit.innerHTML = "<i class=\"far fa-edit\"></i>";
        this.liLeft.appendChild(this.liEdit);
        this.liTask.appendChild(this.liLeft);
        this.liCenter = document.createElement("span");
        this.liCenter.classList.add("center");
        this.liText = document.createTextNode(this.text);
        this.liCenter.appendChild(this.liText);
        this.liTask.appendChild(this.liCenter);
        this.liInput = document.createElement("input");
        this.liInput.type = "text";
        this.liInput.classList.add("liInput");
        this.liTask.appendChild(this.liInput);
    }
    return Task;
}());
var mainList = new MainList();
if (!localStorage.getItem("content")) {
    mainList.taskSave();
}
if (mainList.content) {
    var data = localStorage.getItem("content");
    var loadedContent = JSON.parse(data);
    loadedContent.forEach(function (t) {
        mainList.addTask(new Task(t.text, t.done.valueOf()));
    });
}
adder.addEventListener("keypress", function (k) {
    if (k.key === "Enter" && adder.value !== "") {
        mainList.addTask(new Task(adder.value));
        adder.value = "";
    }
});
show.addEventListener("click", function () {
    adder.hidden ? pullDown(adder, 200) : pullUp(adder, 200);
});
adder.focus();
