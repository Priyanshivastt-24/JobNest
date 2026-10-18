/**
 * JobNest Interactive Client Scripts
 * Technology: JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-dismiss Toasts
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            setTimeout(() => toast.remove(), 400);
        }, 4500);
    });

    // 2. Demo Login Auto-fill Helper
    window.fillDemoLogin = (email, password) => {
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        if (emailInput && passInput) {
            emailInput.value = email;
            passInput.value = password;
            emailInput.focus();
        }
    };

    // 3. Modal Controls (Apply Modal)
    const applyModal = document.getElementById('applyModal');
    const openApplyBtn = document.getElementById('openApplyBtn');
    const closeApplyBtn = document.getElementById('closeApplyBtn');

    if (openApplyBtn && applyModal) {
        openApplyBtn.addEventListener('click', () => {
            applyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeApplyBtn && applyModal) {
        closeApplyBtn.addEventListener('click', () => {
            applyModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (applyModal) {
        applyModal.addEventListener('click', (e) => {
            if (e.target === applyModal) {
                applyModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 4. Confirm Delete Job
    window.confirmDelete = (jobTitle) => {
        return confirm(`Are you sure you want to permanently delete the job: "${jobTitle}"?`);
    };

    // 5. Mobile Navigation Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMobileMenu = document.getElementById('navMobileMenu');

    if (navToggle && navMobileMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMobileMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navMobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close when clicking any mobile link
        navMobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMobileMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMobileMenu.contains(e.target)) {
                navMobileMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});
