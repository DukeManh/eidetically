/* eslint-disable no-undef */
$(() => {
  let dragged;
  let libraries = null;

  const dropArea = document.createElement('div');
  dropArea.classList.add('ei-drop-area');
  $(dropArea).appendTo(document.body);

  function fillDropArea(error, libs) {
    const container = document.createElement('div');
    container.classList.add('ei-drop-container');

    if (error) {
      const html = `
            <div class='ei-libs-container'>
                <p>
                    ${error}
                </p>
            </div>
          `;

      $(container).html(html);
      $(container).appendTo(dropArea);
    } else {
      const arrowIcon = chrome.extension.getURL('../../icons/rightArrowBlack.svg');
      const blueArrowIcon = chrome.extension.getURL('../icons/rightArrowBlue.svg');

      const html = `
            <div class='ei-arrow' id='ei-arrow-left'>
              <img class='ei-arrow-icon' src='${arrowIcon}' alt='right-arrow' style='transform: rotateY(180deg)'>
            </div>
            <div class='ei-libs-container'>
            </div>
            <div class='ei-arrow' id='ei-arrow-right'>
              <img class='ei-arrow-icon' src='${arrowIcon}' alt='right-arrow'>
            </div>
          `;

      $(container).html(html);
      $(container).appendTo(dropArea);

      const libsContainer = $('.ei-libs-container');

      const newLib = document.createElement('div');
      newLib.classList.add('ei-lib-box');
      $(newLib).html(`
                <img src='${chrome.extension.getURL(
                  '../../icons/newFolder.png'
                )}' alt='new folder icon' width='30' height='30' />
                <div>New Lib</div>
            `);
      $(newLib).appendTo(libsContainer);

      libs.forEach((lib) => {
        const library = document.createElement('div');
        $(library).attr('data-libraryId', lib.id);
        library.classList.add('ei-lib-box');

        $(library).html(`
                <img src='${chrome.extension.getURL(
                  '../../icons/folder.png'
                )}' alt='folder icon' width='30' height='30' />
                <div>${lib.name}</div>
            `);
        $(library).appendTo(libsContainer);
      });

      const libBoxes = $('.ei-lib-box');

      libBoxes.on('dragenter', (ev) => {
        ev.target.classList.add('dragover');
      });

      libBoxes.on('drop', (ev) => {
        const libraryId = $(ev.target).attr('data-libraryId');
        ev.target.classList.remove('dragover');
        const url = new URL(dragged.src);
        chrome.runtime.sendMessage({
          command: 'uploadImage',
          payload: {
            url: dragged.src,
            name: dragged.alt || `${url.host}-${(Date.now() / 1000).toFixed()}`,
            libraryId,
          },
        });
      });

      libBoxes.on('dragover', (ev) => {
        ev.preventDefault();
      });

      libBoxes.on('dragleave', (ev) => {
        ev.target.classList.remove('dragover');
      });

      $('.ei-arrow').each(function () {
        const animationDuration = 250;
        let interval = 0;
        const icon = $(this).children('img');
        const isLeftArrow = $(this).attr('id') === 'ei-arrow-left';

        function reset() {
          clearInterval(interval);
          icon.attr({ src: arrowIcon });
        }

        $(this).on('dragenter', () => {
          const scrollable = isLeftArrow
            ? libsContainer.scrollLeft() > 0
            : libsContainer.scrollLeft() <
              libsContainer[0].scrollWidth - libsContainer[0].clientWidth;

          interval = setInterval(() => {
            if (scrollable) {
              icon.attr({ src: blueArrowIcon });
              libsContainer.animate(
                {
                  scrollLeft: libsContainer.scrollLeft() + (isLeftArrow ? -100 : 100),
                },
                animationDuration
              );
            } else {
              reset();
            }
          }, animationDuration);
        });

        $(this).on('dragleave', () => {
          reset();
        });

        $(this).on('drop', (ev) => {
          ev.preventDefault();
          reset();
        });
      });
    }
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

  $(document).on('dragstart', 'img', (ev) => {
    if (!libraries) {
      chrome.runtime.sendMessage(
        {
          command: 'getLibs',
        },
        (res) => {
          if (res.status === 'failure') {
            console.error(res.message);
            fillDropArea(res.message);
          } else {
            fillDropArea('', res.payload.libs);
            libraries = res.payload.libs;
          }
        }
      );
    }
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
