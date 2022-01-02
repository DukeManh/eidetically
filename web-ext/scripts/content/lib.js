function validateUrl(url) {
  try {
    const newUrl = new URL(url);
    if (newUrl.protocol !== 'https:') {
      return undefined;
    }
    return newUrl.href;
  } catch (err) {
    return undefined;
  }
}

//  Select mid high and mid low image quality
function selectFromSrcset(srcsetArr) {
  srcsetArr.sort((src1, src2) => src1[1] - src2[1]);

  const mid = Math.floor(srcsetArr.length / 2);
  const midLow = mid - Math.floor(mid / 2);
  const midHigh = mid + Math.floor((srcsetArr.length - 1 - mid) / 2);
  return { midLow, midHigh };
}

/*
 *   Filter valid source set item
 *   Choose either image density or image width for easy comparision
 */
function filterSrcset(srcsetArr) {
  let sizeType = '';
  return srcsetArr.reduce((acc, sourceAndWidth) => {
    if (sourceAndWidth.length !== 2) {
      return acc;
    }
    const [src, width] = sourceAndWidth;
    if (!validateUrl(src)) {
      return acc;
    }

    const unit = width.slice(-1).toUpperCase();
    sizeType = sizeType || unit;
    const number = Number.parseInt(width.slice(0, -1), 10);
    if (unit === sizeType && number && number > 0) {
      acc.push([src, number]);
    }
    return acc;
  }, []);
}

function dragImageSize(imgWidth, imgHeight) {
  const width = 150;
  const height = (imgHeight / imgWidth) * width;
  return { width, height };
}

function createCanvas(img) {
  const canvas = document.createElement('canvas');
  const { width, height } = dragImageSize(img.width, img.height);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas;
}

export { selectFromSrcset, dragImageSize, filterSrcset, createCanvas };
