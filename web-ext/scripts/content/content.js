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
      const html = `
            <div class='ei-arrow' id='ei-arrow-left'>
            </div>
            <div class='ei-libs-container'>
            </div>
            <div class='ei-arrow' id='ei-arrow-right'>
            </div>
          `;

      $(container).html(html);
      $(container).appendTo(dropArea);

      const libsContainer = $('.ei-libs-container');

      const newLib = document.createElement('div');
      newLib.classList.add('ei-lib-box');
      $(newLib).html(`
                <img src='${chrome.extension.getURL(
                  '../../icons/newFolder.svg'
                )}' alt='new folder icon' width='35' height='30' />
                <div>New Lib</div>
            `);
      $(newLib).appendTo(libsContainer);

      libs.forEach((lib) => {
        const library = document.createElement('div');
        $(library).attr('data-libraryId', lib.id);
        library.classList.add('ei-lib-box');

        $(library).html(`
                <img src='${chrome.extension.getURL(
                  '../../icons/folder.svg'
                )}' alt='folder icon' width='35' height='35' />
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

        let imageSrc = dragged.src;

        if (dragged.srcset) {
          let srcset = dragged.srcset.split(/,\s+/).map((src) => src.split(/\s+/));

          srcset = srcset.reduce((acc, sourceAndWidth) => {
            if (sourceAndWidth.length !== 2) {
              return acc;
            }
            const [src, width] = sourceAndWidth;
            try {
              const url = new URL(src);

              if (url.protocol !== 'https') {
                return acc;
              }
            } catch (err) {
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
            srcset = srcset.sort((src1, src2) =>
              src1[1] < src2[1] ? 1 : src1[1] === src2[1] ? 0 : -1
            );

            // eslint-disable-next-line prefer-destructuring
            imageSrc = srcset[Math.floor((src2.length - 1) / 2)][0];
          }
        }
        chrome.runtime.sendMessage({
          command: 'uploadImage',
          payload: {
            url: imageSrc,
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

      const resetArrowColor = (mouseOverLeft, mouseOverRight) => {
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

        resetArrowColor(false, false);

        $(this).on('dragenter', () => {
          interval = setInterval(() => {
            resetArrowColor(isLeftArrow, !isLeftArrow);
            libsContainer.animate(
              {
                scrollLeft: libsContainer.scrollLeft() + (isLeftArrow ? -100 : 100),
              },
              animationDuration
            );
          }, animationDuration);
        });

        $(this).on('dragleave', () => {
          resetArrowColor(false, false);
          clearInterval(interval);
        });

        $(this).on('drop', (ev) => {
          ev.preventDefault();
          resetArrowColor(false, false);
          clearInterval(interval);
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
