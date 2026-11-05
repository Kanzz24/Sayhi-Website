document.addEventListener("DOMContentLoaded", () => {
  
  // =========================================
  // 1. Custom Scrollbar Sync (Selected Works)
  // =========================================
  const worksScroll = document.getElementById("worksScroll");
  const worksThumb = document.getElementById("worksThumb");

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
  // 2. Mobile Hamburger Menu Toggle
  // =========================================
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const menuLinks = document.querySelector('.menu-links');

  if (hamburgerBtn && menuLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = menuLinks.style.display === 'flex';
      menuLinks.style.display = isOpen ? 'none' : 'flex';
      menuLinks.style.flexDirection = 'column';
      menuLinks.style.position = 'absolute';
      menuLinks.style.top = '70px';
      menuLinks.style.left = '0';
      menuLinks.style.width = '100%';
      menuLinks.style.background = 'rgba(255, 255, 255, 0.95)';
      menuLinks.style.padding = '1rem';
      menuLinks.style.borderRadius = '20px';
    });
  }

  // TODO: Search overlay logic & Toggle switch UI state

  // =========================================
  // 3. Scroll Reveal Animation (Intersection Observer)
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
  // 4. Parallax Effect สำหรับ FAQ Wireframe Boxes
  // =========================================
  const faqBoxes = document.querySelectorAll('.faq-side .wire-box');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    faqBoxes.forEach((box, index) => {
      const speed = index % 2 === 0 ? 0.08 : -0.05;
      const moveY = scrollPosition * speed;
      
      if (moveY > -100 && moveY < 100) {
        // ใช้ CSS Variable ส่งค่าความสูงลง CSS เพื่อไม่ให้ไปทับค่า translateX(20%) เดิม
        box.style.setProperty('--parallax-y', `${moveY}px`);
      }
    });
  });

  // =========================================
  // 5. Smooth Hover Tilt (สำหรับการ์ด Selected Works อันแรก)
  // =========================================
  const featuredCard = document.querySelector('.featured-card');
  if (featuredCard) {
    featuredCard.addEventListener('mousemove', (e) => {
      const rect = featuredCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tiltX = -(y / rect.height) * 10;
      const tiltY = (x / rect.width) * 10;
      
      featuredCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      featuredCard.style.transition = 'transform 0.1s ease-out';
      featuredCard.style.zIndex = '10';
    });

    featuredCard.addEventListener('mouseleave', () => {
      featuredCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      featuredCard.style.transition = 'transform 0.5s ease-out';
      featuredCard.style.zIndex = '1';
    });
  }
// =========================================
  // JS Auto-Scroll & Drag สำหรับ Our Team Section
  // =========================================
  const teamGrid = document.querySelector('.team-bg-grid');

  if (teamGrid) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 1; // ความเร็วการเลื่อนอัตโนมัติ

    // 1. Auto Scroll Loop (สไลด์อัตโนมัติตลอดเวลา)
    function autoScroll() {
      if (!isDown) {
        teamGrid.scrollLeft += autoScrollSpeed;
        
        // เมื่อเลื่อนถึงปลายทาง ให้วนกลับมาจุดเริ่มต้น
        if (teamGrid.scrollLeft >= teamGrid.scrollWidth - teamGrid.clientWidth - 1) {
          teamGrid.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    }

    // เริ่มทำงาน Auto Scroll
    requestAnimationFrame(autoScroll);

    // 2. Drag to Scroll (ระบบคลิกลากด้วยเมาส์)
    teamGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      teamGrid.classList.add('active');
      startX = e.pageX - teamGrid.offsetLeft;
      scrollLeft = teamGrid.scrollLeft;
    });

    teamGrid.addEventListener('mouseleave', () => {
      isDown = false;
      teamGrid.classList.remove('active');
    });

    teamGrid.addEventListener('mouseup', () => {
      isDown = false;
      teamGrid.classList.remove('active');
    });

    teamGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - teamGrid.offsetLeft;
      const walk = (x - startX) * 1.5; // ความเร็วของการลาก
      teamGrid.scrollLeft = scrollLeft - walk;
    });

    // 3. Scroll ด้วยลูกกลิ้งเมาส์ (Mouse Wheel)
    teamGrid.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        teamGrid.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
});


// =========================================
  // Dark Mode Toggle Logic
  // =========================================
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme');

  // ตรวจสอบว่าเคยตั้งค่า Dark Mode ไว้หรือไม่
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  } else {
    // ถ้ายังไม่เคยตั้งค่า ให้ดูว่าระบบปฏิบัติการตั้ง Dark mode ไว้หรือไม่
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
    }
  }

  // ฟังก์ชันสลับโหมดเมื่อกดสวิตช์
  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); // จำค่าไว้
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSwitch.addEventListener('change', switchTheme);