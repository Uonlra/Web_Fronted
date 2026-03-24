// Get all accordion headers
const accordionHeaders = document.querySelectorAll('.accordion-header');

// Add click event listener to each header
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        // Get the parent accordion item
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');

        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open the clicked item if it wasn't already open
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});
