(function () {
    var items = [
    ];

    var result;

    const inputField = document.querySelector('#todo');
    const doors = document.querySelectorAll(".door");
    const todos = document.querySelectorAll(".todo");
    document.querySelector(".go").addEventListener("click", go);
    document.querySelector(".spinner").addEventListener("click", spin);
    document.querySelector(".reseter").addEventListener("click", reset);

    async function spin() {
        if (items.length >= 1){
            init();
            init(false, 3, 2);
            const boxes = doors[0].querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            await new Promise((resolve) => setTimeout(resolve, duration * 100));
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 1000));
            document.querySelector('.remaining').textContent = "남은할일: " + items.join(', ');
            for (const element of todos){
                if (element.querySelector('h4').textContent == '???'){
                    element.querySelector('h4').textContent = result;
                    break;
                }
            }
        }
        else{
            alert('뽑을 할일이 없습니다~');
        }
    }

    function reset(){
        for (const element of todos){
            element.querySelector('h4').textContent = '???';
            go();
        }
    }

    function go() {
        items = inputField.value.split('\n- ');
        items[0] = items[0].replace('- ','');
        init();
    }

    function init(firstInit = true, groups = 2, duration = 1) {
        document.querySelector('.remaining').textContent = "남은할일: " + items.join(', ');
        const door = doors[0];
        if (firstInit) {
            door.dataset.spinned = "0";
        } else if (door.dataset.spinned === "1") {
            return;
        }

        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);

        const pool = ["❓"];
        if (!firstInit) {
            const arr = [];
            for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                arr.push(...items);
            }
            pool.push(...shuffle(arr));

            boxesClone.addEventListener(
                "transitionstart",
                function () {
                    door.dataset.spinned = "1";
                    this.querySelectorAll(".box").forEach((box) => {
                        box.style.filter = "blur(1px)";
                    });
                },
                { once: true }
            );

            boxesClone.addEventListener(
                "transitionend",
                function () {
                    this.querySelectorAll(".box").forEach((box, index) => {
                        box.style.filter = "blur(0)";
                        if (index > 0) this.removeChild(box);
                    });
                },
                { once: true }
            );
        }

        for (let i = pool.length - 1; i >= 0; i--) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.style.width = door.clientWidth + "px";
            box.style.height = door.clientHeight + "px";
            box.textContent = pool[i];
            boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)
            }px)`;
        console.log(`${duration > 0 ? duration : 1}s`);
        door.replaceChild(boxesClone, boxes);
        console.log(pool[pool.length-1]);
        result = pool[pool.length-1];
        const idx = items.indexOf(pool[pool.length-1])
        if (idx > -1) items.splice(idx, 1)
    }

    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }

    init();
})();
