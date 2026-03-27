(function () {
	var sideContainer = document.getElementById('side');
	var topbar = document.querySelector('.resume-topbar');
	var toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
	var toggleSidebarLabel = toggleSidebarBtn ? toggleSidebarBtn.querySelector('.top-btn-label') : null;
	var themeToggleBtn = document.getElementById('themeToggleBtn');
	var themeToggleIcon = themeToggleBtn ? themeToggleBtn.querySelector('.fa') : null;
	var toggleTopbarBtn = document.getElementById('toggleTopbarBtn');
	var showTopbarBtn = document.getElementById('showTopbarBtn');
	var skillItems = document.querySelectorAll('.skill-list li[data-level]');
	var downloadPdfBtn = document.getElementById('downloadPdfBtn');
	var downloadImageBtn = document.getElementById('downloadImageBtn');
	var resumeContainer = document.querySelector('.container');
	var themeStorageKey = 'resume-theme';

	var updateSidebarState = function (isHidden) {
		document.body.classList.toggle('sidebar-hidden', isHidden);

		if (toggleSidebarBtn) {
			toggleSidebarBtn.classList.toggle('is-active', isHidden);
			toggleSidebarBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
			toggleSidebarBtn.setAttribute('aria-label', isHidden ? '打开侧栏' : '关闭侧栏');
			toggleSidebarBtn.setAttribute('title', isHidden ? '打开侧栏' : '关闭侧栏');

			if (toggleSidebarLabel) {
				toggleSidebarLabel.textContent = isHidden ? '打开侧栏' : '关闭侧栏';
			}
		}
	};

	var setTopbarState = function (isHidden) {
		document.body.classList.toggle('topbar-hidden', isHidden);

		if (toggleTopbarBtn) {
			toggleTopbarBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
			toggleTopbarBtn.setAttribute('aria-label', isHidden ? '打开顶部栏' : '关闭顶部栏');
			toggleTopbarBtn.setAttribute('title', isHidden ? '打开顶部栏' : '关闭顶部栏');
		}

		if (showTopbarBtn) {
			showTopbarBtn.setAttribute('aria-label', isHidden ? '打开顶部栏' : '关闭顶部栏');
			showTopbarBtn.setAttribute('title', isHidden ? '打开顶部栏' : '关闭顶部栏');
		}
	};

	if (toggleSidebarBtn && sideContainer) {
		toggleSidebarBtn.addEventListener('click', function () {
			var willHide = !document.body.classList.contains('sidebar-hidden');
			updateSidebarState(willHide);
		});

		updateSidebarState(false);
	}

	if (toggleTopbarBtn && topbar) {
		toggleTopbarBtn.addEventListener('click', function () {
			setTopbarState(true);
		});
	}

	if (showTopbarBtn && topbar) {
		showTopbarBtn.addEventListener('click', function () {
			setTopbarState(false);
		});
	}

	setTopbarState(true);

	var updateThemeButton = function (isNight) {
		if (!themeToggleBtn) {
			return;
		}

		themeToggleBtn.classList.toggle('is-active', isNight);
		themeToggleBtn.setAttribute('aria-pressed', isNight ? 'true' : 'false');
		themeToggleBtn.setAttribute('aria-label', isNight ? '切换为白天主题' : '切换为黑夜主题');
		themeToggleBtn.setAttribute('title', isNight ? '切换为白天主题' : '切换为黑夜主题');

		if (themeToggleIcon) {
			themeToggleIcon.className = isNight ? 'fa fa-sun-o' : 'fa fa-moon-o';
		}
	};

	var applyTheme = function (theme) {
		var isNight = theme === 'night';
		document.body.classList.toggle('theme-night', isNight);
		updateThemeButton(isNight);
	};

	var initTheme = function () {
		var storedTheme = null;

		try {
			storedTheme = window.localStorage.getItem(themeStorageKey);
		} catch (error) {
			storedTheme = null;
		}

		applyTheme(storedTheme === 'night' ? 'night' : 'day');
	};

	if (themeToggleBtn) {
		themeToggleBtn.addEventListener('click', function () {
			var isNight = !document.body.classList.contains('theme-night');
			var theme = isNight ? 'night' : 'day';
			applyTheme(theme);

			try {
				window.localStorage.setItem(themeStorageKey, theme);
			} catch (error) {
				console.warn('保存主题设置失败', error);
			}
		});
	}

	initTheme();

	if (skillItems.length) {
		skillItems.forEach(function (item, index) {
			var level = Number(item.getAttribute('data-level')) || 0;
			var clampedLevel = Math.max(0, Math.min(100, level));
			var skillBar = item.querySelector('.skill-bar span');
			var skillPercent = item.querySelector('.skill-percent');
				var groupDelay = Math.floor(index / 2) * 90;
				var intraGroupDelay = (index % 2) * 40;
			var lightness = Math.max(32, 70 - clampedLevel * 0.22);
			var saturation = Math.min(88, 54 + clampedLevel * 0.16);
			var skillColor = 'hsl(142, ' + saturation.toFixed(1) + '%, ' + lightness.toFixed(1) + '%)';
				item.style.setProperty('--skill-level', clampedLevel + '%');
			item.style.setProperty('--skill-color', skillColor);
				item.style.setProperty('--skill-delay', groupDelay + intraGroupDelay + 'ms');

			if (skillPercent) {
				skillPercent.textContent = clampedLevel + '%';
			}

		});

		window.setTimeout(function () {
			var skillSection = document.querySelector('.skill');

			if (skillSection) {
				skillSection.classList.add('is-ready');
			}
		}, 160);
	}

	var setExportState = function (isExporting, triggerButton) {
		document.body.classList.toggle('export-mode', isExporting);

		if (downloadPdfBtn) {
			downloadPdfBtn.disabled = isExporting;
		}

		if (downloadImageBtn) {
			downloadImageBtn.disabled = isExporting;
		}

		if (triggerButton && isExporting) {
			triggerButton.blur();
		}
	};

	var ensureSidebarVisible = function () {
		if (document.body.classList.contains('sidebar-hidden')) {
			updateSidebarState(false);
		}
	};

	var makeSnapshotCanvas = function () {
		if (!resumeContainer || typeof window.html2canvas !== 'function') {
			return Promise.reject(new Error('导出依赖未加载'));
		}

		ensureSidebarVisible();

		return window.html2canvas(resumeContainer, {
			scale: Math.min(2, window.devicePixelRatio || 1.5),
			backgroundColor: '#ffffff',
			useCORS: true,
			scrollX: 0,
			scrollY: -window.scrollY,
			windowWidth: document.documentElement.clientWidth,
			windowHeight: document.documentElement.scrollHeight
		});
	};

	var downloadDataUrl = function (dataUrl, filename) {
		var link = document.createElement('a');
		link.href = dataUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	var exportAsImage = function () {
		setExportState(true, downloadImageBtn);

		makeSnapshotCanvas()
			.then(function (canvas) {
				downloadDataUrl(canvas.toDataURL('image/png', 1), 'resume.png');
			})
			.catch(function (error) {
				console.error(error);
				window.alert('下载图片失败，请刷新后重试。');
			})
			.finally(function () {
				setExportState(false);
			});
	};

	var exportAsPdf = function () {
		if (!window.jspdf || !window.jspdf.jsPDF) {
			window.alert('PDF 依赖加载失败，请检查网络后重试。');
			return;
		}

		setExportState(true, downloadPdfBtn);

		makeSnapshotCanvas()
			.then(function (canvas) {
				var jsPDF = window.jspdf.jsPDF;
				var pdf = new jsPDF('p', 'mm', 'a4');
				var pageWidth = 210;
				var pageHeight = 297;
				var margin = 8;
				var contentWidth = pageWidth - margin * 2;
				var contentHeight = pageHeight - margin * 2;
				var sliceHeightPx = Math.floor((contentHeight / contentWidth) * canvas.width);
				var pageIndex = 0;

				for (var offsetY = 0; offsetY < canvas.height; offsetY += sliceHeightPx) {
					var currentSliceHeight = Math.min(sliceHeightPx, canvas.height - offsetY);
					var pageCanvas = document.createElement('canvas');
					pageCanvas.width = canvas.width;
					pageCanvas.height = currentSliceHeight;

					var ctx = pageCanvas.getContext('2d');
					ctx.drawImage(
						canvas,
						0,
						offsetY,
						canvas.width,
						currentSliceHeight,
						0,
						0,
						canvas.width,
						currentSliceHeight
					);

					var imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
					var renderedHeight = (currentSliceHeight * contentWidth) / canvas.width;

					if (pageIndex > 0) {
						pdf.addPage();
					}

					pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, renderedHeight, undefined, 'FAST');
					pageIndex += 1;
				}

				pdf.save('resume.pdf');
			})
			.catch(function (error) {
				console.error(error);
				window.alert('下载 PDF 失败，请刷新后重试。');
			})
			.finally(function () {
				setExportState(false);
			});
	};

	if (downloadPdfBtn) {
		downloadPdfBtn.addEventListener('click', exportAsPdf);
	}

	if (downloadImageBtn) {
		downloadImageBtn.addEventListener('click', exportAsImage);
	}
}());

console.log("感谢您的浏览，期待能够加入贵公司！");