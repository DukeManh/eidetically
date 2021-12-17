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

    let imageSrc = dragged.src;

    if (dragged.srcset) {
      let srcset = dragged.srcset.split(/,\s+/).map((src) => src.split(/\s+/));

      srcset = srcset.reduce((acc, sourceAndWidth) => {
        if (sourceAndWidth.length !== 2) {
          return acc;
        }
        const [src, width] = sourceAndWidth;
        try {
          // eslint-disable-next-line no-unused-vars
          const url = new URL(src);
        } catch (error) {
          console.log(error);
          return acc;
        }

        const unit = width.slice(-1).toUpperCase();
        const number = Number.parseInt(width.slice(0, -1), 10);
        if ((unit === 'X' || unit === 'W') && number && number > 0) {
          acc.push([src, number]);
        }

        return acc;
      }, []);

      if (srcset.length) {
        // eslint-disable-next-line prefer-destructuring
        imageSrc = srcset.sort((src1, src2) =>
          src1[1] < src2[1] ? 1 : src1[1] === src2[1] ? 0 : -1
        )[0][0];
      }
    }
    console.log(imageSrc);
  });

  libBoxes.on('dragover', (ev) => {
    ev.preventDefault();
  });

  libBoxes.on('dragleave', (ev) => {
    ev.target.classList.remove('dragover');
  });

  const updateArrowColor = (mouseOverLeft, mouseOverRight) => {
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
    const animationDuration = 200;
    let interval = 0;
    const isLeftArrow = $(this).attr('id') === 'ei-arrow-left';

    updateArrowColor(false, false);

    $(this).on('dragenter', () => {
      interval = setInterval(() => {
        updateArrowColor(isLeftArrow, !isLeftArrow);
        libsContainer.animate(
          {
            scrollLeft: libsContainer.scrollLeft() + (isLeftArrow ? -100 : 100),
          },
          animationDuration
        );
      }, animationDuration);
    });

    $(this).on('dragleave', () => {
      updateArrowColor(false, false);
      clearInterval(interval);
    });

    $(this).on('drop', (ev) => {
      ev.preventDefault();
      updateArrowColor(false, false);
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
