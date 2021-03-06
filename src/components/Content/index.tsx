import { useEffect, useState } from 'react';

const Content = () => {
    const [img, setImg] = useState<null | any>(null);
    const [canvas, setCanvas] = useState<null | any>(null);
    const [canvasSize, setCanvasSize] = useState<null | [number, number]>(null);
    const [fontSize, setFontSize] = useState<null | number>(null);
    const [loaded, setLoaded] = useState(false);
    const [shinjiroNumber, setShinjiroNumber] = useState('４６');

    const handleNumberChange = (event: { target: { value: any } }) => {
        const toFullWidth = (value: string) => {
            if (!value) return value;
            return String(value).replace(/[!-~]/g, function (all) {
                return String.fromCharCode(all.charCodeAt(0) + 0xfee0);
            });
        };
        const num = toFullWidth(event.target.value);
        setShinjiroNumber(num);
    };

    const handleDownload = (e: any) => {
        if (canvas !== null) {
            const base64 = canvas.toDataURL('image/png');
            const a = e.target;
            a.href = base64;
            a.download = new Date().getTime() + '.png';
        }
    };

    useEffect(() => {
        const canvas: any = document.getElementById('generator-canvas');
        if (canvas === null) {
            console.log('canvas is null');
            return;
        }
        const img = new Image();
        setImg(img);
        setCanvas(canvas);
        if (window.location.host === 'localhost:3000')
            img.src = 'shinjiro-number-generator/shinjiro.png';
        else img.src = 'shinjiro.png';
        img.onload = () => {
            const windowWidth = document.body.clientWidth;
            const imgWidth = img.width;
            let width = img.width;
            let height = img.height;
            let fontSize = 35;

            if (windowWidth < imgWidth) {
                console.log(windowWidth, imgWidth);
                const scale = 0.95;
                width = windowWidth * scale;
                height = img.height * (windowWidth / imgWidth) * scale;
                fontSize = fontSize * (windowWidth / imgWidth) * scale;
            }

            canvas.width = width;
            canvas.height = height;
            setCanvasSize([width, height]);
            setFontSize(fontSize);
            setLoaded(true);
        };
    }, []);
    useEffect(() => {
        const getCanvasContext = (fontsize: number, color: string) => {
            const ctx = canvas.getContext('2d');
            ctx.font = `bold ${fontsize}px serif`;
            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.fillStyle = color;
            ctx.textBaseline = 'center';
            ctx.textAlign = 'left';
            return ctx;
        };
        const drawText = (shinjiroNumber: string) => {
            const line1 = 'おぼろげながら浮かんできたんです';
            const line2 = `という数字が`;
            if (
                img !== null &&
                canvas !== null &&
                canvasSize !== null &&
                fontSize !== null
            ) {
                const ctx = getCanvasContext(fontSize, '#e5e5e5');
                const x1 = (canvas.width / 100) * 20;
                const y1 = (canvas.height / 100) * 88;
                const x2 = (canvas.width / 100) * 20;
                const y2 = (canvas.height / 100) * 95;

                ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    canvasSize[0],
                    canvasSize[1]
                );
                ctx.fillText(line1, x1, y1);
                ctx.fillText(line2, x2 + fontSize * shinjiroNumber.length, y2);
                ctx.fillStyle = '#C77552';
                ctx.fillText(shinjiroNumber, x2, y2);

                const targetImg: any = document.getElementById('shinjiro-img');
                targetImg.src = canvas.toDataURL('image/png');
                targetImg.width = canvas.width;
                targetImg.height = canvas.height;
            }
        };
        if (loaded) {
            drawText(shinjiroNumber);
        }
    }, [loaded, shinjiroNumber, canvas, img, canvasSize, fontSize]);

    return (
        <div className="">
            <canvas id="generator-canvas" className="hidden"></canvas>
            <img id="shinjiro-img" className="" alt="進次郎の画像" />
            <input
                placeholder="数字を入力してね"
                className="w-full text-center p-10 focus:outline-none"
                onChange={handleNumberChange}
            ></input>
            <div className="w-full flex justify-center p-8">
                <a
                    href="/"
                    className="cursor-pointer inline-block text-sm px-20 py-6 leading-none border rounded text-accentsub border-accentsub hover:border-accentsubhov hover:text-accentsubhov mt-4 lg:mt-0"
                    onClick={handleDownload}
                    download=""
                >
                    画像をダウンロード
                </a>
            </div>
        </div>
    );
};

export default Content;
