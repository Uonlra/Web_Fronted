(function () {
	var sidebarToggle = document.getElementById('cb');
	var sideContainer = document.getElementById('side');
	var switchText = document.querySelector('.resume-toolbar .switch-text');
	var switchLabel = document.querySelector('.resume-toolbar .switch');
	var skillItems = document.querySelectorAll('.skill-list li[data-level]');

	if (sidebarToggle && sideContainer) {
		var updateSidebarState = function () {
			document.body.classList.toggle('sidebar-hidden', !sidebarToggle.checked);

			if (switchText) {
				switchText.textContent = sidebarToggle.checked ? '隐藏侧栏' : '显示侧栏';
			}

			if (switchLabel) {
				switchLabel.setAttribute('aria-label', sidebarToggle.checked ? '点击隐藏左侧栏' : '点击显示左侧栏');
			}
		};

		sidebarToggle.addEventListener('change', updateSidebarState);
		updateSidebarState();
	}

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
}());

console.log("感谢您的浏览，期待能够加入贵公司！");