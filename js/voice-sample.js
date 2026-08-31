const sampleItems = document.querySelectorAll(".sample-item");

let currentAudio = null;
let currentItem = null;
let animationId = null;

sampleItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const audioPath = item.dataset.audio;

        // 同じボックスをクリック
        if (currentItem === item && currentAudio) {

            if (currentAudio.paused) {

                currentAudio.play();
                item.classList.add("playing");

                startSpectrum(item);

            } else {

                currentAudio.pause();
                item.classList.remove("playing");

                cancelAnimationFrame(animationId);

            }

            return;
        }


        // 前の音声を停止
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }


        // 前のボックスを解除
        if (currentItem) {

            currentItem.classList.remove("playing");

            const oldCanvas =
                currentItem.querySelector(".spectrum");

            const oldCtx =
                oldCanvas.getContext("2d");

            oldCtx.clearRect(
                0,
                0,
                oldCanvas.width,
                oldCanvas.height
            );
        }


        if (animationId) {
            cancelAnimationFrame(animationId);
        }


        // 新しい音声
        currentAudio = new Audio(audioPath);
        currentItem = item;


        currentAudio.play()
            .then(function () {

                item.classList.add("playing");

                startSpectrum(item);

            })
            .catch(function (error) {

                console.log("再生エラー:", error);

            });


        // 再生終了
        currentAudio.addEventListener("ended", function () {

            item.classList.remove("playing");

            cancelAnimationFrame(animationId);


            const canvas =
                item.querySelector(".spectrum");

            const ctx =
                canvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            currentAudio = null;
            currentItem = null;

        });

    });

});


function startSpectrum(item) {

    const canvas = item.querySelector(".spectrum");
    const ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 100;

    const barWidth = 8;
    const gap = 12;

    // 線の本数
    const barCount = 15;

    const centerY = canvas.height / 2;

    let time = 0;

    // 線ごとにランダムな設定を作る
    const bars = [];

    for (let i = 0; i < barCount; i++) {

        bars.push({
            height: Math.random() * 20 + 8,
            speed: Math.random() * 0.8 + 0.4,
            offset: Math.random() * Math.PI * 2
        });

    }


    function draw() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        for (let i = 0; i < barCount; i++) {

            const bar = bars[i];


            // 線ごとに不規則な高さ
            const barHeight =
                8 +
                Math.abs(
                    Math.sin(
                        time * bar.speed + bar.offset
                    )
                ) * bar.height;


            const x =
                i * (barWidth + gap) + 5;


            ctx.fillStyle = "#ffffff";


            // 上
            ctx.fillRect(
                x,
                centerY,
                barWidth,
                -barHeight
            );


            // 下
            ctx.fillRect(
                x,
                centerY,
                barWidth,
                barHeight
            );

        }


        // 全体の動く速さ
        time += 0.06;


        animationId =
            requestAnimationFrame(draw);

    }


    draw();
}