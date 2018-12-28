const ulMainList = document.querySelector("ul") as HTMLUListElement;
const adder = document.querySelector("#taskAdder") as HTMLInputElement;
const show = document.querySelector("#addShow") as HTMLSpanElement;

let removeFadeOut = (el: HTMLElement, speed: number) => {
  const seconds = speed / 1000;
  el.style.transition = `opacity ${seconds}s linear`;
  el.style.opacity = "0";

  setTimeout(() => {
    const parent = el.parentNode as HTMLElement;
    parent.removeChild(el);

  }, speed);
};

let pullUp = (el: HTMLElement, speed: number) => {
  const seconds = speed / 1000;
  el.style.transition = `font-size ${seconds}s linear`;
  el.style.lineHeight = "0";
  el.style.fontSize = "0";

  setTimeout(() => {
    el.hidden = true;
  }, speed);
};

let pullDown = (el: HTMLElement, speed: number) => {
  const seconds = speed / 1000;
  el.style.transition = `all ${seconds}s linear`;
  el.hidden = false;
  setTimeout(() => {
    el.style.fontSize = "2rem";
  }, speed * 0);
  setTimeout(() => {
    el.style.lineHeight = "3rem";
    adder.focus();
  }, speed);
  el.focus();
};

class MainList {
  public content: Task[] = [];

  public addTask(aTask: Task) {
    const objThis = this;
    this.content.push(aTask);
    this.taskSave();

    if (aTask.done) {
      aTask.liCenter.classList.toggle("completed");
    }

    aTask.liInput.style.display = "none";

    aTask.liDelete.addEventListener("click", () => {
      removeFadeOut(aTask.liTask, 200);
      // const liParent = aTask.liTask.parentElement as HTMLUListElement;
      // liParent.removeChild(aTask.liTask);
      this.content = this.content.filter((t) => t !== aTask);
      this.taskSave();
    });

    aTask.liInput.addEventListener("keypress", function(k) {
      if (k.key === "Enter") {
        aTask.text = this.value;
        aTask.liText.textContent = this.value;
        aTask.liInput.style.display = "none";
        aTask.liLeft.style.display = "inline-block";
        aTask.liCenter.style.display = "inline-block";
        objThis.taskSave();
      }
    });

    aTask.liEdit.addEventListener("click", () => {
      aTask.liInput.value = aTask.liText.textContent as string;
      aTask.liInput.style.display = "inline-block";
      aTask.liLeft.style.display = "none";
      aTask.liCenter.style.display = "none";
      aTask.liInput.focus();
    });

    aTask.liCenter.addEventListener("click", function() {
      this.classList.toggle("completed");
      aTask.done = !aTask.done;
      objThis.taskSave();
    });

    ulMainList.appendChild(aTask.liTask);
  }

  public taskSave() {
    localStorage.setItem("content", JSON.stringify(this.content));
  }
}

// tslint:disable-next-line:max-classes-per-file
class Task {
  public liText: Text;
  public liTask: HTMLLIElement;
  public liCenter: HTMLSpanElement;
  public liInput: HTMLInputElement;
  public liDelete: HTMLSpanElement;
  public liEdit: HTMLSpanElement;
  public liLeft: HTMLSpanElement;

  constructor(public text: string, public done: boolean = false) {
    this.text = text;

    this.liTask = document.createElement("li");

    this.liLeft = document.createElement("span");
    this.liLeft.classList.add("left");

    this.liDelete = document.createElement("span");
    this.liDelete.innerHTML = `<i class="far fa-trash-alt"></i>`;
    this.liDelete.classList.add("delete");
    this.liLeft.appendChild(this.liDelete);

    this.liEdit = document.createElement("span");
    this.liEdit.classList.add("edit");
    this.liEdit.innerHTML = `<i class="far fa-edit"></i>`;
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
}

const mainList = new MainList();
if (!localStorage.getItem("content")) {
  mainList.taskSave();
}

if (mainList.content) {
  const data = localStorage.getItem("content") as string;
  const loadedContent = JSON.parse(data) as Task[];
  loadedContent.forEach((t) => {
    mainList.addTask(new Task(t.text, t.done.valueOf()));
  });
}

adder.addEventListener("keypress", (k) => {
  if (k.key === "Enter" && adder.value !== "") {
    mainList.addTask(new Task(adder.value));
    adder.value = "";
  }
});

show.addEventListener("click", () => {
  adder.hidden ? pullDown(adder, 200) : pullUp(adder, 200);
});

adder.focus();
