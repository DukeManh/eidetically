$(function () {
  let dragged;
  let libs = null;
  const libsData = [
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/354wH5SCAObbOLhJhC2E",
        "fields": {
          "name": {
            "stringValue": "wow"
          },
          "image_count": {
            "integerValue": "30"
          },
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          }
        },
        "createTime": "2021-06-20T05:52:36.944227Z",
        "updateTime": "2021-07-05T00:24:17.527836Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    },
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/AtU5dXEyhTUPlZpW76a9",
        "fields": {
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          },
          "image_count": {
            "integerValue": "37"
          },
          "name": {
            "stringValue": "hi there"
          }
        },
        "createTime": "2021-06-20T06:08:12.685925Z",
        "updateTime": "2021-06-20T06:09:01.049338Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    },
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/354wH5SCAObbOLhJhC2E",
        "fields": {
          "name": {
            "stringValue": "wow"
          },
          "image_count": {
            "integerValue": "30"
          },
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          }
        },
        "createTime": "2021-06-20T05:52:36.944227Z",
        "updateTime": "2021-07-05T00:24:17.527836Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    },
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/Dry7dFNAoLgoLWoq9KKM",
        "fields": {
          "name": {
            "stringValue": "hello there gamer"
          },
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          },
          "image_count": {
            "integerValue": "30"
          }
        },
        "createTime": "2021-06-20T05:51:32.653079Z",
        "updateTime": "2021-07-05T00:37:27.845063Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    },
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/v6BnsgJ294H09X7oCeDm",
        "fields": {
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          },
          "image_count": {
            "integerValue": "30"
          },
          "name": {
            "stringValue": "hello"
          }
        },
        "createTime": "2021-06-22T21:41:14.541619Z",
        "updateTime": "2021-06-22T21:43:03.922872Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    },
    {
      "document": {
        "name": "projects/dropit-7ae30/databases/(default)/documents/libraries/Dry7dFNAoLgoLWoq9KKM",
        "fields": {
          "name": {
            "stringValue": "hello there gamer"
          },
          "owner": {
            "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
          },
          "image_count": {
            "integerValue": "30"
          }
        },
        "createTime": "2021-06-20T05:51:32.653079Z",
        "updateTime": "2021-07-05T00:37:27.845063Z"
      },
      "readTime": "2021-07-12T09:22:36.219778Z"
    }
  ];

  const dropArea = document.createElement('div');
  dropArea.classList.add('ei-drop-area');
  $(dropArea).appendTo(document.body);

  function fillDropArea(authenticated, libs){
    const container = document.createElement('div');
    container.classList.add('ei-drop-container');

    if (!authenticated){
      const html = `
            <div class='ei-libs-container'>
                <p>
                    Please Login To Start Drag 'n Dropping !
                </p>
            </div>
          `;

      $(container).html(html);
      $(container).appendTo(dropArea);
    }
    else {
      const arrowIcon = chrome.extension.getURL('../../icons/rightArrowBlack.svg');
      const blueArrowIcon = chrome.extension.getURL('../icons/rightArrowBlue.svg');

      const html = `
            <div class='ei-arrow' id='ei-arrow-left'>
              <img src='${arrowIcon}' alt='right-arrow' style='transform: rotateY(180deg)'>
            </div>
            <div class='ei-libs-container'>
            </div>
            <div class='ei-arrow' id='ei-arrow-right'>
              <img src='${arrowIcon}' alt='right-arrow'>
            </div>
          `;

      $(container).html(html);
      $(container).appendTo(dropArea);

      const libsContainer = $(".ei-libs-container");

      const newLib = document.createElement('div');
      newLib.classList.add('ei-lib-box');
      $(newLib).html(`
                <img src='${chrome.extension.getURL('../../icons/newFolder.png')}' alt='new folder icon' width='30' height='30' />
                <div>New Lib</div>
            `);
      $(newLib).appendTo(libsContainer);

      libs.forEach((lib) => {
        const library = document.createElement('div');
        library.classList.add('ei-lib-box');
        $(library).html(`
                <img src='${chrome.extension.getURL('../../icons/folder.png')}' alt='folder icon' width='30' height='30' />
                <div>${lib.document.fields.name.stringValue}</div>
            `);
        $(library).appendTo(libsContainer);
      });

      const libBoxes = $('.ei-lib-box');
      const leftArrow = $('#ei-arrow-left');
      const rightArrow = $('#ei-arrow-right');
      const leftArrowImage = $('#ei-arrow-left img');
      const rightArrowImage = $('#ei-arrow-right img');

      libBoxes.on('dragenter', (ev) => {
        ev.target.classList.add('dragover');
      });

      libBoxes.on('drop', (ev) => {
        console.log(ev.target.innerHTML);
      });

      libBoxes.on('dragover', (ev) => {
        ev.preventDefault();
      });

      libBoxes.on('dragleave', (ev) => {
        ev.preventDefault();
        ev.target.classList.remove('dragover');
      })

      leftArrow.on('dragenter', (ev) => {
        ev.preventDefault();
        const interval = setInterval(() => {
          if (libsContainer.scrollLeft() > 0){
            leftArrowImage.attr({'src': blueArrowIcon});
            libsContainer.animate({
              scrollLeft: libsContainer.scrollLeft() - 100
            }, 300)
          }
          else{
            clearInterval(interval);
            leftArrowImage.attr({'src': arrowIcon});
          }
        }, 300);
        leftArrow.on('dragleave', (ev) => {
          ev.preventDefault();
          leftArrowImage.attr({'src': arrowIcon});
          clearInterval(interval);
        });
        leftArrow.on('drop', (ev) => {
          ev.preventDefault();
          leftArrowImage.attr({'src': arrowIcon});
          clearInterval(interval);
        });
      });

      rightArrow.on('dragenter', (ev) => {
        ev.preventDefault();
        const interval = setInterval(() => {
          if (libsContainer.scrollLeft() < libsContainer[0].scrollWidth - libsContainer[0].clientWidth){
            rightArrowImage.attr({'src': blueArrowIcon});
            libsContainer.animate({
              scrollLeft: libsContainer.scrollLeft() + 100
            }, 300)
          }
          else{
            clearInterval(interval);
            rightArrowImage.attr({'src': arrowIcon});
          }
        }, 300);
        rightArrow.on('dragleave', (ev) => {
          ev.preventDefault();
          rightArrowImage.attr({'src': arrowIcon});
          clearInterval(interval);
        });
        rightArrow.on('drop', (ev) => {
          ev.preventDefault();
          rightArrowImage.attr({'src': arrowIcon});
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

  function fileFromImage(img) {
    const canvas = createCanvas(img);
    const { width, height } = canvas;

    img.crossOrigin = 'Anonymous';
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height).data.buffer;
    return new File([imageData], img.alt, { lastModified: Date.now() });
  }

  $(document).on('dragstart', 'img', (ev) => {
      chrome.runtime.sendMessage(
        {
          command: 'getLibs',
        },
        (res) =>{
          console.log(res);
          if (res.status === 'failed'){
            fillDropArea(false);
          }
          else{
            fillDropArea(true, res.payload.libs || []);
          }
        });
    fillDropArea(true, libsData);

    dropArea.classList.add('show');

    const img = ev.target;
    const canvas = createCanvas(img);
    canvas.style.position = 'fixed';
    canvas.style.top = '200%';
    document.body.appendChild(canvas);
    setTimeout(() => {
      document.body.removeChild(canvas);
    }, 100)
    ev.originalEvent.dataTransfer.setDragImage(canvas, 0, 0);
    dragged = img;
  });

  $(document).on('dragend', 'img', () => {
    //dropArea.classList.remove('show');
    //dropArea.innerHTML = '';
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
    if (dragged) {
      // const file = fileFromImage(dragged);
    }
  };
});