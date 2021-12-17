import { selectFromSrcset, filterSrcset, createCanvas } from './lib.js';

export function main() {
  $(() => {
    let dragged;
    let libraries = null;

    // Drop area container
    const dropArea = document.createElement('div');
    dropArea.classList.add('ei-drop-area');
    $(dropArea).appendTo(document.body);

    // Render drop area content from a library list
    function fillDropArea(error, libs) {
      // Failed to get libraries
      if (error) {
        const container = document.createElement('div');
        container.classList.add('ei-error-container');
        const html = `
          <div>${error}</div>
          `;
        $(container).html(html);
        $(container).appendTo(dropArea);
      } else {
        const container = document.createElement('div');
        container.classList.add('ei-drop-container');

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

        // Create library boxes
        libs.forEach((lib) => {
          const library = document.createElement('div');
          $(library).attr('data-libraryId', lib.id);
          library.classList.add('ei-lib-box');

          $(library).html(`
                <img src='${chrome.extension.getURL(
                  '../../icons/folder.svg'
                )}' alt='folder icon' width='35' height='35' />
                <div class="ei-lib-name">${lib.name}</div>
            `);
          $(library).appendTo(libsContainer);
        });

        const libBoxes = $('.ei-lib-box');

        // Add hover effect
        libBoxes.on('dragenter', (ev) => {
          ev.target.classList.add('dragover');
        });

        libBoxes.on('drop', (ev) => {
          const libraryId = $(ev.target).attr('data-libraryId');
          ev.target.classList.remove('dragover');

          let imageSrc = dragged.src;

          // responsive source set
          if (dragged.srcset) {
            let srcset = dragged.srcset.split(/,\s+/).map((src) => src.trim().split(/\s+/));
            srcset = filterSrcset(srcset);
            if (srcset.length) {
              const { midHigh } = selectFromSrcset(srcset);
              [imageSrc] = srcset[midHigh];
            }
          }
          // Upload the extracted message
          chrome.runtime.sendMessage({
            command: 'uploadImage',
            payload: {
              url: imageSrc,
              name: dragged.alt || `${imageSrc.host}-${(Date.now() / 1000).toFixed()}`,
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

        // Update overflow arrows colors, blue on hover, gray-outed if disabled, white if scrollable
        const updateArrowColor = (mouseOverLeft, mouseOverRight) => {
          const leftScrollable = libsContainer.scrollLeft() > 0;
          const rightScrollable =
            libsContainer.scrollLeft() <
            libsContainer[0].scrollWidth - libsContainer[0].clientWidth;

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

        // Scroll the box area if hover over an arrow
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
      }
    }

    $(document).on('dragstart', 'img', (ev) => {
      // Get libraries once
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
}

export default main;
