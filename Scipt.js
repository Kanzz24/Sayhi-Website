document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // 1. Dark Mode Toggle + localStorage
  // =========================================
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

  /**
   * applyTheme(theme)
   * - Set data-theme attribute บน <html>
   * - Sync สถานะ checkbox ให้ตรงกับโหมด
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleSwitch) {
      toggleSwitch.checked = (theme === 'dark');
    }
  }

  /**
   * initTheme()
   * โหลดธีมจาก localStorage ก่อน
   * ถ้าไม่เคยตั้งค่า → ดู System Preference (prefers-color-scheme)
   */
  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * switchTheme(e)
   * เรียกเมื่อผู้ใช้กดสวิตช์ Toggle
   * - สลับโหมด
   * - บันทึกลง localStorage
   */
  function switchTheme(e) {
    const newTheme = e.target.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // เริ่มต้น: โหลดธีมที่บันทึกไว้
  initTheme();

  // ผูก Event Listener กับ Toggle Switch
  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
  }


  // =========================================
  // 2. Custom Scrollbar Sync (Selected Works)
  // =========================================
  const worksScroll = document.getElementById("worksScroll");
  const worksThumb  = document.getElementById("worksThumb");

  if (worksScroll && worksThumb) {
    worksScroll.addEventListener("scroll", () => {
      const maxScroll = worksScroll.scrollWidth - worksScroll.clientWidth;
      if (maxScroll > 0) {
        const scrollProgress = worksScroll.scrollLeft / maxScroll;
        worksThumb.style.transform = `translateX(${scrollProgress * 200}%)`;
      }
    });
  }


  // =========================================
  // 3. Mobile Hamburger Menu Toggle
  // =========================================
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const menuLinks    = document.querySelector('.menu-links');

  if (hamburgerBtn && menuLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = menuLinks.style.display === 'flex';
      menuLinks.style.display        = isOpen ? 'none' : 'flex';
      menuLinks.style.flexDirection  = 'column';
      menuLinks.style.position       = 'absolute';
      menuLinks.style.top            = '70px';
      menuLinks.style.left           = '0';
      menuLinks.style.width          = '100%';
      menuLinks.style.background     = 'rgba(255, 255, 255, 0.95)';
      menuLinks.style.padding        = '1rem';
      menuLinks.style.borderRadius   = '20px';
    });
  }


  // =========================================
  // 4. Scroll Reveal Animation (Intersection Observer)
  // =========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.section-title, .works-title, .faq-title, .team-title, .work-card, .faq-center .pill-btn, .team-overlay'
  );

  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    scrollObserver.observe(el);
  });


  // =========================================
  // 5. Parallax Effect สำหรับ FAQ Wireframe Boxes
  // =========================================
  const faqBoxes = document.querySelectorAll('.faq-side .wire-box');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    faqBoxes.forEach((box, index) => {
      const speed = index % 2 === 0 ? 0.08 : -0.05;
      const moveY = scrollPosition * speed;

      if (moveY > -100 && moveY < 100) {
        // ใช้ CSS Variable ส่งค่าลง CSS เพื่อไม่ให้ทับ translateX(20%) เดิม
        box.style.setProperty('--parallax-y', `${moveY}px`);
      }
    });
  });


  // =========================================
  // 6. Smooth Hover Tilt (การ์ด Selected Works อันแรก)
  // =========================================
  const featuredCard = document.querySelector('.featured-card');

  if (featuredCard) {
    featuredCard.addEventListener('mousemove', (e) => {
      const rect  = featuredCard.getBoundingClientRect();
      const x     = e.clientX - rect.left - rect.width / 2;
      const y     = e.clientY - rect.top  - rect.height / 2;
      const tiltX = -(y / rect.height) * 10;
      const tiltY =  (x / rect.width)  * 10;

      featuredCard.style.transform  = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      featuredCard.style.transition = 'transform 0.1s ease-out';
      featuredCard.style.zIndex     = '10';
    });

    featuredCard.addEventListener('mouseleave', () => {
      featuredCard.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      featuredCard.style.transition = 'transform 0.5s ease-out';
      featuredCard.style.zIndex     = '1';
    });
  }


  // =========================================
  // 7. Drag to Scroll — Our Team Section
  // =========================================
  const teamGrid = document.querySelector('.team-bg-grid');

  if (teamGrid) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // 1. กดเมาส์ลง (mousedown) -> เริ่มต้นการลาก และเปลี่ยนเคอร์เซอร์เป็น grabbing
    teamGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      teamGrid.classList.add('active');
      startX = e.pageX - teamGrid.offsetLeft;
      scrollLeft = teamGrid.scrollLeft;
    });

    // 2. เมาส์หลุดออกจากพื้นที่ (mouseleave) -> ยกเลิกการลาก และคืนค่าเคอร์เซอร์
    teamGrid.addEventListener('mouseleave', () => {
      isDown = false;
      teamGrid.classList.remove('active');
    });

    // 3. ปล่อยเมาส์ (mouseup) -> ยกเลิกการลาก และคืนค่าเคอร์เซอร์
    teamGrid.addEventListener('mouseup', () => {
      isDown = false;
      teamGrid.classList.remove('active');
    });

    // 4. ลากเมาส์ (mousemove) -> คำนวณระยะขยับแกน X แล้วเลื่อน scrollLeft
    teamGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault(); // ป้องกันการเลือกข้อความหรือพฤติกรรม drag เริ่มต้นของเบราว์เซอร์
      const x = e.pageX - teamGrid.offsetLeft;
      const walk = (x - startX) * 1.5; // ตัวคูณปรับความไวในการเลื่อน
      teamGrid.scrollLeft = scrollLeft - walk;
    });

    // 5. เลื่อนด้วย Scroll wheel (Mouse Wheel) แนวนอน
    teamGrid.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        teamGrid.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

}); // end DOMContentLoaded
