import { selectFromSrcset, filterSrcset, createCanvas } from './lib.js';

$(() => {
  let dragged;
  const dropArea = document.createElement('div');
  const container = document.createElement('div');
  container.classList.add('ei-drop-container');

  (function listSrcOfExampleImage() {
    const draggedImage = $('#dragged-image').children('img')[0];
    console.log(draggedImage);
    const srcset = draggedImage.srcset.split(/,\s+/).map((src) => src.trim().split(/\s+/));
    const srcsetArr = filterSrcset(srcset);
    console.log(srcset);
    srcsetArr.forEach((src) => {
      $('#srcset-list').append(`<li>
          <a href="${src[0]}" > ${src[1]}</a>
        </li>
      `);
    });
  })();

  const libsContainer = $('.ei-libs-container');
  const libBoxes = $('.ei-lib-box');

  libBoxes.on('dragenter', (ev) => {
    ev.target.classList.add('dragover');
  });

  libBoxes.on('drop', (ev) => {
    const libraryId = $(ev.target).attr('data-libraryId');
    ev.target.classList.remove('dragover');
    console.log(libraryId);

    let imageSrc = dragged.src;
    if (dragged.srcset) {
      let srcset = dragged.srcset.split(/,\s+/).map((src) => src.trim().split(/\s+/));

      srcset = filterSrcset(srcset);
      if (srcset.length) {
        const { midLow, midHigh } = selectFromSrcset(srcset);
        console.log(midHigh, midLow);
        [imageSrc] = srcset[midHigh];
      }
      console.log(imageSrc);
    }
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
