/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
$(() => {
  const dropArea = document.createElement('div');
  const container = document.createElement('div');
  container.classList.add('ei-drop-container');

  const libsContainer = $('.ei-libs-container');

  const libBoxes = $('.ei-lib-box');

  libBoxes.on('dragenter', (ev) => {
    ev.target.classList.add('dragover');
  });

  libBoxes.on('drop', (ev) => {
    const libraryId = $(ev.target).attr('data-libraryId');
    ev.target.classList.remove('dragover');
    // const url = new URL(dragged.src);
    console.log(libraryId);
  });

  libBoxes.on('dragover', (ev) => {
    ev.preventDefault();
  });

  libBoxes.on('dragleave', (ev) => {
    ev.target.classList.remove('dragover');
  });

  const resetColor = (mouseOverLeft, mouseOverRight) => {
    const leftScrollable = libsContainer.scrollLeft() > 0;
    const rightScrollable =
      libsContainer.scrollLeft() < libsContainer[0].scrollWidth - libsContainer[0].clientWidth;

    $('#ei-arrow-left').css({
      'border-color': !leftScrollable
        ? 'var(--ei-coolGray)'
        : mouseOverLeft
        ? 'var(--ei-blue)'
        : 'white',
    });

    $('#ei-arrow-right').css({
      'border-color': !rightScrollable
        ? 'var(--ei-coolGray)'
        : mouseOverRight
        ? 'var(--ei-blue)'
        : 'white',
    });
  };

  $('.ei-arrow').each(function () {
    const animationDuration = 250;
    let interval = 0;
    const isLeftArrow = $(this).attr('id') === 'ei-arrow-left';

    resetColor(false, false);

    $(this).on('dragenter', () => {
      interval = setInterval(() => {
        resetColor(isLeftArrow, !isLeftArrow);
        libsContainer.animate(
          {
            scrollLeft: libsContainer.scrollLeft() + (isLeftArrow ? -100 : 100),
          },
          animationDuration
        );
      }, animationDuration);
    });

    $(this).on('dragleave', () => {
      resetColor(false, false);
      clearInterval(interval);
    });

    $(this).on('drop', (ev) => {
      ev.preventDefault();
      resetColor(false, false);
      clearInterval(interval);
    });
  });

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

  $(document).on('dragstart', 'img', (ev) => {
    dropArea.classList.add('show');

    const img = ev.target;
    const canvas = createCanvas(img);
    canvas.style.position = 'fixed';
    canvas.style.top = '200%';
    document.body.appendChild(canvas);
    setTimeout(() => {
      document.body.removeChild(canvas);
    }, 100);

    ev.originalEvent.dataTransfer.setDragImage(canvas, 0, 0);
    dragged = img;
  });

  $(document).on('dragend', 'img', () => {
    dropArea.classList.remove('show');
  });

  dropArea.ondragover = (ev) => {
    ev.preventDefault();
  };

  dropArea.ondrop = (ev) => {
    ev.preventDefault();
  };
});
