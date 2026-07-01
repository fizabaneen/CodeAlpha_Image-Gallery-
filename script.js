document.addEventListener('DOMContentLoaded', () => {
    // --- Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // If filter is "all" or item category matches filter
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    // Add slight delay for animation effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    // Wait for transition to finish before hiding from layout
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 400); // Matches CSS transition speed
                }
            });
        });
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    // Keep track of visible items to navigate properly when filtered
    let visibleItems = Array.from(galleryItems);

    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Update visible items based on current filter
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            visibleItems = Array.from(galleryItems).filter(el => 
                activeFilter === 'all' || el.getAttribute('data-category') === activeFilter
            );

            // Find index of clicked item in the visible items array
            currentIndex = visibleItems.indexOf(item);
            
            // Set image source
            const imgSrc = item.querySelector('img').getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigate Lightbox
    const showImage = (index) => {
        if (index < 0) {
            currentIndex = visibleItems.length - 1;
        } else if (index >= visibleItems.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        const imgSrc = visibleItems[currentIndex].querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
    };

    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
});
