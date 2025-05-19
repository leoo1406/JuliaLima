/**
 * Julia Lima Designer - Main JavaScript
 *
 * Este arquivo contém todas as funcionalidades JavaScript do site,
 * organizadas em seções para melhor manutenção.
 */
import './style.css';

document.addEventListener("DOMContentLoaded", () => {
  /**
   * =========================================================================
   * 1. NAVEGAÇÃO E SCROLL
   * =========================================================================
   */

  /**
   * Efeito de scroll na navbar
   * Adiciona classe 'scrolled' quando a página é rolada
   */
  const navbar = document.querySelector(".navbar")

  function checkScroll() {
    // Só adiciona a classe scrolled se a navbar não tiver a classe colored
    if (window.scrollY > 50 && !navbar.classList.contains("colored")) {
      navbar.classList.add("scrolled")
    } else if (window.scrollY <= 50 && !navbar.classList.contains("colored")) {
      navbar.classList.remove("scrolled")
    }
  }

  // Verificar posição inicial
  checkScroll()

  // Adicionar evento de scroll
  window.addEventListener("scroll", checkScroll)

  /**
   * Menu Mobile
   * Controla a exibição do menu em dispositivos móveis
   */
  const mobileMenu = document.querySelector(".mobile-menu")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      mobileMenu.classList.toggle("active")
    })
  }

  /**
   * Scroll suave para links de navegação
   * Implementa rolagem suave ao clicar em links internos
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
        navLinks?.classList.remove("active")
        mobileMenu?.classList.remove("active")
      }
    })
  })

  /**
   * Destaque de seção ativa
   * Destaca o link de navegação correspondente à seção visível
   */
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href")?.slice(1) === current) {
        item.classList.add("active")
      }
    })
  })

  /**
   * =========================================================================
   * 2. ANIMAÇÕES E EFEITOS VISUAIS
   * =========================================================================
   */

  /**
   * Animação de números na seção Sobre
   * Anima a contagem de números nas estatísticas
   */
  function animateValue(element, start, end, duration) {
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      element.textContent = Math.floor(progress * (end - start) + start)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  const stats = document.querySelectorAll(".stat-number")
  if (stats.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target
            const endValue = Number.parseInt(target.textContent)
            animateValue(target, 0, endValue, 7500)
            observer.unobserve(target)
          }
        })
      },
      { threshold: 1 },
    )

    stats.forEach((stat) => observer.observe(stat))
  }

  /**
   * =========================================================================
   * 3. CARROSSEL DE PORTFÓLIO
   * =========================================================================
   */

  const portfolioCarousel = document.querySelector(".portfolio-carousel")

  if (portfolioCarousel) {
    // Função para ajustar a velocidade do carrossel com base no tamanho da tela
    function adjustCarouselSpeed() {
      const isMobile = window.innerWidth <= 768

      // Define uma duração diferente para dispositivos móveis e desktop
      if (isMobile) {
        portfolioCarousel.style.animationDuration = "10s" // Mais rápido em dispositivos móveis
        portfolioCarousel.classList.add("mobile-carousel")
      } else {
        portfolioCarousel.style.animationDuration = "40s" // Velocidade normal em desktop
        portfolioCarousel.classList.remove("mobile-carousel")
      }

      // Garante que a animação esteja sempre em execução
      portfolioCarousel.style.animationPlayState = "running"
    }

    // Ajusta a velocidade inicialmente
    adjustCarouselSpeed()

    // Ajusta a velocidade quando a janela é redimensionada
    window.addEventListener("resize", adjustCarouselSpeed)
  }

  /**
   * =========================================================================
   * 4. CARROSSEL DE DEPOIMENTOS
   * =========================================================================
   */

  const testimonialsTrack = document.querySelector(".testimonials-track")
  const testimonialCards = document.querySelectorAll(".testimonial-card")
  const prevButton = document.querySelector(".testimonial-nav.prev")
  const nextButton = document.querySelector(".testimonial-nav.next")
  const dotsContainer = document.querySelector(".testimonial-dots")

  if (testimonialsTrack && testimonialCards.length > 0 && prevButton && nextButton && dotsContainer) {
    let currentIndex = 0
    const totalSlides = testimonialCards.length
    let slideInterval
    let isAudioPlaying = false

    /**
     * Criação dos indicadores (dots)
     */
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("testimonial-dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })

    const dots = document.querySelectorAll(".testimonial-dot")

    /**
     * Atualiza os indicadores ativos
     */
    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }

    /**
     * Navega para um slide específico
     */
    function goToSlide(index) {
      currentIndex = index
      testimonialsTrack.style.transform = `translateX(-${currentIndex * 100}%)`
      updateDots()
    }

    /**
     * Navega para o próximo slide
     */
    function nextSlide() {
      if (isAudioPlaying) return
      currentIndex = (currentIndex + 1) % totalSlides
      goToSlide(currentIndex)
    }

    /**
     * Navega para o slide anterior
     */
    function prevSlide() {
      if (isAudioPlaying) return
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
      goToSlide(currentIndex)
    }

    /**
     * Inicia a navegação automática
     */
    function startAutoSlide() {
      if (!isAudioPlaying) {
        slideInterval = setInterval(nextSlide, 5000)
      }
    }

    /**
     * Para a navegação automática
     */
    function stopAutoSlide() {
      clearInterval(slideInterval)
    }

    // Eventos dos botões de navegação
    prevButton.addEventListener("click", () => {
      stopAutoSlide()
      prevSlide()
      startAutoSlide()
    })

    nextButton.addEventListener("click", () => {
      stopAutoSlide()
      nextSlide()
      startAutoSlide()
    })

    // Inicia a navegação automática
    startAutoSlide()

    const testimonialsContainer = document.querySelector(".testimonials-container")

    if (testimonialsContainer) {
      // Pausa a navegação automática ao passar o mouse
      testimonialsContainer.addEventListener("mouseenter", stopAutoSlide)
      testimonialsContainer.addEventListener("mouseleave", startAutoSlide)
    }

    /**
     * Suporte a gestos de toque (swipe)
     */
    let touchStartX = 0
    let touchEndX = 0

    testimonialsTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX
    })

    testimonialsTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].clientX
      handleSwipe()
    })

    function handleSwipe() {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        stopAutoSlide()
        if (diff > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
        startAutoSlide()
      }
    }

    /**
     * =========================================================================
     * 5. PLAYER DE ÁUDIO PARA DEPOIMENTOS
     * =========================================================================
     */

    const audioPlayers = document.querySelectorAll(".audio-player")

    audioPlayers.forEach((player) => {
      const audioUrl = player.dataset.audio
      const audioElement = player.querySelector(".audio-element")
      const playBtn = player.querySelector(".play-btn")
      const progressBar = player.querySelector(".progress-bar")
      const progressContainer = player.querySelector(".progress-container")
      const timeDisplay = player.querySelector(".time")

      audioElement.src = audioUrl

      /**
       * Funcionalidade de Play/Pause
       */
      playBtn.addEventListener("click", () => {
        if (audioElement.paused) {
          // Pausa outros áudios em reprodução
          document.querySelectorAll(".audio-element").forEach((audio) => {
            if (audio !== audioElement && !audio.paused) {
              audio.pause()
              const otherPlayer = audio.closest(".audio-player")
              const otherPlayBtn = otherPlayer.querySelector(".play-btn i")
              otherPlayBtn.className = "fas fa-play"
            }
          })

          isAudioPlaying = true
          stopAutoSlide()

          audioElement.play()
          playBtn.querySelector("i").className = "fas fa-pause"
        } else {
          audioElement.pause()
          playBtn.querySelector("i").className = "fas fa-play"

          // Verifica se ainda há algum áudio em reprodução
          const anyAudioPlaying = Array.from(document.querySelectorAll(".audio-element")).some((audio) => !audio.paused)

          if (!anyAudioPlaying) {
            isAudioPlaying = false
            startAutoSlide()
          }
        }
      })

      /**
       * Atualização da barra de progresso
       */
      audioElement.addEventListener("timeupdate", () => {
        const progress = (audioElement.currentTime / audioElement.duration) * 100
        progressBar.style.width = `${progress}%`

        const minutes = Math.floor(audioElement.currentTime / 60)
        const seconds = Math.floor(audioElement.currentTime % 60)
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      })

      /**
       * Funcionalidade de busca (seek)
       */
      progressContainer.addEventListener("click", (e) => {
        const clickPosition = e.offsetX / progressContainer.offsetWidth
        const seekTime = clickPosition * audioElement.duration
        audioElement.currentTime = seekTime
      })

      /**
       * Reset ao final do áudio
       */
      audioElement.addEventListener("ended", () => {
        progressBar.style.width = "0%"
        playBtn.querySelector("i").className = "fas fa-play"
        timeDisplay.textContent = "0:00"

        // Verifica se ainda há algum áudio em reprodução
        const anyAudioPlaying = Array.from(document.querySelectorAll(".audio-element")).some(
          (audio) => !audio.paused && audio !== audioElement,
        )

        if (!anyAudioPlaying) {
          isAudioPlaying = false
          startAutoSlide()
        }
      })

      /**
       * Carregamento de metadados
       */
      audioElement.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audioElement.duration / 60)
        const seconds = Math.floor(audioElement.duration % 60)
        timeDisplay.textContent = `0:00 / ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      })
    })
  }
})
