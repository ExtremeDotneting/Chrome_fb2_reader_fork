if (document.readyState === 'loading') {
	// START LOADER 
	startLoader();
}

function startLoader() {
	setTimeout(() => {
		let body = document.body;
		if (body) {
			const loader = document.createElement('div');
			loader.id = 'loader';
			loader.innerHTML = `
				<div></div>
				<div></div>
				<div></div>
			`
			document.body.append(loader);
		}
	}, 0);
}

function stopLoader() {
	const loaderNode = document.getElementById('loader');
	if (loaderNode) {
		loaderNode.remove();
	}
}

window.onload = function () {
	let preNodes = document.getElementsByTagName('pre');
	if (preNodes) {
		let doc = preNodes[0].innerText;
		preNodes[0].remove();

		let tempDocNode = document.createElement('div');
		tempDocNode.innerHTML = doc;

		let fictionBooks = tempDocNode.getElementsByTagName('fictionbook');
		if (fictionBooks) {
			let mainContent = fictionBooks[0].innerHTML;

			// APP CONTAINER
			const appContainerNode = document.createElement('div');
			appContainerNode.classList.add('fb2-app-container');

			// READER CONTAINER
			const readerContainerNode = document.createElement('div');
			readerContainerNode.classList.add('fb2-reader-container');

			// READER CONTENT
			const readerContentNode = document.createElement('div');
			readerContentNode.classList.add('fb2-reader-content');
			readerContentNode.innerHTML = mainContent;

			// LEFT SIDEBAR
			const readerLeftSidebarNode = document.createElement('div');
			readerLeftSidebarNode.classList.add('fb2-reader-left-sidebar');

			// PAGES NUMBERS
			let currentPage = 1;

			// TITLE
			let titleTags = readerContentNode.getElementsByTagName('title');
			if (titleTags) {
				[...titleTags].forEach(titleTag => {
					const newItem = document.createElement('h3');
                    newItem.innerHTML =titleTag.innerText;
					titleTag.parentNode.replaceChild(newItem, titleTag);
					
					//titleTag.remove()
				});
			}

			// let authorFirstName = readerContentNode.getElementsByTagName('first-name');
			// let authorLastName = readerContentNode.getElementsByTagName('last-name');
			// let bookTitle = readerContainerNode.getElementsByTagName('book-title');


			// BODY FONT
			let bodyFontSize = 18;
			const bodyFontSizeNode = document.createElement('div');
			bodyFontSizeNode.classList.add('fb2-reader-body-font-size-num');
			bodyFontSizeNode.innerText = `${bodyFontSize}`;

			// ACTION BUTTONS START
			const increaseFontSizeBtn = document.createElement('div');
			increaseFontSizeBtn.classList.add('fb2-reader-font-increase-btn', 'btn');
			increaseFontSizeBtn.innerHTML = '<span>+</span>';
			increaseFontSizeBtn.addEventListener('click', () => {
				if (bodyFontSize < 52) {
					bodyFontSize++;
					document.body.style.fontSize = `${bodyFontSize}px`;
					let contentScrollHeight = readerContentNode.scrollHeight;
					let pagesCount = Math.floor(contentScrollHeight / +readerContentNode.offsetHeight);

					setTimeout(() => {
						let countPagesNode = document.querySelector('.fb2-reader-container-pages-count');
						countPagesNode.innerText = pagesCount;
						bodyFontSizeNode.innerText = `${bodyFontSize}`;
					}, 500);
				}
			})

			const decreaseFontSizeBtn = document.createElement('div');
			decreaseFontSizeBtn.classList.add('fb2-reader-font-decrease-btn', 'btn');
			decreaseFontSizeBtn.innerHTML = '<span>-</span>';
			decreaseFontSizeBtn.addEventListener('click', () => {
				if (bodyFontSize > 10) {
					bodyFontSize--;
					document.body.style.fontSize = `${bodyFontSize}px`;
					let contentScrollHeight = readerContentNode.scrollHeight;
					let pagesCount = Math.floor(contentScrollHeight / +readerContentNode.offsetHeight);

					setTimeout(() => {
						let countPagesNode = document.querySelector('.fb2-reader-container-pages-count');
						countPagesNode.innerText = pagesCount;
						bodyFontSizeNode.innerText = bodyFontSize;
					}, 500);
				}
			})

			const nightModeButton = document.createElement('div');
			nightModeButton.classList.add('fb2-reader-night-mode-btn', 'btn');
			nightModeButton.innerHTML = '<span>☀</span>';
			nightModeButton.addEventListener('click', () => {
				startLoader();
				setTimeout(() => {
					document.body.classList.toggle('darken');
				}, 0)
				setTimeout(() => {
					stopLoader();
				}, 500);
			});

			const fullscreenButton = document.createElement('div');
			fullscreenButton.classList.add('fb2-reader-fullscreen-btn', 'btn');
			fullscreenButton.innerHTML = '<span>⛚</span>';
			fullscreenButton.addEventListener('click', () => {
				appContainerNode.classList.toggle('fullscreen');
				let contentScrollHeight = readerContentNode.scrollHeight;
				let pagesCount = Math.floor(+contentScrollHeight / +readerContentNode.offsetHeight);
				const pagesCountElement = document.querySelector('.fb2-reader-container-pages-count');
				pagesCountElement.innerText = pagesCount;
			});

			// ACTION BUTTONS END

			// MENU BTN START
			const menuBtnNode = document.createElement('div');
			menuBtnNode.classList.add('fb2-reader-body-menu-btn', 'close', 'btn');
			menuBtnNode.innerHTML = `
				<div></div>
				<div></div>
				<div></div>
			`;
			menuBtnNode.addEventListener('click', function () {
				increaseFontSizeBtn.classList.toggle('hidden');
				decreaseFontSizeBtn.classList.toggle('hidden');
				bodyFontSizeNode.classList.toggle('hidden');
				nightModeButton.classList.toggle('hidden');
				this.classList.toggle('close');
			});
			// MENU BTN END

			// CONSTRUCT NODES START
			readerLeftSidebarNode.append(menuBtnNode);
			readerLeftSidebarNode.append(bodyFontSizeNode);
			readerLeftSidebarNode.append(increaseFontSizeBtn);
			readerLeftSidebarNode.append(decreaseFontSizeBtn);
			readerLeftSidebarNode.append(decreaseFontSizeBtn);
			readerLeftSidebarNode.append(fullscreenButton);
			readerLeftSidebarNode.append(nightModeButton);
			readerContainerNode.append(readerContentNode);
			readerContainerNode.append(readerLeftSidebarNode);
			let binaries = readerContentNode.getElementsByTagName('binary');
			if (binaries) {
				const imageLinks = readerContentNode.getElementsByTagName('img');
				[...binaries].forEach(binary => {
					const img = document.createElement('img');
					img.classList.add('fb2-reader-image');
					img.src = `data:image/gif;base64,${binary.innerHTML}`;
					const imgId = binary.getAttribute('id');
					if (imgId) {
						let currentImageLinkIdx = null;
						[...imageLinks].forEach((link, idx) => {
							let href = link.getAttribute('l:href');
							if (href && (href.replace(/\#/, '') == imgId)) {
								currentImageLinkIdx = idx;
							}
						})
						if (currentImageLinkIdx !== null) {
							imageLinks[currentImageLinkIdx].parentNode.append(img);
						}
					}
					binary.remove()
				});
			}
			appContainerNode.append(readerContainerNode);
			document.body.append(appContainerNode);
			// CONSTRUCT NODES END

			// PAGES COUNT START   
			let contentScrollHeight = readerContentNode.scrollHeight;
			let pagesCount = Math.floor(+contentScrollHeight / +readerContentNode.offsetHeight);
			const pages = document.createElement('div');
			pages.classList.add('fb2-reader-container-pages');
			pages.innerHTML = `<div class="fb2-reader-container-pages-content"><span class="fb2-reader-container-pages-current">${currentPage}</span> / <span class="fb2-reader-container-pages-count">${pagesCount}</span></div>`;

			readerContentNode.addEventListener('scroll', function () {
				currentPage = Math.floor(+readerContentNode.scrollTop / +readerContentNode.offsetHeight) + 1;
				if (currentPage >= pagesCount) {
					let pagesTotalCount = document.querySelector('.fb2-reader-container-pages-count')
					pagesTotalCount.innerText = currentPage;
				}
				let currentPageNode = document.querySelector('.fb2-reader-container-pages-current');
				currentPageNode.innerText = currentPage;
			});

			const prevPage = document.createElement('div');
			prevPage.classList.add('fb2-reader-container-pages-prev', 'btn');
			prevPage.addEventListener('click', () => {
				if (currentPage > 1) {
					currentPage--;
					readerContentNode.scrollTop = (+readerContentNode.offsetHeight * (+currentPage - 1));
				}
			})

			const nextPage = document.createElement('div');
			nextPage.classList.add('fb2-reader-container-pages-next', 'btn');
			nextPage.addEventListener('click', () => {
				if (currentPage < pagesCount) {
					currentPage++;
					readerContentNode.scrollTop = (+readerContentNode.offsetHeight * (+currentPage - 1));
				}
			})

			pages.prepend(prevPage);
			pages.append(nextPage);
			readerContainerNode.append(pages);
			// PAGES COUNT END


			// STOP LOADER 
			stopLoader();
		}
	}
}
