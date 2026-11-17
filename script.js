/**
 * MONTEIRO & ASSOCIADOS — Interatividade, Validação e WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024;

  // Telefone corporativo configurado para WhatsApp institucional
  const CLINIC_WHATSAPP = '5511988887777';

  // 1. Header dinâmico, Scroll Progress e Menu Mobile
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (docHeight > 0 && scrollProgress) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    sections.forEach(section => {
      const top = section.offsetTop - 130;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // 2. Intersection Observer (Animações de entrada)
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Efeito 3D Tilt nos cards de atuação
  if (isDesktopPointer && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      const glare = card.querySelector('.tilt-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;

        if (glare) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(197, 161, 91, 0.15), transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 4. Máscara de telefone
  const phoneInput = document.getElementById('clientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (digits.length > 2) {
        digits = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (digits.length > 0) {
        digits = digits.replace(/^(\d{0,2})/, '($1');
      }
      e.target.value = digits;
    });
  }

  // 5. Validação do formulário e redirecionamento WhatsApp institucional
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientName');
      const emailInput = document.getElementById('clientEmail');
      const areaSelect = document.getElementById('areaSelect');
      const msgInput = document.getElementById('clientMessage');

      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');
      const emailError = document.getElementById('emailError');
      const areaError = document.getElementById('areaError');
      const msgError = document.getElementById('msgError');

      let isValid = true;

      // Validação Nome
      if (nameInput.value.trim().length < 3) {
        nameError.textContent = 'Por favor, informe seu nome completo.';
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameError.textContent = '';
        nameInput.classList.remove('invalid');
      }

      // Validação Telefone
      const rawPhone = phoneInput.value.replace(/\D/g, '');
      if (rawPhone.length < 10) {
        phoneError.textContent = 'Informe um número de contato válido com DDD.';
        phoneInput.classList.add('invalid');
        isValid = false;
      } else {
        phoneError.textContent = '';
        phoneInput.classList.remove('invalid');
      }

      // Validação E-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Informe um e-mail válido.';
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailError.textContent = '';
        emailInput.classList.remove('invalid');
      }

      // Validação Área
      if (!areaSelect.value) {
        areaError.textContent = 'Selecione uma área de atuação.';
        areaSelect.classList.add('invalid');
        isValid = false;
      } else {
        areaError.textContent = '';
        areaSelect.classList.remove('invalid');
      }

      // Validação Mensagem
      if (msgInput.value.trim().length < 5) {
        msgError.textContent = 'Descreva brevemente o assunto.';
        msgInput.classList.add('invalid');
        isValid = false;
      } else {
        msgError.textContent = '';
        msgInput.classList.remove('invalid');
      }

      if (!isValid) return;

      const message = `Olá, equipe *Monteiro & Associados*! Gostaria de solicitar contato institucional.\n\n` +
        `*Nome:* ${nameInput.value.trim()}\n` +
        `*Telefone:* ${phoneInput.value.trim()}\n` +
        `*E-mail:* ${emailInput.value.trim()}\n` +
        `*Área de Interesse:* ${areaSelect.value}\n` +
        `*Mensagem:* ${msgInput.value.trim()}`;

      const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;

      formFeedback.textContent = 'Redirecionando para o atendimento via WhatsApp...';
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});