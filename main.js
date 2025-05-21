document.addEventListener("DOMContentLoaded", () => {

  const navbar = document.querySelector(".navbar")

  function checkScroll() {
    if (window.scrollY > 50 && !navbar.classList.contains("colored")) {
      navbar.classList.add("scrolled")
    } else if (window.scrollY <= 50 && !navbar.classList.contains("colored")) {
      navbar.classList.remove("scrolled")
    }
  }

  checkScroll()

  window.addEventListener("scroll", checkScroll)

  const mobileMenu = document.querySelector(".mobile-menu")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      mobileMenu.classList.toggle("active")
    })
  }

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

  const portfolioCarousel = document.querySelector(".portfolio-carousel")

  if (portfolioCarousel) {
    function adjustCarouselSpeed() {
      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        portfolioCarousel.style.animationDuration = "10s"
        portfolioCarousel.classList.add("mobile-carousel")
      } else {
        portfolioCarousel.style.animationDuration = "40s"
        portfolioCarousel.classList.remove("mobile-carousel")
      }

      portfolioCarousel.style.animationPlayState = "running"
    }

    adjustCarouselSpeed()

    window.addEventListener("resize", adjustCarouselSpeed)
  }

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

    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("testimonial-dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })

    const dots = document.querySelectorAll(".testimonial-dot")

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }

    function goToSlide(index) {
      currentIndex = index
      testimonialsTrack.style.transform = `translateX(-${currentIndex * 100}%)`
      updateDots()
    }

    function nextSlide() {
      if (isAudioPlaying) return
      currentIndex = (currentIndex + 1) % totalSlides
      goToSlide(currentIndex)
    }

    function prevSlide() {
      if (isAudioPlaying) return
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
      goToSlide(currentIndex)
    }

    function startAutoSlide() {
      if (!isAudioPlaying) {
        slideInterval = setInterval(nextSlide, 5000)
      }
    }

    function stopAutoSlide() {
      clearInterval(slideInterval)
    }

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

    startAutoSlide()

    const testimonialsContainer = document.querySelector(".testimonials-container")

    if (testimonialsContainer) {
      testimonialsContainer.addEventListener("mouseenter", stopAutoSlide)
      testimonialsContainer.addEventListener("mouseleave", startAutoSlide)
    }

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

    const audioPlayers = document.querySelectorAll(".audio-player")

    audioPlayers.forEach((player) => {
      const audioUrl = player.dataset.audio
      const audioElement = player.querySelector(".audio-element")
      const playBtn = player.querySelector(".play-btn")
      const progressBar = player.querySelector(".progress-bar")
      const progressContainer = player.querySelector(".progress-container")
      const timeDisplay = player.querySelector(".time")

      audioElement.src = audioUrl

      playBtn.addEventListener("click", () => {
        if (audioElement.paused) {
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

          const anyAudioPlaying = Array.from(document.querySelectorAll(".audio-element")).some((audio) => !audio.paused)

          if (!anyAudioPlaying) {
            isAudioPlaying = false
            startAutoSlide()
          }
        }
      })

      audioElement.addEventListener("timeupdate", () => {
        const progress = (audioElement.currentTime / audioElement.duration) * 100
        progressBar.style.width = `${progress}%`

        const minutes = Math.floor(audioElement.currentTime / 60)
        const seconds = Math.floor(audioElement.currentTime % 60)
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      })

      progressContainer.addEventListener("click", (e) => {
        const clickPosition = e.offsetX / progressContainer.offsetWidth
        const seekTime = clickPosition * audioElement.duration
        audioElement.currentTime = seekTime
      })

      audioElement.addEventListener("ended", () => {
        progressBar.style.width = "0%"
        playBtn.querySelector("i").className = "fas fa-play"
        timeDisplay.textContent = "0:00"

        const anyAudioPlaying = Array.from(document.querySelectorAll(".audio-element")).some(
          (audio) => !audio.paused && audio !== audioElement,
        )

        if (!anyAudioPlaying) {
          isAudioPlaying = false
          startAutoSlide()
        }
      })

      audioElement.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audioElement.duration / 60)
        const seconds = Math.floor(audioElement.duration % 60)
        timeDisplay.textContent = `0:00 / ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      })
    })
  }
})
