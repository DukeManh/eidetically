$(function () {
  let dragged;

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

  function fileFromImage(img) {
    const canvas = createCanvas(img);
    const { width, height } = canvas;

    img.crossOrigin = 'Anonymous';
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height).data.buffer;
    return new File([imageData], img.alt, { lastModified: Date.now() });
  }

  const dropArea = document.createElement('div');
  dropArea.classList.add('ex-drop-area');
  document.body.appendChild(dropArea);

  $(document).on('dragstart', 'img', (ev) => {
    chrome.runtime.sendMessage(
      {
        command: 'getLibs',
    }, );

    dropArea.classList.add('show');
    const img = ev.target;
    const canvas = createCanvas(img);
    ev.originalEvent.dataTransfer.setDragImage(canvas, 0, 0);
    dragged = img;
  });

  $(document).on('dragend', 'img', () => {
    dropArea.classList.remove('show');
  });

  dropArea.ondragenter = (ev) => {
    ev.preventDefault();
    dropArea.classList.add('dragOver');
  };

  dropArea.ondragover = (ev) => {
    ev.preventDefault();
  };

  dropArea.ondragleave = () => {
    dropArea.classList.remove('dragOver');
  };

  dropArea.ondrop = (ev) => {
    dropArea.classList.remove('dragOver');
    ev.preventDefault();
    console.log('hi');
    chrome.runtime.getBackgroundPage((window) => {
      console.log('hi');
    });
    if (dragged) {
      // const file = fileFromImage(dragged);
    }
  };
});