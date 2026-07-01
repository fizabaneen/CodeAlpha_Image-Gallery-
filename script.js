/**
 * ============================================================
 *  NATURE, TRAVEL & HOLY PLACES GALLERY — JAVASCRIPT
 *  Features: Category Filter · Lightbox · Keyboard Navigation
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------
       1. CARD ENTRANCE ANIMATION (Intersection Observer)
    -------------------------------------------------------- */
    const allCards = document.querySelectorAll('.gallery-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger each card's entrance
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    allCards.forEach(card => observer.observe(card));


    /* --------------------------------------------------------
       2. CATEGORY FILTER
    -------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = filter === 'all' || category === filter;

                if (isMatch) {
                    // Bring card back
                    card.classList.remove('hide');
                    // Re-trigger entrance animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.97)';
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25,1,0.5,1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 30);
                    });
                } else {
                    // Fade out and remove from layout
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 310);
                }
            });
        });
    });


    /* --------------------------------------------------------
       3. LIGHTBOX
    -------------------------------------------------------- */
    const lightbox     = document.getElementById('lightbox');
    const lbImg        = document.getElementById('lb-img');
    const lbCaptionCat = document.getElementById('lb-caption-cat');
    const lbCaptionTitle = document.getElementById('lb-caption-title');
    const lbCounter    = document.getElementById('lb-counter');
    const lbClose      = document.getElementById('lb-close');
    const lbPrev       = document.getElementById('lb-prev');
    const lbNext       = document.getElementById('lb-next');

    let currentIndex = 0;    // index within visibleItems
    let visibleItems = [];   // currently shown cards

    /**
     * Get the list of currently visible (not hidden) cards.
     */
    const getVisibleItems = () =>
        Array.from(galleryCards).filter(c => !c.classList.contains('hide'));

    /**
     * Open the lightbox, showing the image at `index` in visibleItems.
     */
    const openLightbox = (index) => {
        visibleItems = getVisibleItems();
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';  // prevent background scroll
    };

    /**
     * Update lightbox image and caption to reflect currentIndex.
     */
    const updateLightboxContent = () => {
        const card  = visibleItems[currentIndex];
        const img   = card.querySelector('img');
        const title = card.getAttribute('data-title') || '';
        const cat   = card.querySelector('.card-category')?.textContent || '';

        // Animate image swap: fade out → swap src → fade in
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.96)';

        setTimeout(() => {
            lbImg.setAttribute('src', img.getAttribute('src'));
            lbImg.setAttribute('alt', img.getAttribute('alt'));
            lbCaptionCat.textContent   = cat;
            lbCaptionTitle.textContent = title;
            lbCounter.textContent      = `${currentIndex + 1} / ${visibleItems.length}`;

            lbImg.style.opacity   = '1';
            lbImg.style.transform = 'scale(1)';
        }, 180);
    };

    /**
     * Navigate to a specific index, wrapping around.
     */
    const goTo = (index) => {
        if (visibleItems.length === 0) return;
        if (index < 0) index = visibleItems.length - 1;
        if (index >= visibleItems.length) index = 0;
        currentIndex = index;
        updateLightboxContent();
    };

    /**
     * Close the lightbox.
     */
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Attach click listeners to each card
    galleryCards.forEach((card, originalIndex) => {
        card.addEventListener('click', () => {
            visibleItems = getVisibleItems();
            const idxInVisible = visibleItems.indexOf(card);
            if (idxInVisible !== -1) openLightbox(idxInVisible);
        });
    });

    // Lightbox controls
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click',  () => goTo(currentIndex - 1));
    lbNext.addEventListener('click',  () => goTo(currentIndex + 1));

    // Close on backdrop click (not on image or buttons)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   goTo(currentIndex - 1);
        if (e.key === 'ArrowRight')  goTo(currentIndex + 1);
    });

}); // END DOMContentLoaded
