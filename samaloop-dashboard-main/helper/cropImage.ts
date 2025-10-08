import { Area } from 'react-easy-crop';

export default function getCroppedImg(imageSrc: string, crop: Area): Promise<any> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Failed to get 2D context'));
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    return reject(new Error('Canvas is empty'));
                }
                resolve({
                    url: URL.createObjectURL(blob),
                    blob: blob
                });
            }, 'image/jpeg');
        };

        image.onerror = reject;
    });
}
